create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password text not null,
  full_name text not null,
  role text not null check (role in ('learning_manager', 'employee')),
  department text not null,
  job_title text not null,
  market text not null,
  proficiency_level text,
  created_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  skill_name text not null unique,
  description text not null
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  target_role text not null,
  target_market text not null,
  status text not null check (status in ('Draft', 'Published', 'Archived')),
  start_date date not null,
  end_date date not null,
  created_by uuid not null references public.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  level text not null,
  short_description text not null,
  linkedin_url text not null,
  skill_id uuid not null references public.skills(id) on delete restrict
);

create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  status text not null check (status in ('Assigned', 'In Progress', 'Completed')),
  created_at timestamptz not null default now()
);

create index if not exists campaigns_created_by_idx on public.campaigns (created_by);
create index if not exists courses_skill_id_idx on public.courses (skill_id);
create index if not exists recommendations_user_id_idx on public.recommendations (user_id);
create index if not exists recommendations_course_id_idx on public.recommendations (course_id);
