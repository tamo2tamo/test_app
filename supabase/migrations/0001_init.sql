create extension if not exists "pgcrypto";

create type post_status as enum ('queued', 'published', 'rejected');
create type age_group as enum ('20', '30', '40', '50', '60_plus');
create type family_status as enum ('single', 'married_no_child', 'married_with_child', 'other');
create type occupation as enum ('employee', 'public_servant', 'self_employed', 'student', 'unemployed', 'other');
create type income_band as enum ('u300', 'b300_500', 'b500_800', 'b800_1200', 'o1200', 'no_answer');
create type invest_years as enum ('u1', 'b1_3', 'b3_5', 'o5');
create type nisa_type as enum ('tsumitate_only', 'growth_only', 'both');
create type risk_tolerance as enum ('low', 'mid', 'high');
create type investment_policy as enum ('long_term', 'balanced', 'aggressive');
create type monthly_amount as enum ('u10k', 'b10_30k', 'b30_50k', 'b50_100k', 'o100k', 'no_answer');
create type principal_amount as enum ('u500k', 'u2m', 'u5m', 'u10m', 'o10m', 'no_answer');
create type allocation_category as enum ('equity', 'bond', 'reit', 'cash', 'crypto', 'other');
create type reaction_type as enum ('like', 'insightful', 'thanks');
create type report_reason as enum ('spam', 'abuse', 'misinformation', 'other');

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  status post_status not null default 'queued',
  age_group age_group not null,
  family_status family_status not null,
  occupation occupation not null,
  income_band income_band not null,
  invest_years invest_years not null,
  nisa_type nisa_type not null,
  risk_tolerance risk_tolerance not null,
  investment_policy investment_policy not null,
  monthly_amount monthly_amount not null,
  principal_amount principal_amount,
  perf_1y numeric(6,2) not null check (perf_1y >= -100 and perf_1y <= 999),
  perf_total numeric(6,2) not null check (perf_total >= -100 and perf_total <= 999),
  memo varchar(200),
  anon_key_hash varchar(64) not null,
  created_at timestamptz not null default now(),
  published_at timestamptz
);

create table if not exists allocations (
  id bigint generated always as identity primary key,
  post_id uuid not null references posts(id) on delete cascade,
  category allocation_category not null,
  percent int not null check (percent >= 0 and percent <= 100),
  unique (post_id, category)
);

create table if not exists reactions (
  id bigint generated always as identity primary key,
  post_id uuid not null references posts(id) on delete cascade,
  anon_key_hash varchar(64) not null,
  reaction_type reaction_type not null,
  created_at timestamptz not null default now(),
  unique (post_id, anon_key_hash, reaction_type)
);

create table if not exists reports (
  id bigint generated always as identity primary key,
  post_id uuid not null references posts(id) on delete cascade,
  anon_key_hash varchar(64) not null,
  reason report_reason not null,
  detail varchar(200),
  created_at timestamptz not null default now()
);

create table if not exists ng_words (
  id bigint generated always as identity primary key,
  word varchar(64) not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists rate_limits (
  id bigint generated always as identity primary key,
  anon_key_hash varchar(64) not null,
  endpoint varchar(64) not null,
  window_start date not null,
  count int not null default 0,
  unique (anon_key_hash, endpoint, window_start)
);

create or replace function check_allocation_total(p_post_id uuid)
returns boolean
language sql
as $$
  select coalesce(sum(percent), 0) = 100
  from allocations
  where post_id = p_post_id;
$$;

insert into ng_words (word)
values ('死ね'), ('殺す'), ('詐欺'), ('副業紹介')
on conflict (word) do nothing;

alter table posts enable row level security;
alter table allocations enable row level security;
alter table reactions enable row level security;
alter table reports enable row level security;
alter table ng_words enable row level security;
alter table rate_limits enable row level security;

create policy "public_can_read_published_posts"
on posts
for select
using (status = 'published');

create policy "public_can_insert_queued_posts"
on posts
for insert
with check (status = 'queued');

create policy "public_can_read_published_allocations"
on allocations
for select
using (
  exists (
    select 1 from posts
    where posts.id = allocations.post_id
      and posts.status = 'published'
  )
);

create policy "public_can_read_reactions_of_published"
on reactions
for select
using (
  exists (
    select 1 from posts
    where posts.id = reactions.post_id
      and posts.status = 'published'
  )
);

create policy "public_can_insert_reactions"
on reactions
for insert
with check (true);

create policy "public_can_insert_reports"
on reports
for insert
with check (true);

create policy "public_can_read_ng_words"
on ng_words
for select
using (true);
