#!/bin/bash

API_KEY_SECRET="meetverse_default_secret"
MIROTALK_URL="https://sfu.meetverse.com/api/v1/join"
# MIROTALK_URL="http://localhost:3010/api/v1/join"

curl $MIROTALK_URL \
    --header "authorization: $API_KEY_SECRET" \
    --header "Content-Type: application/json" \
    --data '{"room":"test","roomPassword":"false","name":"meetverse","audio":"true","video":"true","screen":"false","hide":"false","notify":"true","duration":"unlimited","token":{"username":"username","password":"password","presenter":"true", "expire":"1h"}}' \
    --request POST