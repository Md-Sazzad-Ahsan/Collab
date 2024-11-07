#!/bin/bash

API_KEY_SECRET="meetversesfu_default_secret"
MEETVERSE_URL="https://sfu.meetverse.com/api/v1/meetings"
#MEETVERSE_URL="http://localhost:3010/api/v1/meetings"

curl $MEETVERSE_URL \
    --header "authorization: $API_KEY_SECRET" \
    --header "Content-Type: application/json" \
    --request GET
