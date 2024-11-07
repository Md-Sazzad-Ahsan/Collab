#!/bin/bash

API_KEY_SECRET="meetversesfu_default_secret"
MEETVERSE_URL="https://sfu.meetverse.com/api/v1/token"
#MEETVERSE_URL="http://localhost:3010/api/v1/token"

curl $MEETVERSE_URL \
    --header "authorization: $API_KEY_SECRET" \
    --header "Content-Type: application/json" \
    --data '{"username":"username","password":"password","presenter":"true", "expire":"1h"}' \
    --request POST