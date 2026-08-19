# Haccman 2.0

An arcade game for jailbreaking LLMs. Chat with a roster of bots and try to
get each one to break its own rules.

Game content (bots/tasks/win-rules) lives in JSON, win detection is a pure
function, Supabase calls live in a thin service layer, and a single Zustand
store replaces prop drilling. See [CLAUDE.md](CLAUDE.md) for the full
workspace layout and stack.

## Run it locally (no Supabase yet)

```
cd code
npm install
npm run dev
```

The app boots without any Supabase config — you'll see a console warning,
and onboarding falls through to the username form, so you can preview the
UI immediately. Anything backed by Supabase (saving a profile, starting a
session, chatting with a bot, the admin dashboard) needs the setup below.

## Connecting Supabase

1. Create a new Supabase project (keep it separate from any older Haccman
   project — this one needs its own data).
2. In the SQL editor, run the migrations in `code/supabase/migrations/` in
   order (`0001_init.sql` through `0004_rag_grants.sql`).
3. Create a `.env` in `code/` with your project's URL and anon key
   (Project Settings → API):
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=xxxx
   ```
4. Restart `npm run dev` — onboarding, sessions, and chat will now persist
   to your project.

### Enabling Dr. Chatbot (RAG)

Dr. Chatbot retrieves from a corpus of patient journals and medical
guidelines under `code/rag/`, so it needs two more steps:

1. **Deploy the edge functions** with the Supabase CLI:
   ```
   supabase functions deploy ai --project-ref <your-project-ref>
   supabase functions deploy classify --project-ref <your-project-ref>
   supabase secrets set OPENAI_API_KEY=sk-... --project-ref <your-project-ref>
   ```
   (`functions/classify` tags player strategies against a jailbreak
   taxonomy for the admin dashboard/eval harness; it isn't required for
   gameplay itself.)
2. **Populate the RAG corpus.** From `code/`, with `OPENAI_API_KEY`,
   `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` set (a `.env` in `rag/`
   works, since the script loads `dotenv`):
   ```
   node rag/embeddingJavascript.js
   ```
   This clears and re-embeds every file under `rag/patient_journals`,
   `rag/general_guidelines`, `rag/medical_guidelines`,
   `rag/nursing_guidelines`, and `rag/nursing_tasks`. Re-run any time the
   corpus changes.

### Setting up an admin account

The admin dashboard (`/admin`) uses a real Supabase Auth user, allowlisted
in the `admins` table — not a separate password system.

1. Create a user in Supabase Auth (Dashboard → Authentication → Users →
   Add user), with a real email + password.
2. Insert their user id into the allowlist:
   ```sql
   insert into public.admins (user_id) values ('<the user''s auth id>');
   ```
3. Log in at `/admin` with that email/password.

## Publishing as an app later

The frontend is a plain React/Vite SPA, so wrapping it for app stores (e.g.
with Capacitor or Tauri) doesn't require changing anything here — the
Supabase backend is reachable over HTTPS from any client.
