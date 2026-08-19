# HACKY (Haccman 2.0)

Arcade game for jailbreaking LLMs — players chat with bots and try to get
each one to break its own rules (leak data, ignore a policy, etc.).

## Staying Current

_Last updated: 2026-08-19_

- This file: after a structural change (workspace added/removed, stack/commands changed), recheck it — if stale, flag the fix (not optional) and wait for approval before editing.
- Each `CONTEXT.md` follows the same rule for its own workspace and links back here instead of repeating it.

## Tech Stack

- Frontend: React 19 + Vite (`.jsx`, not TS)
- State: Zustand
- Backend: Supabase (Postgres + Auth + Deno edge functions)
- Attacker/embeddings: OpenAI
- Deploy: not yet decided
- Commands: `npm run dev` / `build` / `lint`

## Workspaces

- `src/` — the game: content/engine/services/store/UI
- `supabase/` — backend: migrations, edge functions
- `rag/` — document corpus + embedding scripts
- `scripts/` — LLM-vs-LLM eval harness

## Routing

| Task                | Go to       | Read                  |
| ------------------- | ----------- | --------------------- |
| Run game code       | `src/`      | `src/CONTEXT.md`      |
| Ship backend code   | `supabase/` | `supabase/CONTEXT.md` |
| Embed RAG documents | `rag/`      | `rag/CONTEXT.md`      |
| Run eval harness    | `scripts/`  | `scripts/CONTEXT.md`  |
| Track ongoing work  | root        | `TASKS.md`            |
| Set up/run the app  | root        | `README.md`           |

## Naming conventions

- `src/`: components/pages `PascalCase.jsx`; services/store/engine `camelCase.js`
- `supabase/`: migrations `NNNN_description.sql`; edge functions `functions/<name>/index.ts`
- `rag/`: one `.txt` per doc, human-readable filename (not an id); `patient_journals/journalN.txt` sequential, no reuse
- `scripts/`: eval runs auto-name to `run_<timestamp>_..._x<variations>.json` (via `test-bots.js`)

## Avoid

- No Supabase calls outside `src/services/`.
- Don't edit an already-applied migration.
- Don't touch `.env` files.

## Rules for Claude

Behavioral rules live here or in the relevant `CONTEXT.md` — never in Claude's private memory.
