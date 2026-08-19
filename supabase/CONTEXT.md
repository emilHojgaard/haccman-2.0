# Workspace: Backend (supabase/)

Postgres schema, RLS policies, and Deno edge functions.

## Staying Current

_Last updated: 2026-08-19_

Policy: see root [CLAUDE.md § Staying Current](../CLAUDE.md#staying-current).

## What lives here

- `migrations/` — SQL, applied in order against a Supabase project:
  - `0001_init.sql` — players/sessions/prompts/responses (core game data)
  - `0002_rag.sql` — RAG schema + search functions for Dr. Chatbot (needs
    the `vector` and `pg_trgm` extensions, enabled by the migration itself)
  - `0003_admin.sql` — admin allowlist + read policies
  - `0004_rag_grants.sql` — grants for the RAG schema
- `functions/ai/` — the edge function Dr. Chatbot's chat calls hit. Deno +
  TypeScript. Retrieves from the RAG corpus, builds context, calls OpenAI.
  Helpers live in `functions/ai/helpers/` (`detectIntent`, `buildContext`,
  `embedWithOpenAI`, `promptStatements`, `normlizeForRetrieval`).
- `functions/classify/` — classifies a player message against a 7-family,
  29-technique jailbreak taxonomy (Sorokoletova et al., 2025). Used to tag
  strategies for the admin dashboard / eval harness, not for gameplay itself.
- `functions/admin/` — currently empty. Admin operations
  (`src/services/adminService.js`) go straight through `supabase-js` against
  RLS-protected tables, not through an edge function. Don't assume this
  folder is wired up to anything.

## Process

1. Schema changes: write a new numbered migration file (see Avoid).
2. Edge function changes: edit under `functions/<name>/`, then deploy with
   the Supabase CLI (`supabase functions deploy <name> --project-ref ...`).
   Secrets (`OPENAI_API_KEY`, etc.) are set via `supabase secrets set`, not
   committed anywhere.
3. Admin access is a real Supabase Auth user allowlisted in the `admins`
   table — not a parallel password system. See root `README.md` for the
   exact setup steps.

## Conventions

- CORS headers and the `OPTIONS` preflight handler at the top of every edge
  function `index.ts` — copy the existing pattern, don't reinvent it per
  function.
- Edge functions read secrets via `Deno.env.get(...)`, never hardcoded.
- RAG tables live in their own `RAG` Postgres schema (see
  `rag/CONTEXT.md`), not `public`.

## Avoid

- Don't edit an already-applied migration — add a new one.
- Don't put OpenAI or service-role keys in client-side (`src/`) code; they
  belong only in edge functions / offline scripts.
