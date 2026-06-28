# Haccman 2.0

An arcade game for jailbreaking LLMs. Chat with a roster of bots and try to
get each one to break its own rules.

This is a from-scratch rewrite of the original Haccman, with a cleaner
architecture: game content (bots/tasks/win-rules) lives in JSON, win
detection is a pure function, the Supabase calls live in a thin service
layer, and a single Zustand store replaces prop drilling.

## Project layout

```
src/
  content/      bots.json, tasks.json, winRules.json -- edit game data here
  engine/       pure logic (winDetector.js) -- no UI, no network
  services/     Supabase calls (chat, sessions, players, admin)
  store/        gameStore.js (zustand)
  components/   ChatWindow etc.
  pages/        IntroPage, ChooseBotPage, PlayPage, AdminPage
  theme/        tokens.css + components.css -- the neon-terminal look
supabase/
  migrations/   run these against a fresh Supabase project
  functions/ai/ edge function used by Dr. Chatbot (RAG)
rag/            guideline/journal corpus + embedding generation scripts
```

## Run it locally right now (no Supabase yet)

```
npm install
npm run dev
```

The app boots fine without any Supabase config -- you'll see a console
warning, and onboarding falls through straight to the username form, so you
can preview the UI and the terminal/neon style immediately. Anything that
needs the backend (saving a profile, starting a session, chatting with a
bot, the admin dashboard) won't work until you connect a real Supabase
project below.

## Connecting Supabase

1. Create a new project at [supabase.com](https://supabase.com) (keep it
   separate from any older Haccman project -- this one needs its own data).
2. In the SQL editor, run the migrations in order:
   - `supabase/migrations/0001_init.sql` -- players/sessions/prompts/responses
   - `supabase/migrations/0002_rag.sql` -- RAG schema + search functions for
     Dr. Chatbot (requires the `vector` and `pg_trgm` extensions, enabled by
     the migration itself)
   - `supabase/migrations/0003_admin.sql` -- admin allowlist + read policies
3. Copy `.env.example` to `.env` and fill in your project's URL and anon key
   (Project Settings -> API):
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=xxxx
   ```
4. Restart `npm run dev` -- onboarding, sessions, and chat will now persist
   to your project.

### Enabling Dr. Chatbot (RAG)

Dr. Chatbot retrieves from a corpus of patient journals and medical
guidelines, so it needs two more steps:

1. **Deploy the edge function.** Using the Supabase CLI:
   ```
   supabase functions deploy ai --project-ref <your-project-ref>
   supabase secrets set OPENAI_API_KEY=sk-... --project-ref <your-project-ref>
   ```
2. **Populate the RAG corpus.** From the `rag/` folder, with `OPENAI_API_KEY`,
   `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` set in your environment
   (a `.env` file in `rag/` works since the script loads `dotenv`):
   ```
   node rag/embeddingJavascript.js
   ```
   This embeds and uploads every file under `rag/patient_journals`,
   `rag/general_guidelines`, `rag/medical_guidelines`, `rag/nursing_guidelines`,
   and `rag/nursing_tasks`. It clears existing RAG rows first, so re-run it
   any time the corpus changes.

### Setting up an admin account

The admin dashboard (`/admin`) uses a real Supabase Auth user, allowlisted
in the `admins` table -- not a separate password system.

1. Create a user in Supabase Auth (Dashboard -> Authentication -> Users ->
   Add user), with a real email + password.
2. Insert their user id into the allowlist:
   ```sql
   insert into public.admins (user_id) values ('<the user''s auth id>');
   ```
3. Log in at `/admin` with that email/password.

## Publishing as an app later

The frontend is a plain React/Vite SPA, so wrapping it for app stores (e.g.
with Capacitor or Tauri) doesn't require changing anything here -- the
Supabase backend is reachable over HTTPS from any client.
