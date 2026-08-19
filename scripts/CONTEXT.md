# Workspace: Eval Harness (scripts/)

Automated LLM-vs-LLM testing: an attacker model runs jailbreak strategies
against each bot/task, and win detection is graded — either by the keyword
engine (`src/engine/winDetector.js`) or an LLM judge. This workspace runs
*against* the game; it doesn't ship as part of it.

## Staying Current

_Last updated: 2026-08-19_

Policy: see root [CLAUDE.md § Staying Current](../CLAUDE.md#staying-current).

## What lives here

- `test-bots.js` — the harness. Loads `src/content/{bots,tasks,winRules}.json`
  directly (no build step), runs conversations, checks wins, writes results.
  Flags are documented in the file's own header comment — read that rather
  than this file; it's the single source of truth and won't drift out of sync.
- `STRATEGIES` (inside `test-bots.js`) — the attacker's playbook, grouped
  into families (Impersonation & Fictional Scenarios, etc.), each with a
  `label`, `taxonomy` tag, and a `description` prompt fragment. This is the
  attacker-side counterpart to the classifier taxonomy in
  `supabase/functions/classify/`.
- `results/` — one JSON file per run (see naming convention in root
  `CLAUDE.md`), plus a few hand-named comparison runs
  (`task0-julie-bang*.json` etc.) kept for reference.
- `test-results.json`, `old-test-results.json` — the "current" and
  "previous" published result sets; `--publish` copies a run to
  `public/test-results.json` for the admin page to read.
- `.env` — local only (`OPENAI_API_KEY`, `VITE_SUPABASE_URL`, etc.), never committed.

## Process

1. Requires `OPENAI_API_KEY` (attacker LLM) and Supabase env vars, loaded
   from `scripts/.env` or the repo-root `.env`.
2. Run a scoped test while iterating (`--tasks`, `--strategies`,
   `--variations 1-2`) — full sweeps are slow and cost real OpenAI spend.
3. Use `--judge` when you need an authoritative win/no-win call beyond
   keyword matching; it records both verdicts so you can compare.
4. Only pass `--publish` for a run you actually want surfaced on `/admin`.

## Conventions

- Every run auto-names its output file (see root `CLAUDE.md` naming
  convention) unless `--output` is given explicitly.
- Strategy names in `--strategies` must match keys in the `STRATEGIES`
  object in `test-bots.js`, not the human-readable `label`.

## Avoid

- Don't treat `results/` as disposable — old runs are the only record of
  how win detection behaved before an engine/prompt change.
