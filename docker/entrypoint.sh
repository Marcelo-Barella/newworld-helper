#!/bin/sh
set -e
export API_HOST="${API_HOST:-127.0.0.1}"
export API_PORT="${API_PORT:-4000}"
export HOST="${HOST:-0.0.0.0}"
export PORT="${PUBLIC_PORT:-8080}"
node /app/apps/api/dist/main.js &
API_PID=$!
exec node /app/apps/web/.output/server/index.mjs