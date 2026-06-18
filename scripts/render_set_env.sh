#!/usr/bin/env bash
set -euo pipefail

# render_set_env.sh
# Sets Render environment variables for a service using Render CLI if available,
# otherwise uses the Render HTTP API. Do NOT commit secrets — keep them in CI
# or pass them via environment when running this script.
#
# Usage example:
#
# export RENDER_SERVICE_ID=<your-service-id>
# export RENDER_API_KEY=<your-render-api-key>
# export MONGO_URI="mongodb+srv://<user>:<pass>@cluster0.mongodb.net/bloodconnect"
# export JWT_SECRET="$(openssl rand -hex 32)"
# export FRONTEND_URL="https://bc-crm-final-2026.vercel.app"
# export PORT=5010   # optional; Render supplies PORT automatically
# ./scripts/render_set_env.sh

if [[ -z "${RENDER_SERVICE_ID:-}" || -z "${RENDER_API_KEY:-}" ]]; then
  echo "ERROR: Set RENDER_SERVICE_ID and RENDER_API_KEY in your environment first." >&2
  exit 2
fi

declare -A vars
vars=(
  [MONGO_URI]="${MONGO_URI:-}"
  [JWT_SECRET]="${JWT_SECRET:-}"
  [FRONTEND_URL]="${FRONTEND_URL:-}"
  [PORT]="${PORT:-}"
)

echo "Preparing to set ${#vars[@]} env vars for Render service ${RENDER_SERVICE_ID}"

if command -v render >/dev/null 2>&1; then
  echo "Using Render CLI to set env vars (render)."
  for k in "${!vars[@]}"; do
    v="${vars[$k]}"
    if [[ -z "$v" ]]; then
      echo "Skipping $k — value empty"
      continue
    fi
    echo "Setting $k via Render CLI..."
    # `render` CLI syntax can vary; this attempts the common 'services env set' command.
    render services env set "$RENDER_SERVICE_ID" "$k" "$v" || {
      echo "Render CLI failed to set $k — please verify the Render CLI version and permissions." >&2
    }
  done
  echo "Done. Check Render dashboard or `render services env list $RENDER_SERVICE_ID` to verify."
  exit 0
fi

echo "Render CLI not found — falling back to Render HTTP API via curl."

API_BASE=https://api.render.com/v1

for k in "${!vars[@]}"; do
  v="${vars[$k]}"
  if [[ -z "$v" ]]; then
    echo "Skipping $k — value empty"
    continue
  fi

  echo "Setting $k via Render API..."
  # POST to /services/:id/env-vars with JSON body { key, value, scope }
  curl -sSf -X POST "$API_BASE/services/$RENDER_SERVICE_ID/env-vars" \
    -H "Authorization: Bearer $RENDER_API_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"key\":\"$k\",\"value\":\"$v\",\"scope\":\"env\"}" || {
    echo "Failed to set $k via API" >&2
  }
done

echo "Finished setting env vars. Verify in Render dashboard or via API."
