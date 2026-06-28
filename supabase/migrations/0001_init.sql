-- Haccman 2.0 core game schema.
-- Run this against a fresh Supabase project (separate from the original Haccman-EA project).

create table public.players (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  age int,
  gender text,
  familiarity text,
  created_at timestamptz not null default now()
);

create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  bot_id int not null,
  task_id int not null,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  completed boolean not null default false
);

create table public.prompts (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create table public.responses (
  id uuid primary key default gen_random_uuid(),
  prompt_id uuid not null references public.prompts(id) on delete cascade,
  content text not null,
  sources jsonb,
  created_at timestamptz not null default now()
);

alter table public.players enable row level security;
alter table public.sessions enable row level security;
alter table public.prompts enable row level security;
alter table public.responses enable row level security;

create policy "players read own" on public.players for select using (auth.uid() = id);
create policy "players insert own" on public.players for insert with check (auth.uid() = id);
create policy "players update own" on public.players for update using (auth.uid() = id);

create policy "sessions owned by user" on public.sessions for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "prompts owned by user" on public.prompts for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "responses readable via own prompt" on public.responses for select
  using (exists (
    select 1 from public.prompts p
    where p.id = responses.prompt_id and p.user_id = auth.uid()
  ));

create policy "responses insertable via own prompt" on public.responses for insert
  with check (exists (
    select 1 from public.prompts p
    where p.id = responses.prompt_id and p.user_id = auth.uid()
  ));
