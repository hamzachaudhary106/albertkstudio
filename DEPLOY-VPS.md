# Deploying Albert K Studio on a Contabo VPS (self-hosted Supabase)

End-to-end guide to run the site **and** self-hosted Supabase on one Ubuntu VPS,
with Stripe deposits and Resend emails.

Everything lives on a single hostname:
- App: **`https://albertkstudio.agenbord.co`**
- Supabase API: **`https://albertkstudio.agenbord.co/supabase`** (reverse-proxied to Kong)

Replace `YOUR_VPS_IP` with the server's public IP. (Prefer a dedicated API
subdomain instead? Create `api.albertkstudio.agenbord.co` and point
`VITE_SUPABASE_URL` at it — but the single-host `/supabase` path below needs
only one DNS record and one certificate.)

```
                 ┌──────────────── Contabo VPS (Ubuntu 22.04 + Docker) ────────┐
Internet ──TLS──▶ Nginx (443)  albertkstudio.agenbord.co                        │
                 │  ├─ /            → /var/www/albertkstudio/dist (static SPA)   │
                 │  └─ /supabase/   → Kong :8000 (Supabase)                      │
                 │     Supabase: Postgres · Kong · Auth · REST · edge-runtime    │
                 │     (optional) Node booking server :8787                       │
                 └───────────────────────────────────────────────────────────────┘
```

---

## 0. DNS
Add one record in the `agenbord.co` zone:
```
A   albertkstudio.agenbord.co   YOUR_VPS_IP
```

## 1. Prepare the server
```bash
ssh root@YOUR_VPS_IP
apt update && apt upgrade -y
apt install -y nginx git curl ufw postgresql-client

# Node 20 (for the build + optional booking server)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Docker + compose plugin (for Supabase)
curl -fsSL https://get.docker.com | sh

# Firewall: only SSH + web. Postgres/Kong stay internal.
ufw allow OpenSSH && ufw allow 'Nginx Full' && ufw --force enable
```

## 2. Self-host Supabase
```bash
git clone --depth 1 https://github.com/supabase/supabase
mkdir -p /opt/supabase && cp -r supabase/docker/* /opt/supabase/
cd /opt/supabase
cp .env.example .env
```
Edit `/opt/supabase/.env` — **at minimum**:
```
POSTGRES_PASSWORD=<long-random>
JWT_SECRET=<40+ char random>
ANON_KEY=<generate from JWT_SECRET>          # see note below
SERVICE_ROLE_KEY=<generate from JWT_SECRET>
DASHBOARD_USERNAME=admin
DASHBOARD_PASSWORD=<random>
SITE_URL=https://albertkstudio.agenbord.co
API_EXTERNAL_URL=https://albertkstudio.agenbord.co/supabase
SUPABASE_PUBLIC_URL=https://albertkstudio.agenbord.co/supabase
```
> Generate `ANON_KEY` / `SERVICE_ROLE_KEY` from your `JWT_SECRET` with the
> generator at https://supabase.com/docs/guides/self-hosting#api-keys
> (roles `anon` and `service_role`). Don't reuse the shipped demo keys.

Add the booking secrets so the **edge-runtime** (functions) can read them. In
`/opt/supabase/.env`:
```
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
RESEND_API_KEY=re_xxx
SALON_EMAIL=info@albertkstudio.com
FROM_EMAIL=Albert K Studio <bookings@albertkstudio.com>
```
…and make sure the `functions` service in `docker-compose.yml` passes them
through (add under its `environment:` if not already inherited), alongside the
`SUPABASE_URL=http://kong:8000` and `SUPABASE_SERVICE_ROLE_KEY` it already sets.

Start it:
```bash
docker compose up -d
docker compose ps        # all healthy?
```
Kong now listens on `127.0.0.1:8000`.

## 3. Apply the database schema + seed
Copy this repo to `/var/www/albertkstudio`, then:
```bash
cd /var/www/albertkstudio
PGURL="postgres://postgres:<POSTGRES_PASSWORD>@localhost:5432/postgres"
psql "$PGURL" -f supabase/migrations/0001_booking_system.sql
psql "$PGURL" -f supabase/seed.sql
```

## 4. Deploy the Edge Functions  *(Option A — recommended)*
```bash
cp -r supabase/functions/create-booking  /opt/supabase/volumes/functions/
cp -r supabase/functions/stripe-webhook  /opt/supabase/volumes/functions/
cp -r supabase/functions/_shared         /opt/supabase/volumes/functions/
docker compose -f /opt/supabase/docker-compose.yml restart functions
```
Functions are now served at `https://albertkstudio.agenbord.co/supabase/functions/v1/<name>`.
`supabase/config.toml` sets `verify_jwt = false` for `stripe-webhook` so Stripe
can reach it; if your edge-runtime verifies JWT globally and webhooks 401, use
**Option B** instead.

### Option B — Standalone Node booking server (fallback)
Skip step 4 and run the two endpoints as a small service:
```bash
cd /var/www/albertkstudio/server
cp .env.example .env && nano .env      # SUPABASE_URL=http://localhost:8000 + keys
npm install
sudo cp ../deploy/albertk-booking.service /etc/systemd/system/
sudo systemctl daemon-reload && sudo systemctl enable --now albertk-booking
```
Then **uncomment the `/supabase/functions/v1/` block (Option B)** in the Nginx
config so those paths route to `127.0.0.1:8787` instead of Kong.

## 5. Build & publish the frontend
```bash
cd /var/www/albertkstudio
cp .env.example .env
nano .env
```
Set:
```
VITE_SUPABASE_URL=https://albertkstudio.agenbord.co/supabase
VITE_SUPABASE_ANON_KEY=<self-hosted ANON_KEY from step 2>
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
```
Build & deploy (writes to `/var/www/albertkstudio/dist`):
```bash
./deploy/deploy-frontend.sh
```
> `VITE_*` vars are baked in at build time — re-run this script whenever they change.

## 6. Nginx + TLS
```bash
cp deploy/nginx/albertkstudio.conf /etc/nginx/sites-available/albertkstudio.conf
ln -s /etc/nginx/sites-available/albertkstudio.conf /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

apt install -y certbot python3-certbot-nginx
certbot --nginx -d albertkstudio.agenbord.co
nginx -t && systemctl reload nginx
```

## 7. Stripe + Resend
1. **Stripe → Webhooks → Add endpoint:**
   `https://albertkstudio.agenbord.co/supabase/functions/v1/stripe-webhook`
   Events: `payment_intent.succeeded`, `payment_intent.canceled`.
   Put the signing secret in `STRIPE_WEBHOOK_SECRET` (edge `.env` or `server/.env`)
   and restart that service.
2. **Resend:** verify your sending domain and set `FROM_EMAIL` to an address on it.

## 8. Smoke test
- Visit `https://albertkstudio.agenbord.co/book` → service → date → time → details.
- Pay with Stripe **test** card `4242 4242 4242 4242` (use test keys first).
- Confirm: appointment row flips to `confirmed`, both emails arrive, and the
  slot no longer shows as available.

---

## Operating it
- **View/manage bookings:** the Supabase Studio dashboard isn't exposed publicly.
  Reach it over an SSH tunnel:
  ```bash
  ssh -L 8000:localhost:8000 root@YOUR_VPS_IP
  # then open http://localhost:8000 in your browser (dashboard user/pass from step 2)
  ```
  Or query directly with `psql` → table `appointments`.
- **Time off / holidays:** add rows to `blocked_times` (null `staff_id` = whole salon).
- **Change services / deposits / hours:** edit `services` and `business_hours`.
- **Updates:** `git pull` → re-run `./deploy/deploy-frontend.sh`; for function
  changes, re-copy to the volume and `restart functions` (A) or
  `systemctl restart albertk-booking` (B).

## Auto-deploy (GitHub Actions)
Pushing to `main` automatically deploys to the VPS via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml): it SSHes in and
runs [`deploy/server-deploy.sh`](deploy/server-deploy.sh), which `git pull`s,
rebuilds the frontend, and refreshes the edge functions.

Required repo secrets (Settings → Secrets → Actions):
- `SERVER_HOST` — VPS IP
- `SERVER_USER` — SSH user (e.g. `root`)
- `SERVER_SSH_KEY` — private key whose public half is in the server's `~/.ssh/authorized_keys`

Trigger manually anytime with **Actions → Deploy to VPS → Run workflow**.
The server checkout lives at `/var/www/albertkstudio` (its `.env` is untracked
and preserved across deploys). **Database migrations are not auto-applied** —
run new ones manually (step 3) to avoid data loss.

## Security checklist
- Postgres (5432) and Kong (8000) bound to localhost only — never open in `ufw`.
- Regenerated `JWT_SECRET`, `ANON_KEY`, `SERVICE_ROLE_KEY`, DB + dashboard passwords.
- Secrets live in server-side `.env` files only (git-ignored). `SERVICE_ROLE_KEY`
  never ships to the browser — the frontend only ever uses `ANON_KEY`.
- Use **live** Stripe keys only after a successful test-mode run.
