-- Albert K Studio — Admin layer: roles/profiles + activity log
-- These power the Users (role-based permissions) and Activity pages in the
-- custom CMS. The admin UI degrades gracefully if this migration hasn't run
-- yet (it simply treats the signed-in user as an owner and hides Activity).
--
-- Security model mirrors the rest of the CMS: public signup is disabled, so
-- every authenticated user is a trusted staff member. Fine-grained capability
-- gating (owner / admin / editor) is enforced in the UI based on `role`.

-- ---------------------------------------------------------------------------
-- Admin profiles (one row per auth user)
-- ---------------------------------------------------------------------------
create table if not exists public.admin_users (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text,
  full_name  text,
  role       text not null default 'admin' check (role in ('owner','admin','editor')),
  avatar_url text,
  active     boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Activity log (audit trail of admin actions)
-- ---------------------------------------------------------------------------
create table if not exists public.activity_logs (
  id          bigint generated always as identity primary key,
  actor_id    uuid,
  actor_email text,
  action      text not null,            -- created | updated | deleted | published | login | ...
  entity      text not null,            -- service | gallery | review | setting | booking | ...
  label       text,                     -- human-friendly target (e.g. "Keratin Treatment")
  meta        jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists activity_logs_created_idx on public.activity_logs (created_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.admin_users   enable row level security;
alter table public.activity_logs enable row level security;

-- Authenticated admins can read and manage profiles. (Trusted-staff model.)
drop policy if exists "admin read profiles" on public.admin_users;
create policy "admin read profiles" on public.admin_users
  for select to authenticated using (true);
drop policy if exists "admin manage profiles" on public.admin_users;
create policy "admin manage profiles" on public.admin_users
  for all to authenticated using (true) with check (true);

-- Authenticated admins can read the audit trail and append to it.
drop policy if exists "admin read activity" on public.activity_logs;
create policy "admin read activity" on public.activity_logs
  for select to authenticated using (true);
drop policy if exists "admin insert activity" on public.activity_logs;
create policy "admin insert activity" on public.activity_logs
  for insert to authenticated with check (true);

-- Keep updated_at fresh on profile edits.
drop trigger if exists admin_users_touch on public.admin_users;
create trigger admin_users_touch
  before update on public.admin_users
  for each row execute function public.touch_updated_at();

-- Auto-provision a profile row the first time a new auth user appears so the
-- Users page is populated without manual SQL.
create or replace function public.handle_new_admin_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.admin_users (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_admin_user();
