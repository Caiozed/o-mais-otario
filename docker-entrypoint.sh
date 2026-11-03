#!/bin/sh
set -e

mkdir -p /data

echo "Seeding database if empty..."
node ./scripts/docker-seed.mjs

echo "Starting Ranking da Canalhice on :${PORT:-3000}"
exec node server.js
