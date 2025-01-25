#!/bin/bash

API_KEY_SECRET="meetverse_default_secret"
MIROTALK_URL="https://sfu.meetverse.com/api/v1/meetings"
#MIROTALK_URL="http://localhost:3010/api/v1/meetings"

curl $MIROTALK_URL \
    --header "authorization: $API_KEY_SECRET" \
    --header "Content-Type: application/json" \
    --request GET
