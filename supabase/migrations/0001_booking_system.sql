-- Albert K Studio — appointment booking schema
-- Run with the Supabase CLI: `supabase db push` (or paste into the SQL editor).

create extension if not exists "btree_gist";

-- ---------------------------------------------------------------------------
-- Reference data
-- ---------------------------------------------------------------------------

create table if not exists public.staff (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  active      boolean not null default true,
  sort        int not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.services (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  duration_min  int not null,                 -- chair time used for availability
  buffer_min    int not null default 0,       -- clean-up time blocked after a booking
  deposit_cents int not null default 5000,    -- deposit charged at booking
  price_label   text,                          -- e.g. "From $350"
  active        boolean not null default true,
  sort          int not null default 0,
  created_at    timestamptz not null default now()
);

-- Weekly opening hours, in minutes from midnight (local salon time).
create table if not exists public.business_hours (
  day_of_week  int primary key check (day_of_week between 0 and 6), -- 0 = Sunday
  open_minute  int not null,   -- e.g. 600 = 10:00
  close_minute int not null    -- e.g. 1080 = 18:00
);

-- One-off blocks (holidays, vacations, breaks). Null staff_id = whole salon.
create table if not exists public.blocked_times (
  id         uuid primary key default gen_random_uuid(),
  staff_id   uuid references public.staff(id) on delete cascade,
  starts_at  timestamptz not null,
  ends_at    timestamptz not null,
  reason     text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Appointments
-- ---------------------------------------------------------------------------

create table if not exists public.appointments (
  id                       uuid primary key default gen_random_uuid(),
  service_id               uuid not null references public.services(id),
  staff_id                 uuid not null references public.staff(id),
  starts_at                timestamptz not null,
  ends_at                  timestamptz not null,
  customer_name            text not null,
  customer_phone           text not null,
  customer_email           text,
  status                   text not null default 'pending'
                             check (status in ('pending','confirmed','cancelled','completed','expired')),
  deposit_cents            int not null default 0,
  stripe_payment_intent_id text,
  notes                    text,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

create index if not exists appointments_starts_at_idx on public.appointments (starts_at);
create index if not exists appointments_status_idx on public.appointments (status);

-- Prevent overlapping bookings for the same stylist while a slot is held or booked.
alter table public.appointments
  drop constraint if exists appointments_no_overlap;
alter table public.appointments
  add constraint appointments_no_overlap
  exclude using gist (
    staff_id with =,
    tstzrange(starts_at, ends_at) with &&
  ) where (status in ('pending','confirmed'));

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists appointments_touch on public.appointments;
create trigger appointments_touch
  before update on public.appointments
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Availability (callable by the public anon role; never exposes customer data)
-- ---------------------------------------------------------------------------

create or replace function public.available_slots(
  p_date         date,
  p_service_slug text,
  p_staff_slug   text default 'albert'
)
returns table (slot timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_service   services%rowtype;
  v_staff     staff%rowtype;
  v_open      int;
  v_close     int;
  v_block     int; -- duration + buffer, the space a booking consumes
  v_step      int := 30;          -- slot granularity, minutes
  v_tz        text := 'America/New_York';
  v_now       timestamptz := now();
  v_lead      interval := interval '2 hours';
  m           int;
  v_start     timestamptz;
  v_end       timestamptz;
begin
  select * into v_service from services where slug = p_service_slug and active;
  if not found then return; end if;

  select * into v_staff from staff where slug = p_staff_slug and active;
  if not found then return; end if;

  select open_minute, close_minute into v_open, v_close
    from business_hours where day_of_week = extract(dow from p_date)::int;
  if v_open is null then return; end if;

  v_block := v_service.duration_min + v_service.buffer_min;

  m := v_open;
  while m + v_service.duration_min <= v_close loop
    v_start := timezone(v_tz, (p_date::timestamp + make_interval(mins => m)));
    v_end   := v_start + make_interval(mins => v_block);

    if v_start >= v_now + v_lead
       and not exists (
         select 1 from appointments a
         where a.staff_id = v_staff.id
           and (
             a.status = 'confirmed'
             or (a.status = 'pending' and a.created_at > v_now - interval '15 minutes')
           )
           and tstzrange(a.starts_at, a.ends_at) && tstzrange(v_start, v_end)
       )
       and not exists (
         select 1 from blocked_times b
         where (b.staff_id = v_staff.id or b.staff_id is null)
           and tstzrange(b.starts_at, b.ends_at) && tstzrange(v_start, v_end)
       )
    then
      slot := v_start;
      return next;
    end if;

    m := m + v_step;
  end loop;

  return;
end;
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.staff          enable row level security;
alter table public.services       enable row level security;
alter table public.business_hours enable row level security;
alter table public.blocked_times  enable row level security;
alter table public.appointments   enable row level security;

-- Public can read active reference data (needed to render the booking UI).
drop policy if exists "public read staff" on public.staff;
create policy "public read staff" on public.staff
  for select using (active);

drop policy if exists "public read services" on public.services;
create policy "public read services" on public.services
  for select using (active);

drop policy if exists "public read business hours" on public.business_hours;
create policy "public read business hours" on public.business_hours
  for select using (true);

-- appointments + blocked_times: no anon access at all. Edge Functions use the
-- service-role key (which bypasses RLS) for all writes/reads.

grant execute on function public.available_slots(date, text, text) to anon, authenticated;
