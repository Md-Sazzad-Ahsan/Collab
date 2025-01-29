#!/bin/bash

API_KEY_SECRET="collab_default_secret"
COLLAB_URL="https://sfu.collab.com/api/v1/join"
# COLLAB_URL="http://localhost:3010/api/v1/join"

curl $COLLAB_URL \
    --header "authorization: $API_KEY_SECRET" \
    --header "Content-Type: application/json" \
    --data '{"room":"test","roomPassword":"false","name":"collab","audio":"true","video":"true","screen":"false","hide":"false","notify":"true","duration":"unlimited","token":{"username":"username","password":"password","presenter":"true", "expire":"1h"}}' \
    --request POST