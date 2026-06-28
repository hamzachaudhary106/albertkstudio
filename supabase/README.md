# Booking System — Setup Guide

Custom appointment booking for Albert K Studio: **Supabase** (Postgres + Edge Functions),
**Stripe** (embedded Payment Element, deposit), and **Resend** (confirmation emails).

Until the env vars below are set, the site's booking panel safely falls back to a
"call us" card — nothing breaks.

---

## 1. Create the accounts
- **Supabase** project → https://supabase.com
- **Stripe** account → https://stripe.com (start in **Test mode**)
- **Resend** account → https://resend.com, and verify your sending domain

## 2. Install the Supabase CLI and link the project
```bash
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

## 3. Create the schema + seed data
```bash
supabase db push                         # applies supabase/migrations/*
supabase db execute --file supabase/seed.sql   # services, staff, hours
```
(Or paste `migrations/0001_booking_system.sql` then `seed.sql` into the SQL Editor.)

## 4. Deploy the Edge Functions
```bash
supabase functions deploy create-booking
supabase functions deploy stripe-webhook --no-verify-jwt   # Stripe calls this unauthenticated
```

## 5. Set the function secrets (server-side only — never in the frontend)
```bash
supabase secrets set \
  STRIPE_SECRET_KEY=sk_test_xxx \
  STRIPE_WEBHOOK_SECRET=whsec_xxx \
  RESEND_API_KEY=re_xxx \
  SALON_EMAIL=info@albertkstudio.com \
  "FROM_EMAIL=Albert K Studio <bookings@yourdomain.com>"
```
`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically.

## 6. Configure the Stripe webhook
1. Stripe Dashboard → Developers → **Webhooks** → Add endpoint:
   `https://YOUR_PROJECT.supabase.co/functions/v1/stripe-webhook`
2. Subscribe to events: `payment_intent.succeeded`, `payment_intent.canceled`.
3. Copy the **Signing secret** (`whsec_...`) into `STRIPE_WEBHOOK_SECRET` (step 5).

## 7. Frontend env vars
Copy `.env.example` → `.env` (local) and set the same three on your host (Vercel/Netlify):
```
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```
Then `npm run build` / redeploy.

---

## How it works
1. The browser reads **services** and **availability** with the anon key
   (`available_slots` is a `SECURITY DEFINER` function — it never exposes customer data).
2. On "Continue to Deposit", the **`create-booking`** function re-validates the slot,
   inserts a `pending` appointment (a Postgres exclusion constraint blocks double-booking),
   and creates a Stripe **PaymentIntent** for the deposit.
3. The customer pays via the embedded **Payment Element**.
4. Stripe calls **`stripe-webhook`**, which flips the appointment to `confirmed` and emails
   the customer + salon via Resend.
5. Abandoned checkouts auto-expire after 15 minutes and release their slot.

## Managing bookings
View/manage appointments in the Supabase **Table Editor** → `appointments`.
Add vacations/holidays as rows in `blocked_times` (null `staff_id` = whole salon).
Edit services, durations, and deposits in the `services` table.

## Testing
- Use Stripe test card `4242 4242 4242 4242`, any future expiry/CVC.
- Trigger the webhook locally with `stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook`.
