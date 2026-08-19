# HACKY (Haccman 2.0)

Arcade game for jailbreaking LLMs — players chat with bots and try to get
each one to break its own rules (leak data, ignore a policy, etc.).

## Staying Current

_Last updated: 2026-08-19_

- After a structural change (workspace added/removed, stack/commands changed), recheck this file — if stale, flag the fix as needed (not optional) and wait for approval before editing.

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

- Content ids: `id`/`botId`/`taskId` matched across `bots.json`/`tasks.json`/`winRules.json`
- Migrations: `NNNN_description.sql`
- Eval results: `run_<timestamp>_..._x<variations>.json` (auto-named by `test-bots.js`)

## Avoid

- No Supabase calls outside `src/services/`.
- Don't edit an already-applied migration.
- Don't touch `.env` files.

## Rules for Claude

Behavioral rules live here or in the relevant `CONTEXT.md` — never in Claude's private memory.
