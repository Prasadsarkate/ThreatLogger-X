#!/bin/bash

BASE_URL="http://127.0.0.1:8000"

echo "=============================="
echo "🔐 Logging in to ThreatLogger API"
echo "=============================="

# 1. Login and get token
TOKEN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq -r .access_token)

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Login failed. Check username/password or server."
  exit 1
fi

echo "✅ Got token: $TOKEN"

echo "=============================="
echo "🔍 Testing Endpoints with Token"
echo "=============================="

# 2. List Incidents
echo -e "\n📌 GET /incidents"
INCIDENTS=$(curl -s -X GET "$BASE_URL/incidents" \
  -H "Authorization: Bearer $TOKEN")

echo "$INCIDENTS" | jq .

# Extract latest incident ID
LATEST_ID=$(echo "$INCIDENTS" | jq -r '.[0].id')

if [ "$LATEST_ID" == "null" ] || [ -z "$LATEST_ID" ]; then
  echo "⚠️ No incidents found!"
  exit 1
fi

echo "✅ Latest Incident ID: $LATEST_ID"

# 3. Run Simulation
echo -e "\n📌 POST /simulate/run"
curl -s -X POST "$BASE_URL/simulate/run" \
  -H "Authorization: Bearer $TOKEN" | jq .

# 4. Quarantine
echo -e "\n📌 POST /response/quarantine"
curl -s -X POST "$BASE_URL/response/quarantine" \
  -H "Authorization: Bearer $TOKEN" | jq .

# 5. Generate Report for Latest Incident
echo -e "\n📌 POST /report/generate?incident_id=$LATEST_ID"
curl -s -X POST "$BASE_URL/report/generate?incident_id=$LATEST_ID" \
  -H "Authorization: Bearer $TOKEN" | jq .

echo -e "\n✅ Testing complete!"
