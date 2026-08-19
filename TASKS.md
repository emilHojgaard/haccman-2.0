# Tasks

Ongoing/planned work. Not a structural doc — no staleness-check policy, edit freely.

## Now

- [ ] Fix `README.md` Supabase setup section — it's drifted from `supabase/CONTEXT.md`:
      missing `0004_rag_grants.sql` in the migration steps, and no mention of
      `functions/classify` or `functions/admin`.

## Next

- [ ] Dedupe the "Staying Current" boilerplate copy-pasted across all 5
      `CLAUDE.md`/`CONTEXT.md` files — it's a repo-wide policy, could live
      once in root `CLAUDE.md` with children linking back.
- [ ] Cross-link `README.md` and `CLAUDE.md` — right now neither points to
      the other despite overlapping content (one's for humans, one's for
      agents).
- [ ] Add a single env var inventory (which var, needed where, set how) —
      currently `OPENAI_API_KEY` / `SUPABASE_URL` / `VITE_SUPABASE_URL` /
      `SUPABASE_SERVICE_ROLE_KEY` etc. are each documented ad hoc across
      different files.

## Later / ideas

- Short root-level architecture/data-flow note (chat message: PlayPage →
  service → edge function → OpenAI → back) — currently only reconstructable
  by reading 3 separate CONTEXT.md files.
- `CLAUDE.md` Commands list is missing `npm run preview` (present in
  `package.json`, not in the doc).
- Decide deploy target (`CLAUDE.md` still says "not yet decided").

## Recently done

- [x] Wrote `CLAUDE.md` + per-workspace `CONTEXT.md` files (2026-08-19).
