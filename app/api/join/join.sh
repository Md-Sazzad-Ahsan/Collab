#!/bin/bash

# Configuration
API_KEY_SECRET="collab_default_secret"
COLLAB_URL="https://sfu.collab.com/api/v1/join"
# Alternative URL for local testing:
# COLLAB_URL="http://localhost:3010/api/v1/join"

# Request data with proper JSON formatting
REQUEST_DATA='{
    "room": "test",
    "roomPassword": false,
    "name": "collab",
    "avatar": false,
    "audio": false,
    "video": false,
    "screen": false,
    "hide": false,
    "notify": true,
    "duration": "unlimited",
    "token": {
        "username": "username",
        "password": "password",
        "presenter": true,
        "expire": "1h"
    }
}'

# Make the API request
curl -X POST "$COLLAB_URL" \
    -H "Authorization: $API_KEY_SECRET" \
    -H "Content-Type: application/json" \
    -d "$REQUEST_DATA"