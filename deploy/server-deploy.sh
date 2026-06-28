#!/usr/bin/env bash
# Runs ON THE SERVER (invoked by the GitHub Actions deploy workflow over SSH).
# Pulls the latest code, rebuilds the frontend, and updates the edge functions.
#
# Note: database migrations are intentionally NOT auto-applied (to avoid data
# loss). Run new migrations manually — see DEPLOY-VPS.md.
set -euo pipefail

APP=/var/www/albertkstudio
SUPA=/opt/albertk-supabase

cd "$APP"

echo "==> Pulling latest from origin/main"
git fetch origin main
git reset --hard origin/main

echo "==> Installing dependencies"
npm ci --no-audit --no-fund

echo "==> Building frontend (VITE_* from $APP/.env)"
npm run build

echo "==> Updating edge functions"
cp -r supabase/functions/create-booking supabase/functions/stripe-webhook supabase/functions/_shared "$SUPA/volumes/functions/"
docker compose -f "$SUPA/docker-compose.yml" -f "$SUPA/docker-compose.override.yml" restart functions

echo "==> Deploy complete: $(git rev-parse --short HEAD)"
