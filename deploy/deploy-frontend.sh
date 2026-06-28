#!/usr/bin/env bash
# Build the frontend and publish it to the Nginx web root on the VPS.
# Run from the project root on the server (or adapt for rsync from local).
#
#   ./deploy/deploy-frontend.sh
#
# Requires a .env at the project root with the VITE_* values (baked in at build).
set -euo pipefail

WEB_ROOT="${WEB_ROOT:-/var/www/albertkstudio/dist}"

echo "==> Installing dependencies"
npm ci

echo "==> Building (VITE_* env baked in from .env)"
npm run build

echo "==> Publishing to ${WEB_ROOT}"
sudo mkdir -p "${WEB_ROOT}"
sudo rsync -a --delete dist/ "${WEB_ROOT}/"

echo "==> Reloading Nginx"
sudo nginx -t && sudo systemctl reload nginx

echo "==> Done."
