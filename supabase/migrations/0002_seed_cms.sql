-- Seed CMS content from the current site. Re-runnable where practical.

-- ---- Services: add marketing fields to the booking rows --------------------
update public.services set
  tagline = $t$Silky, frizz free hair for weeks.$t$,
  description = $t$Professional keratin smoothing that restores shine and manageability without weighing hair down.$t$,
  image_url = '/gallery/dimensional-blonde.png',
  image_position = 'object-top',
  ideal_for = $t$Frizzy, coarse, or unruly hair — and anyone who wants faster, easier styling.$t$,
  overview = $j$["Our keratin smoothing treatment infuses the hair with a protein that fills in damaged, porous areas and relaxes frizz from the inside out. The result is hair that's noticeably smoother, shinier, and far easier to style — without looking flat or losing its natural movement.","Depending on your hair type and home care, results typically last two to four months. We tailor the strength of the treatment to your goals, whether you want a subtle softening or a fully sleek finish."]$j$::jsonb,
  includes = $j$["Personalized consultation and strand assessment","Clarifying treatment shampoo to prep the hair","Keratin applied section by section and sealed with heat","Smooth blow-dry and flat-iron finish","Take-home aftercare guidance to extend your results"]$j$::jsonb,
  process = $j$[{"title":"Consultation","text":"We assess your texture, history, and goals to choose the right formula and strength."},{"title":"Prep & Cleanse","text":"Hair is washed with a clarifying shampoo to open the cuticle and remove buildup."},{"title":"Application","text":"The keratin is worked through in fine sections and sealed in with controlled heat."},{"title":"Finish & Aftercare","text":"We blow-dry and flat-iron to lock in the smoothing, then walk you through home care."}]$j$::jsonb
where slug = 'keratin';

update public.services set
  tagline = $t$Deep repair with a smooth, healthy finish.$t$,
  description = $t$A restorative treatment that conditions, repairs damage, and rejuvenates tired strands with no harsh chemicals.$t$,
  image_url = '/gallery/textured-lob.png',
  image_position = 'object-[center_15%]',
  ideal_for = $t$Dry, damaged, or over-processed hair that needs repair and shine — chemical-free.$t$,
  overview = $j$["Hair botox is a deep-conditioning, restorative treatment — not an actual injectable. It coats each strand with a rich blend of proteins, vitamins, and bond-building ingredients that fill in breakage, smooth the surface, and bring back softness and shine.","Unlike keratin, hair botox is formaldehyde-free and focused on repair, making it a gentle choice for hair that feels dry, brittle, or over-processed. You'll leave with healthier-looking, more manageable hair and a beautiful, glassy finish."]$j$::jsonb,
  includes = $j$["Consultation and condition assessment","Gentle cleanse to prepare the hair","Bond-building botox treatment applied throughout","Processing time for deep penetration and repair","Smooth blow-dry finish and home care tips"]$j$::jsonb,
  process = $j$[{"title":"Consultation","text":"We evaluate damage and porosity to confirm botox is the right repair for your hair."},{"title":"Cleanse","text":"Hair is gently washed to remove residue so the treatment can absorb fully."},{"title":"Treatment","text":"The repairing formula is applied and left to penetrate and rebuild the strand."},{"title":"Finish","text":"We rinse, blow-dry, and reveal a smoother, healthier, high-shine result."}]$j$::jsonb
where slug = 'hair-botox';

update public.services set
  tagline = $t$Blonde, balayage, and cuts tailored to you.$t$,
  description = $t$From precision cuts to dimensional blondes and lived in balayage, crafted for your face, lifestyle, and style.$t$,
  image_url = '/gallery/balayage-curls.png',
  image_position = 'object-[center_35%]',
  ideal_for = $t$Anyone refreshing their look — from a clean cut to a full dimensional blonde.$t$,
  overview = $j$["Whether you're after a precision cut, a refreshed root, or a complete color transformation, every service is built around your face shape, hair texture, and lifestyle. Albert specializes in dimensional blondes, lived-in balayage, and seamless color corrections that grow out beautifully.","We never rush the chair. From consultation to the final blow-dry, we focus on getting the tone, placement, and shape exactly right — and on keeping your hair healthy through every step."]$j$::jsonb,
  includes = $j$["In-depth consultation and color mapping","Precision cut shaped to your features","Custom color, highlights, or hand-painted balayage","Gloss or toner to perfect your tone","Blow-dry finish and at-home styling guidance"]$j$::jsonb,
  process = $j$[{"title":"Consultation","text":"We talk through inspiration, tone, and maintenance to design your look together."},{"title":"Color","text":"Color, highlights, or balayage are applied and processed for the perfect dimension."},{"title":"Cut & Shape","text":"Your cut is tailored to your features, texture, and the way you wear your hair."},{"title":"Gloss & Finish","text":"We tone, gloss, and style — then show you how to recreate it at home."}]$j$::jsonb
where slug = 'haircuts-coloring';

update public.services set
  tagline = $t$Length and volume, blended to perfection.$t$,
  description = $t$100% human hair extensions applied and blended by specialists for natural movement and seamless color match.$t$,
  image_url = '/gallery/platinum-blonde.png',
  image_position = 'object-top',
  ideal_for = $t$Adding length, fullness, or volume with a seamless, natural finish.$t$,
  overview = $j$["Add length, fullness, or volume with premium 100% human hair extensions, custom color-matched and applied by specialists. We offer tape-in and hand-tied methods, choosing the right approach for your hair type, lifestyle, and goals.","The secret is in the blend: extensions are cut and styled into your own hair so they move naturally and disappear seamlessly. We'll also set you up with a simple maintenance plan to keep them looking flawless."]$j$::jsonb,
  includes = $j$["Complimentary consultation and custom color match","Method selection — tape-in or hand-tied wefts","Professional application and secure placement","Cut and blend into your natural hair","Maintenance and home-care plan"]$j$::jsonb,
  process = $j$[{"title":"Consultation","text":"We match color, assess your hair, and recommend the best method and amount of hair."},{"title":"Color Match","text":"Extensions are selected and, if needed, customized for a flawless blend."},{"title":"Application","text":"Wefts are applied securely and comfortably for natural movement."},{"title":"Cut & Blend","text":"We cut and style everything together so the extensions disappear into your hair."}]$j$::jsonb
where slug = 'extensions';

-- ---- Gallery --------------------------------------------------------------
insert into public.gallery_items (title, category, image_url, featured, sort) values
  ('Platinum Blonde',          'Color',         '/gallery/platinum-blonde.png',    true,  0),
  ('Caramel Balayage & Curls', 'Balayage',      '/gallery/balayage-curls.png',     false, 1),
  ('Dimensional Blonde',       'Highlights',    '/gallery/dimensional-blonde.png', false, 2),
  ('Copper Red Color',         'Color',         '/gallery/copper-red.png',         false, 3),
  ('Ash Blonde Waves',         'Color & Style', '/gallery/ash-blonde-waves.png',   false, 4),
  ('Glamour Waves',            'Styling',       '/gallery/glamour-waves.png',      false, 5),
  ('Volume Blowout',           'Blowout',       '/gallery/volume-blowout.png',     false, 6),
  ('Sleek Brunette',           'Cut & Style',   '/gallery/sleek-brunette.png',     false, 7),
  ('Textured Lob',             'Cut & Color',   '/gallery/textured-lob.png',       false, 8)
on conflict do nothing;

-- ---- Team -----------------------------------------------------------------
insert into public.team_members (slug, name, role, specialty, bio, image_url, sort) values
  ('albert', 'Albert K', 'Founder & Master Stylist', 'Platinum Blonde · Cuts · Transformations',
   $t$15+ years mastering color correction, platinum blondes, and full transformations. Albert's clients return because the results last and the experience feels personal.$t$,
   '/team/albert-k-headshot.png', 0)
on conflict do nothing;

-- ---- Reviews --------------------------------------------------------------
insert into public.reviews (name, date_label, text, featured, sort) values
  ('Roxanna Music', '3 months ago', $t$Albert K Studio in Aventura was hands down one of the most amazing salon experiences I've ever had. Albert is truly exceptional. He colored my hair perfectly.$t$, true, 0),
  ('Angie Tang', '1 month ago', $t$I have been coming to Albert K Studio for soooo many years honestly, I don't even remember. I love it every time, everyone is super nice and extremely talented.$t$, false, 1),
  ('Rachel Honig', '2 weeks ago', $t$I've been getting my hair done with the team for years. There is truly no one better! Love this salon and the atmosphere is always so welcoming.$t$, false, 2),
  ('Jennifer Elizabeth', '4 months ago', $t$Albert is the best hair dresser & all the staff is incredible! You can't go wrong! My hair has never looked healthier or more vibrant.$t$, false, 3)
on conflict do nothing;

-- ---- FAQs -----------------------------------------------------------------
insert into public.faqs (question, answer, sort) values
  ('How does online booking work?', $t$Choose your service, preferred date, and time, then secure your spot with a deposit. You'll get an instant confirmation by email. To book by phone, call (917) 657-8170.$t$, 0),
  ('Do I need an appointment?', $t$We recommend booking ahead. Walk ins are welcome when availability permits.$t$, 1),
  ('Where is Albert K Studio located?', $t$19020 NE 29th Ave, Town Center Aventura, FL 33180, with convenient parking near Biscayne Blvd and the Aventura Mall area.$t$, 2),
  ('What services do you offer?', $t$Keratin treatments, hair botox, precision cuts, color, balayage, highlights, premium extensions, blowouts, and personalized consultations.$t$, 3),
  ('What areas do you serve?', $t$We welcome clients from Aventura, Sunny Isles Beach, North Miami Beach, Golden Beach, Hallandale, Bal Harbour, Surfside, and greater Miami Dade.$t$, 4)
on conflict do nothing;

-- ---- Site settings (JSON groups; site overlays these over code defaults) ---
insert into public.site_settings (key, value) values
('business', $j${"name":"Albert K Studio","tagline":"5 Star Rated Luxury Hair Salon","subTagline":"Master color and styling in the heart of Town Center Aventura","phone":"(917) 657-8170","phoneHref":"tel:+19176578170","email":"info@albertkstudio.com","address":"19020 NE 29th Ave, Aventura, FL 33180","addressShort":"Town Center Aventura","googleRating":5.0,"reviewCount":142,"instagramUrl":"https://www.instagram.com/albertkstudio/","instagramHandle":"@albertkstudio","mapsUrl":"https://www.google.com/maps/search/?api=1&query=Albert+K+Studio+19020+NE+29th+Ave+Aventura+FL+33180"}$j$::jsonb),
('hero', $j${"eyebrow":"Town Center Aventura · Since 2009","titleLine1":"Where Color Becomes","titleAccent":"Art","titleLine2":"in Aventura","subtitle":"I opened Albert K Studio to do one thing exceptionally well: create hair that looks expensive, feels effortless, and lasts. From platinum blondes to seamless keratin, every visit is personal."}$j$::jsonb),
('about', $j${"heading":"A Salon Built on Craft, Not Trends","pullQuote":"We don't rush appointments. We listen, consult, and create hair you're proud to wear every day.","paragraphs":["Albert K Studio sits in Town Center Aventura, a calm, luxury space where clients from Aventura, Sunny Isles, and across Miami Dade come for color work they can't get anywhere else.","Whether it's your first balayage or a complete transformation, every chair is a collaboration with Albert and his team. You leave with hair that fits your life and your standards."]}$j$::jsonb),
('hours', $j$[{"day":"Monday to Sunday","hours":"10AM to 6PM"}]$j$::jsonb),
('nav', $j$[{"label":"About","href":"/about"},{"label":"Services","href":"/services"},{"label":"Gallery","href":"/gallery"},{"label":"Reviews","href":"/reviews"},{"label":"Contact","href":"/contact"}]$j$::jsonb),
('seo', $j${"title":"Albert K Studio | Luxury Hair Salon in Aventura, FL","description":"Albert K Studio is a 5 star rated luxury hair salon in Aventura, FL. Expert cuts, balayage, keratin, hair botox & extensions at Town Center Aventura. Book your appointment today."}$j$::jsonb)
on conflict (key) do update set value = excluded.value, updated_at = now();
