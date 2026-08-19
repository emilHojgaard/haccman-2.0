# Tasks

Ongoing/planned work. Not a structural doc — no staleness-check policy, edit freely.

## Now

(nothing queued — pick from Next)

## Next

(nothing queued — pick from Later/ideas)

## Later / ideas

- Short root-level architecture/data-flow note (chat message: PlayPage →
  service → edge function → OpenAI → back) — currently only reconstructable
  by reading 3 separate CONTEXT.md files.
- `CLAUDE.md` Commands list is missing `npm run preview` (present in
  `package.json`, not in the doc).
- Decide deploy target (`CLAUDE.md` still says "not yet decided").

## Recently done

- [x] Deduped the "Staying Current" boilerplate: root `CLAUDE.md` now states
      the policy once, and all 4 `CONTEXT.md` files link back to it instead
      of repeating it (2026-08-19).
- [x] Added a `README.md` row to the `CLAUDE.md` Routing table — README ↔
      CLAUDE.md now link both ways (2026-08-19).
- [x] Rewrote `README.md`: fixed Supabase setup drift (added
      `0004_rag_grants.sql`, `functions/classify` deploy step), dropped the
      "Project layout" section (redundant with `CLAUDE.md` + the folders
      themselves), tightened prose throughout, and pointed the missing
      `.env.example` reference at the real `.env` setup (2026-08-19).
- [x] Wrote `CLAUDE.md` + per-workspace `CONTEXT.md` files (2026-08-19).
