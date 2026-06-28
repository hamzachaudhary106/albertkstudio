-- Albert K Studio — CMS schema (content tables, contact submissions, RLS, storage)
-- Public (anon) can READ active content; only authenticated admins can WRITE.

-- ---------------------------------------------------------------------------
-- Extend services with marketing/content fields (one row drives booking + site)
-- ---------------------------------------------------------------------------
alter table public.services
  add column if not exists tagline        text,
  add column if not exists description    text,
  add column if not exists image_url      text,
  add column if not exists image_position text default 'object-center',
  add column if not exists overview       jsonb not null default '[]'::jsonb, -- string[]
  add column if not exists includes       jsonb not null default '[]'::jsonb, -- string[]
  add column if not exists process        jsonb not null default '[]'::jsonb, -- {title,text}[]
  add column if not exists ideal_for      text;

-- ---------------------------------------------------------------------------
-- Content collections
-- ---------------------------------------------------------------------------
create table if not exists public.gallery_items (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  category   text,
  image_url  text not null,
  featured   boolean not null default false,
  sort       int not null default 0,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.team_members (
  id         uuid primary key default gen_random_uuid(),
  slug       text,
  name       text not null,
  role       text,
  specialty  text,
  bio        text,
  image_url  text,
  sort       int not null default 0,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  date_label text,
  text       text not null,
  rating     int not null default 5,
  featured   boolean not null default false,
  sort       int not null default 0,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id         uuid primary key default gen_random_uuid(),
  question   text not null,
  answer     text not null,
  sort       int not null default 0,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

-- Key/value settings (business info, hero, about, nav, footer, seo, hours, menu)
create table if not exists public.site_settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

-- Contact form submissions
create table if not exists public.contact_submissions (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text,
  phone      text,
  topic      text,
  message    text,
  status     text not null default 'new' check (status in ('new','read','archived')),
  created_at timestamptz not null default now()
);

create index if not exists contact_submissions_created_idx on public.contact_submissions (created_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.gallery_items       enable row level security;
alter table public.team_members        enable row level security;
alter table public.reviews             enable row level security;
alter table public.faqs                enable row level security;
alter table public.site_settings       enable row level security;
alter table public.contact_submissions enable row level security;

-- Helper: an authenticated request (admin) — any logged-in user.
-- (Public signup is disabled, so only provisioned admins can authenticate.)

do $$
declare t text;
begin
  -- public read of active content + admin full manage
  for t in select unnest(array['gallery_items','team_members','reviews','faqs']) loop
    execute format('drop policy if exists "public read %1$s" on public.%1$s;', t);
    execute format('create policy "public read %1$s" on public.%1$s for select using (active);', t);
    execute format('drop policy if exists "admin manage %1$s" on public.%1$s;', t);
    execute format('create policy "admin manage %1$s" on public.%1$s for all to authenticated using (true) with check (true);', t);
  end loop;
end $$;

drop policy if exists "public read site_settings" on public.site_settings;
create policy "public read site_settings" on public.site_settings for select using (true);
drop policy if exists "admin manage site_settings" on public.site_settings;
create policy "admin manage site_settings" on public.site_settings for all to authenticated using (true) with check (true);

-- contact: anyone may submit; only admins may read/manage
drop policy if exists "anyone submit contact" on public.contact_submissions;
create policy "anyone submit contact" on public.contact_submissions for insert to anon, authenticated with check (true);
drop policy if exists "admin manage contact" on public.contact_submissions;
create policy "admin manage contact" on public.contact_submissions for all to authenticated using (true) with check (true);

-- Existing booking tables: keep public read, add admin manage; appointments admin read/update
drop policy if exists "admin manage services" on public.services;
create policy "admin manage services" on public.services for all to authenticated using (true) with check (true);
drop policy if exists "admin manage staff" on public.staff;
create policy "admin manage staff" on public.staff for all to authenticated using (true) with check (true);
drop policy if exists "admin manage business_hours" on public.business_hours;
create policy "admin manage business_hours" on public.business_hours for all to authenticated using (true) with check (true);
drop policy if exists "admin manage blocked_times" on public.blocked_times;
create policy "admin manage blocked_times" on public.blocked_times for all to authenticated using (true) with check (true);

alter table public.appointments enable row level security;
drop policy if exists "admin read appointments" on public.appointments;
create policy "admin read appointments" on public.appointments for select to authenticated using (true);
drop policy if exists "admin update appointments" on public.appointments;
create policy "admin update appointments" on public.appointments for update to authenticated using (true) with check (true);

-- ---------------------------------------------------------------------------
-- Storage bucket for admin-uploaded media (public read)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "public read media" on storage.objects;
create policy "public read media" on storage.objects
  for select using (bucket_id = 'media');
drop policy if exists "admin upload media" on storage.objects;
create policy "admin upload media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media');
drop policy if exists "admin update media" on storage.objects;
create policy "admin update media" on storage.objects
  for update to authenticated using (bucket_id = 'media') with check (bucket_id = 'media');
drop policy if exists "admin delete media" on storage.objects;
create policy "admin delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'media');
