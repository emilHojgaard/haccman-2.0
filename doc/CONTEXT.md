# Workspace: Docs (doc/)

Reference documentation: API contracts, how-to guides, changelog. This is
about how the shipped thing behaves, for readers outside the immediate dev
loop — distinct from a `CONTEXT.md` (how to work in a workspace) and from
`planning/` (why it's built the way it is).

## Staying Current

_Last updated: 2026-08-19_

Policy: see root [CLAUDE.md § Staying Current](../CLAUDE.md#staying-current).

## What lives here

Not populated yet. Intended layout, once there's real content to put here:

- `api/` — request/response contracts for the edge functions
  (`functions/ai`, `functions/classify`)
- `guides/` — how-tos (e.g. admin dashboard usage)
- `changelog/` — dated release log (distinct from `TASKS.md`'s informal
  "Recently done" list)

## Avoid

- Don't add a stub file here just to make a subfolder look used — an
  honestly-empty folder beats a placeholder that reads like real content.
