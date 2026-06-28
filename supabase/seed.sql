-- Seed reference data for Albert K Studio booking.
-- Safe to re-run: upserts on the natural keys.

insert into public.staff (slug, name, sort) values
  ('albert', 'Albert K', 0)
on conflict (slug) do update set name = excluded.name, active = true;

insert into public.services (slug, title, duration_min, buffer_min, deposit_cents, price_label, sort) values
  ('keratin',           'Keratin Treatment',  180, 15, 5000, 'From $350', 0),
  ('hair-botox',        'Hair Botox',          150, 15, 5000, 'From $280', 1),
  ('haircuts-coloring', 'Haircuts & Color',    120, 15, 5000, 'From $150', 2),
  ('extensions',        'Premium Extensions',  180, 15, 5000, 'From $450', 3)
on conflict (slug) do update set
  title = excluded.title,
  duration_min = excluded.duration_min,
  buffer_min = excluded.buffer_min,
  deposit_cents = excluded.deposit_cents,
  price_label = excluded.price_label,
  sort = excluded.sort,
  active = true;

-- Open daily 10:00 (600) to 18:00 (1080).
insert into public.business_hours (day_of_week, open_minute, close_minute) values
  (0, 600, 1080),
  (1, 600, 1080),
  (2, 600, 1080),
  (3, 600, 1080),
  (4, 600, 1080),
  (5, 600, 1080),
  (6, 600, 1080)
on conflict (day_of_week) do update set
  open_minute = excluded.open_minute,
  close_minute = excluded.close_minute;
