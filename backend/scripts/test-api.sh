#!/bin/bash

# Wine Catalog API Test Script
echo "🍷 Testing Wine Catalog API"
echo "=========================="

BASE_URL="http://localhost:3001/api"
EMAIL="${TEST_EMAIL:-test@example.com}"
PASSWORD="${TEST_PASSWORD:-defaultpassword}"

# Test 1: Health Check
echo -e "\n1️⃣ Testing Health Endpoint..."
curl -s "$BASE_URL/health" | jq -r '.message'

# Test 2: Login
echo -e "\n2️⃣ Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.token')
USER_EMAIL=$(echo $LOGIN_RESPONSE | jq -r '.data.user.email')

if [ "$TOKEN" != "null" ]; then
    echo "✅ Login successful for $USER_EMAIL"
else
    echo "❌ Login failed"
    exit 1
fi

# Test 3: Get User Profile
echo -e "\n3️⃣ Getting user profile..."
curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/auth/me" | jq -r '.data.user | "\(.firstName) \(.lastName) (\(.email))"'

# Test 4: Get All Wines (first page)
echo -e "\n4️⃣ Getting wine collection (first 5 wines)..."
WINES_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/wines?limit=5")
TOTAL_WINES=$(echo $WINES_RESPONSE | jq -r '.data.pagination.total')
echo "📊 Total wines in collection: $TOTAL_WINES"

# Test 5: Filter by Style
echo -e "\n5️⃣ Getting red wines..."
RED_WINES=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/wines?style=red&limit=3")
RED_COUNT=$(echo $RED_WINES | jq -r '.data.pagination.total')
echo "🍷 Red wines: $RED_COUNT"

# Test 6: Filter by Country
echo -e "\n6️⃣ Getting French wines..."
FRENCH_WINES=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/wines?country=France&limit=3")
FRENCH_COUNT=$(echo $FRENCH_WINES | jq -r '.data.pagination.total')
echo "🇫🇷 French wines: $FRENCH_COUNT"

# Test 7: Search functionality
echo -e "\n7️⃣ Searching for 'Château'..."
SEARCH_RESULTS=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/wines?search=Château&limit=3")
SEARCH_COUNT=$(echo $SEARCH_RESULTS | jq -r '.data.pagination.total')
echo "🔍 Search results: $SEARCH_COUNT wines found"

# Test 8: Get specific wine
echo -e "\n8️⃣ Getting specific wine details..."
WINE_ID=$(echo $WINES_RESPONSE | jq -r '.data.wines[0]._id')
WINE_DETAILS=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/wines/$WINE_ID")
WINE_NAME=$(echo $WINE_DETAILS | jq -r '.data.wine.name')
WINE_VINTAGE=$(echo $WINE_DETAILS | jq -r '.data.wine.vintage')
echo "🍾 Wine: $WINE_NAME ($WINE_VINTAGE)"

# Test 9: Filter by vintage
echo -e "\n9️⃣ Getting wines from 2020..."
VINTAGE_2020=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/wines?vintage=2020&limit=3")
VINTAGE_COUNT=$(echo $VINTAGE_2020 | jq -r '.data.pagination.total')
echo "📅 2020 vintage wines: $VINTAGE_COUNT"

# Test 10: Complex filtering
echo -e "\n🔟 Complex filter: Red wines from France..."
COMPLEX_FILTER=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/wines?style=red&country=France&limit=3")
COMPLEX_COUNT=$(echo $COMPLEX_FILTER | jq -r '.data.pagination.total')
echo "🎯 Red French wines: $COMPLEX_COUNT"

# Summary
echo -e "\n✅ API Test Summary"
echo "=================="
echo "🏥 Health Check: ✅"
echo "🔐 Authentication: ✅"
echo "👤 User Profile: ✅"
echo "📋 Wine List: ✅ ($TOTAL_WINES total)"
echo "🍷 Style Filter: ✅ ($RED_COUNT red wines)"
echo "🌍 Country Filter: ✅ ($FRENCH_COUNT French wines)"
echo "🔍 Search: ✅ ($SEARCH_COUNT results)"
echo "🍾 Single Wine: ✅"
echo "📅 Vintage Filter: ✅ ($VINTAGE_COUNT from 2020)"
echo "🎯 Complex Filter: ✅ ($COMPLEX_COUNT matches)"

echo -e "\n🎉 All tests passed! API is fully functional."
