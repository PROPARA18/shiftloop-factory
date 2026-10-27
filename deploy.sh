#!/usr/bin/env bash
set -euo pipefail
project="${GOOGLE_CLOUD_PROJECT:-promptwars-c840c}"
region="${REGION:-asia-south1}"
if [ -z "${FIREBASE_CONFIG:-}" ]; then
  echo 'Set FIREBASE_CONFIG to your Firebase web app JSON configuration first.' >&2
  exit 1
fi
node --test tests.mjs
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com --project="$project"
config_file=$(mktemp)
trap 'rm -f "$config_file"' EXIT
node -e 'process.stdout.write(JSON.stringify({FIREBASE_CONFIG:process.env.FIREBASE_CONFIG}))' > "$config_file"
gcloud run deploy shiftloop-factory --source=. --project="$project" --region="$region" --allow-unauthenticated --port=8080 --memory=256Mi --cpu=1 --min-instances=0 --max-instances=2 --env-vars-file="$config_file" --quiet
gcloud run services describe shiftloop-factory --project="$project" --region="$region" --format='value(status.url)'
