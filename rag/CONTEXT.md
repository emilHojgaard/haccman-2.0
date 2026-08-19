# Workspace: RAG Corpus (rag/)

The document library Dr. Chatbot retrieves from, plus the scripts that
generate and embed it. This is content curation, not app code — most work
here doesn't touch `src/` at all.

## Staying Current

_Last updated: 2026-08-19_

Policy: see root [CLAUDE.md § Staying Current](../CLAUDE.md#staying-current).

## What lives here

- `patient_journals/` — synthetic confidential patient records (the thing
  players are trying to get Dr. Chatbot to leak). `fullnames.json` and
  `cprs.json` hold the identity data referenced across journals. These are
  the sensitive documents — win rules in `src/content/winRules.json`
  reference names/CPR numbers/phrases that live in here.
- `general_guidelines/`, `medical_guidelines/`, `nursing_guidelines/`,
  `nursing_tasks/` — non-confidential reference documents, one `.txt` per
  condition/task, same base filename reused across the guideline folders
  (e.g. `Acute_Pancreatitis.txt` in both `general_guidelines/` and
  `medical_guidelines/`).
- `generateDiseaseDocs.js`, `generateJournals.js`,
  `generateMedicalGuidelines.js`, `generateNurseGuidelines.js`,
  `generateNursingTasks.js` — one-off generation scripts that produced the
  above corpora (LLM-generated synthetic content). Re-run only if you're
  regenerating a whole category, not for one-off edits.
- `embeddingJavascript.js` — reads every file under the five corpus
  folders, embeds them (`OPENAI_EMBED_MODEL`, default
  `text-embedding-3-small`), and uploads to the Supabase `RAG` schema.
  **Clears existing RAG rows first** — it's a full re-sync, not an append.

## Process

1. To add/edit a document: just add/edit the `.txt` file in the right
   folder. No code change needed.
2. To push corpus changes live: run `node rag/embeddingJavascript.js` from
   this folder with `OPENAI_API_KEY`, `SUPABASE_URL`, and
   `SUPABASE_SERVICE_ROLE_KEY` set (a local `rag/.env` works).
3. If a task's win condition depends on journal content, keep
   `src/content/winRules.json` phrasing in sync with what's actually in the
   journal — the win detector matches literal phrases/keywords, not meaning.

## Conventions

- One `.txt` file per condition/task/journal. Filenames are the
  human-readable subject, not an id.
- `patient_journals/journalN.txt` — sequential numbering, no reuse.

## Avoid

- Don't run `embeddingJavascript.js` casually for a one-file edit — see
  above, it re-syncs the entire corpus.
- Don't put real personal data in `patient_journals/` — it's synthetic by
  design; keep it that way.
