# Workspace: Planning (planning/)

Specs, architecture notes, and decision records — the *why*, written before
or alongside implementation. Distinct from `TASKS.md` (informal,
edit-freely backlog at repo root) and from a `CONTEXT.md` (how to work in a
workspace, not why it's built that way).

## Staying Current

_Last updated: 2026-08-19_

Policy: see root [CLAUDE.md § Staying Current](../CLAUDE.md#staying-current).

## What lives here

- `architecture/` — system-level design docs.
  [`chat-message-flow.md`](architecture/chat-message-flow.md) traces a
  player message: `ChatWindow` → `chatService` → `functions/ai` edge
  function → OpenAI → back.
- `decisions/` — short dated ADRs ("we chose X over Y, because Z"). Not
  populated yet — first candidate is the deploy-target choice, once made
  (see `TASKS.md`).
- `specs/` — feature specs written ahead of implementation, if/when that
  becomes the workflow. Not populated yet.

## Avoid

- Don't backfill a decision record for a choice no one actually weighed at
  the time — an ADR documents a real decision, not a retroactive
  justification.
