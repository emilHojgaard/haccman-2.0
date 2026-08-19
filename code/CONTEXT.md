# Workspace: Code (code/)

The application itself — frontend, backend, RAG corpus tooling, and the
eval harness. All runnable code and its build/deploy tooling lives here,
one level below the repo root.

## Staying Current

_Last updated: 2026-08-19_

Policy: see root [CLAUDE.md § Staying Current](../CLAUDE.md#staying-current).

## Tech Stack

- Frontend: React 19 + Vite (`.jsx`, not TS)
- State: Zustand
- Backend: Supabase (Postgres + Auth + Deno edge functions)
- Attacker/embeddings: OpenAI
- Deploy: not yet decided
- Commands (run from `code/`): `npm run dev` / `build` / `lint` / `preview`
- `.env` lives at `code/.env` (gitignored) — not repo root.

## Sub-workspaces

- `src/` — the game: content/engine/services/store/UI.
- `supabase/` — backend: migrations, edge functions.
- `rag/` — document corpus + embedding scripts.
- `scripts/` — LLM-vs-LLM eval harness.
- `public/` — static assets served as-is (sounds, favicon, the published
  eval result JSON).

Each has its own `CONTEXT.md` with what lives there, its process, and its
own naming/Avoid rules.

## Routing

| Task                | Go to       | Read                  |
| ------------------- | ----------- | ---------------------- |
| Run game code       | `src/`      | `src/CONTEXT.md`      |
| Ship backend code   | `supabase/` | `supabase/CONTEXT.md` |
| Embed RAG documents | `rag/`      | `rag/CONTEXT.md`      |
| Run eval harness    | `scripts/`  | `scripts/CONTEXT.md`  |

## Naming conventions

- `src/`: components/pages `PascalCase.jsx`; services/store/engine `camelCase.js`
- `supabase/`: migrations `NNNN_description.sql`; edge functions `functions/<name>/index.ts`
- `rag/`: one `.txt` per doc, human-readable filename (not an id); `patient_journals/journalN.txt` sequential, no reuse
- `scripts/`: eval runs auto-name to `run_<timestamp>_..._x<variations>.json` (via `test-bots.js`)

## Avoid

- No Supabase calls outside `src/services/`.
- Don't edit an already-applied migration.
- Don't touch `.env`.
