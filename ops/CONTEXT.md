# Workspace: Ops (ops/)

Deploy configuration, monitoring, and operational scripts — infrastructure
as code.

## Staying Current

_Last updated: 2026-08-19_

Policy: see root [CLAUDE.md § Staying Current](../CLAUDE.md#staying-current).

## What lives here

Not populated yet — blocked on picking a deploy target (`code/CONTEXT.md`
Tech Stack still says "not yet decided"). Intended layout once that's
chosen:

- `deploy/` — deploy config/manifests for the chosen target
- `monitoring/` — logging/alerting setup, if adopted

## Avoid

- Don't add deploy scaffolding for a target that hasn't been chosen yet.
- Don't name anything here `scripts/` — `code/scripts/` already means the
  eval harness; a same-named sibling would be confusing.
