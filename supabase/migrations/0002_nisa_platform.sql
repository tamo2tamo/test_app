create extension if not exists pgcrypto;

create type public.post_status as enum ('draft', 'pending', 'published', 'hidden', 'rejected');
create type public.reaction_type as enum ('helpful', 'clear', 'support');
create type public.report_reason as enum ('abuse', 'ad', 'scam', 'other');
create type public.report_status as enum ('open', 'resolved');
create type public.review_action as enum ('approve', 'reject', 'request_fix', 'hide', 'restore');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  age_group text,
  occupation text,
  annual_income_band text,
  investment_history text,
  nisa_type text,
  risk_tolerance text,
  investment_policy text,
  family_type text,
  housing_type text,
  invest_cash_ratio text,
  is_admin boolean not null default false,
  mfa_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  profile jsonb not null,
  allocations jsonb not null,
  performance jsonb not null,
  memo text not null check (char_length(memo) <= 200),
  status public.post_status not null default 'draft',
  moderation_note text,
  view_count integer not null default 0,
  report_penalty integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create table if not exists public.reactions (
  id bigint generated always as identity primary key,
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  type public.reaction_type not null,
  created_at timestamptz not null default now(),
  unique (post_id, user_id, type)
);

create table if not exists public.reports (
  id bigint generated always as identity primary key,
  post_id uuid not null references public.posts(id) on delete cascade,
  reporter_id uuid references auth.users(id) on delete set null,
  reason public.report_reason not null,
  memo text not null default '' check (char_length(memo) <= 100),
  status public.report_status not null default 'open',
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists public.admin_actions (
  id bigint generated always as identity primary key,
  admin_id uuid not null references auth.users(id) on delete cascade,
  target_post_id uuid references public.posts(id) on delete set null,
  target_report_id bigint references public.reports(id) on delete set null,
  action public.review_action not null,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  actor_role text not null,
  event_type text not null,
  entity text not null,
  entity_id text not null,
  diff jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.rate_limits (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  ip_hash text,
  action text not null,
  window_start timestamptz not null,
  counter integer not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, action, window_start),
  unique (ip_hash, action, window_start)
);

create table if not exists public.traffic_attributions (
  id bigint generated always as identity primary key,
  post_id uuid references public.posts(id) on delete set null,
  tracked_date date not null default current_date,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  referrer text,
  landing text,
  session_id text,
  created_at timestamptz not null default now()
);

create index if not exists idx_posts_status_created on public.posts(status, created_at desc);
create index if not exists idx_reports_status_created on public.reports(status, created_at desc);
create index if not exists idx_traffic_date on public.traffic_attributions(tracked_date);

create or replace function public.jwt_aal() returns text
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'aal', 'aal1');
$$;

create or replace function public.is_admin() returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(
    select 1 from public.profiles p
    where p.id = auth.uid() and p.is_admin = true
  );
$$;

grant execute on function public.jwt_aal() to anon, authenticated;
grant execute on function public.is_admin() to authenticated;

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.reactions enable row level security;
alter table public.reports enable row level security;
alter table public.admin_actions enable row level security;
alter table public.audit_logs enable row level security;
alter table public.rate_limits enable row level security;
alter table public.traffic_attributions enable row level security;

create policy profiles_read_self on public.profiles
for select to authenticated
using (id = auth.uid() or public.is_admin());

create policy profiles_update_self on public.profiles
for update to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy posts_select_published_or_owner on public.posts
for select to anon, authenticated
using (status = 'published' or author_id = auth.uid() or public.is_admin());

create policy posts_insert_aal2 on public.posts
for insert to authenticated
with check (
  author_id = auth.uid()
  and public.jwt_aal() = 'aal2'
  and status in ('draft', 'pending')
);

create policy posts_update_owner_aal2 on public.posts
for update to authenticated
using (author_id = auth.uid() or public.is_admin())
with check (
  (author_id = auth.uid() and public.jwt_aal() = 'aal2')
  or public.is_admin()
);

create policy reactions_read_published on public.reactions
for select to anon, authenticated
using (exists(select 1 from public.posts p where p.id = reactions.post_id and p.status = 'published'));

create policy reactions_write_aal2 on public.reactions
for insert to authenticated
with check (user_id = auth.uid() and public.jwt_aal() = 'aal2');

create policy reports_insert_aal2 on public.reports
for insert to authenticated
with check (public.jwt_aal() = 'aal2');

create policy reports_read_admin on public.reports
for select to authenticated
using (public.is_admin());

create policy reports_update_admin on public.reports
for update to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy admin_actions_admin_only on public.admin_actions
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy audit_logs_admin_only on public.audit_logs
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy rate_limits_admin_only on public.rate_limits
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy traffic_read_admin on public.traffic_attributions
for select to authenticated
using (public.is_admin());

create policy traffic_insert_public on public.traffic_attributions
for insert to anon, authenticated
with check (true);
