-- Admin access for the data dashboard.
-- Admins are real Supabase Auth users (created via dashboard or supabase auth
-- admin API), allowlisted here -- no custom password/JWT scheme.

create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

alter table public.admins enable row level security;

create policy "admins read own row" on public.admins for select
  using (auth.uid() = user_id);

create policy "admins read all players" on public.players for select
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

create policy "admins read all sessions" on public.sessions for select
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

create policy "admins read all prompts" on public.prompts for select
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

create policy "admins read all responses" on public.responses for select
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));
