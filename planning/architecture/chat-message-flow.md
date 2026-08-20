# Chat message data flow

Traces one player message from keystroke to rendered bot reply. Reconstructed
by reading [ChatWindow.jsx](../../code/src/components/ChatWindow.jsx),
[chatService.js](../../code/src/services/chatService.js), and
[functions/ai/index.ts](../../code/supabase/functions/ai/index.ts) directly —
write it down here instead of re-deriving it next time.

## Overview

```
ChatWindow.handleSend()
  ├─> insertPrompt()               Supabase: insert into `prompts`
  ├─> classifyPrompt()             fire-and-forget → functions/v1/classify
  └─> askBot()                     → functions/v1/ai → OpenAI → reply
        ├─> insertResponse()       Supabase: insert into `responses`
        ├─> addMessage()           Zustand store, renders the bubble
        └─> checkWin()             local, no network call
```

## Step by step

1. **Player sends a message.** `ChatWindow.handleSend()`
   ([ChatWindow.jsx:56](../../code/src/components/ChatWindow.jsx#L56))
   optimistically appends the user message to the Zustand store, then:

2. **Prompt is persisted first.** `insertPrompt(sessionId, text)`
   ([chatService.js:23](../../code/src/services/chatService.js#L23)) inserts
   a row into the `prompts` table and returns it — every later step
   references `prompt.id`.

3. **Strategy classification fires in the background.**
   `classifyPrompt(prompt.id, text, history, task.task)`
   ([chatService.js:44](../../code/src/services/chatService.js#L44)) POSTs to
   `functions/v1/classify`. This is **not awaited** — `.catch()` only logs a
   warning, and it never blocks or fails the chat turn. The edge function
   ([functions/classify/index.ts:253](../../code/supabase/functions/classify/index.ts#L253))
   runs its own `gpt-4o-mini` call against a fixed jailbreak-taxonomy
   codebook (7 families / 29 techniques, from Sorokoletova et al. 2025) and
   writes the result back with `UPDATE prompts SET strategy_tags = ... WHERE
   id = promptId` — there's no separate classifications table, it patches
   the same `prompts` row `insertPrompt()` created in step 2, keyed by
   `promptId`. That's what `PlayPage`'s win overlay later reads via
   `loadSessionMessages(sessionId)` → `m.strategy_tags`.

4. **The actual bot call.** `askBot({ message, systemPrompt, constrain,
   guardrail: true, useRag, previousPrompts })`
   ([chatService.js:5](../../code/src/services/chatService.js#L5)) attaches
   the Supabase auth token (if any) and POSTs to `functions/v1/ai`.
   `useRag` is `Boolean(bot.ragEnabled)` — currently `true` only for bot id
   `0`, Dr. Chatbot (`bots.json`); every other bot takes the plain path.

5. **Edge function (`functions/ai/index.ts`) branches on `useRag`:**

   - **`useRag: false` (plain).** One `gpt-4o-mini` completion:
     `system = task.systemPrompt + task.constrain`, then chat history, then
     the new message. No retrieval. Returns
     `{ mode: "plain", aiResponsetext, sources: [], sourceRefs: [] }`.

   - **`useRag: true` (Dr. Chatbot).** `detectIntent(message)` picks a
     retrieval mode first:
     - **`full` / `summary`** — build a query from detected entities
       (journal id, CPR number, name, known doc), call the
       `full_text_search` RPC, get back a *single* document, and splice its
       title/text into the prompt as `assistant` messages ahead of the
       system prompt. `full` and `summary` differ only in which
       `contextPromptFull` / `contextPromptSummary` framing is used.
     - **`hybrid` (fallback, no entities detected)** — normalize the
       message, embed it via OpenAI (`embedWithOpenAI`), call the
       `hybrid_search_chunks_rrf` RPC for the top 12 chunks, filter to
       `embedding_score >= 0.3 || keyword_score > 0.09`, and stitch the
       survivors into a `Context:` block (`buildContext`).
     - Either way, one `gpt-4o-mini` completion is issued the same way as
       the plain path, just with the extra document/context messages
       prepended. Returns `{ mode, aiResponsetext, sources, document,
       sourceRefs }` — `sources` (chunk-level scores) only exists for
       `hybrid`; `full`/`summary` return `sources: []` and populate
       `document` instead.

   All three branches call the same OpenAI endpoint
   (`api.openai.com/v1/chat/completions`) directly from the edge function —
   the browser never talks to OpenAI.

6. **Response comes back to `ChatWindow`.** `insertResponse(prompt.id,
   aiResponsetext, sources)` persists the reply to the `responses` table,
   then `addMessage()` renders the bot bubble (with `sourceRefs` shown as a
   citation line if present).

7. **Win check.** `checkWin(task.id, aiResponsetext)`
   ([winDetector.js](../../code/src/engine/winDetector.js)) runs entirely
   client-side against `winRules.json` (phrase / keyword-and /
   phrase-or-keyword / narrative-hint matching, with a `reject` list that
   overrides a match if the bot is just refusing). No network call. On a
   win: `markTaskCompleted()` + `endSession(sessionId, { completed: true
   })`.

## Notable properties

- **Classification is decoupled from the win path.** `classifyPrompt`'s
  `strategy_tags` are cosmetic (shown in the "why it worked" overlay) — the
  actual win/lose decision never depends on them, and a slow/failed classify
  call can't block or break a chat turn.
- **RAG mode is a per-bot flag, not a per-message choice.** `useRag` is
  fixed by `bot.ragEnabled` in `bots.json`, decided before the message is
  ever sent.
- **Retrieval mode inside RAG is intent-detected, not player-chosen.**
  `detectIntent` regex-matches the message for entities (journal id, CPR,
  name) to pick `full`/`summary`/`hybrid` — this is itself part of the
  challenge surface for Dr. Chatbot (players probe which intent path leaks
  which document).
- **The edge function holds the only OpenAI key.** Both the completion call
  and (for hybrid mode) the embedding call happen server-side in
  `functions/ai`; the frontend never sees `OPENAI_API_KEY`.
