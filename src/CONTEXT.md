# Workspace: Game (src/)

This is HACKY itself — the React/Vite frontend players interact with.

## Staying Current

_Last updated: 2026-08-19_

Policy: see root [CLAUDE.md § Staying Current](../CLAUDE.md#staying-current).

## What lives here

- `content/` — `bots.json`, `tasks.json`, `winRules.json`. The actual game
  design: which bots exist, what task/objective goes with each bot, and
  what counts as beating it. Edit these to add or tune content; no code
  change required.
- `engine/winDetector.js` — pure function, `checkWin(taskId, botResponseText)
  -> boolean`. No UI, no network calls. Reads `winRules.json` and matches
  bot output against phrase/keyword rules (see Conventions for the
  `reject`-list requirement).
- `services/` — thin wrappers around `@supabase/supabase-js`
  (`chatService`, `sessionService`, `playerService`, `adminService`,
  `supabaseClient`). All Supabase calls funnel through here — components
  never import the Supabase client directly.
- `store/gameStore.js` — single Zustand store. Replaces prop drilling
  across pages.
- `components/`, `pages/` — UI. Pages: Intro → ChooseBot → Play → (Admin).
- `theme/` — `tokens.css` + `components.css`, the neon-terminal visual style.

## Process

1. Game content changes (new bot, new task, tweaked win phrasing) start in
   `content/`. Check `id`/`botId`/`taskId` line up across all three JSON
   files before anything else.
2. If a task's win condition needs new logic (not just new phrases), that's
   `engine/winDetector.js` — keep it a pure function over `(taskId, text)`.
   Don't reach into Supabase or React state from here.
3. If the change needs new persisted data, add a Supabase migration first
   (see [supabase/CONTEXT.md](../supabase/CONTEXT.md)), then extend the
   matching file in `services/`.
4. UI work reads from the store and calls `services/` (see Avoid).

## Conventions

- Functional components only, `.jsx`.
- Win-rule types: `phrase`, `keyword-and`, `phrase-or-keyword`,
  `narrative-hint` (no automatic win — left to player/host judgement). See
  `winDetector.js` for exact matching semantics per type.
- Every win rule should carry a `reject` list of refusal/policy phrases so
  a bot describing its own guardrails doesn't get scored as a win.
- Bot `concept` field (name/tagline/description) is player-facing — it
  explains the underlying AI-safety concept the bot demonstrates (RAG,
  prompt injection, etc.), shown before or after a round.

## Avoid

- Don't put Supabase calls in components or pages — go through `services/`.
- Don't let `engine/` depend on anything network- or UI-related.
- Don't hand-edit `id`/`botId`/`taskId` in one JSON file without checking
  the other two.
