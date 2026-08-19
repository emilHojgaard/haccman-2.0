# HACKY (Haccman 2.0)

Arcade game for jailbreaking LLMs — players chat with bots and try to get
each one to break its own rules (leak data, ignore a policy, etc.).

## Staying Current

_Last updated: 2026-08-19_

- This file: after a structural change (workspace added/removed, stack/commands changed), recheck it — if stale, flag the fix (not optional) and wait for approval before editing.
- Each `CONTEXT.md` follows the same rule for its own workspace and links back here instead of repeating it.

## Workspaces

Workspaces are phases of the project, not parts of the app — `code/` is
one workspace among four, not a stand-in for "the repo."

- `code/` — the application: frontend, backend, RAG tooling, eval harness.
  Tech stack, commands, and app-part routing live in `code/CONTEXT.md`.
- `doc/` — reference docs (API contracts, guides, changelog).
- `planning/` — specs, architecture notes, decision records.
- `ops/` — deploy config, monitoring, operational scripts.

## Routing

| Task                     | Go to        | Read                 |
| ------------------------ | ------------ | -------------------- |
| Build/run/ship the app   | `code/`      | `code/CONTEXT.md`    |
| Read/write reference docs| `doc/`       | `doc/CONTEXT.md`     |
| Plan work, record a decision | `planning/` | `planning/CONTEXT.md` |
| Deploy/operate           | `ops/`       | `ops/CONTEXT.md`     |
| Track ongoing work       | root         | `TASKS.md` (local only, not pushed) |
| Set up/run the app       | root         | `README.md`          |

## Rules for Claude

Behavioral rules live here or in the relevant `CONTEXT.md` — never in Claude's private memory.
