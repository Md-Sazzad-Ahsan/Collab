#!/bin/bash

API_KEY_SECRET="collab_default_secret"
COLLAB_URL="https://sfu.collab.com/api/v1/token"
#COLLAB_URL="http://localhost:3010/api/v1/token"

curl $COLLAB_URL \
    --header "authorization: $API_KEY_SECRET" \
    --header "Content-Type: application/json" \
    --data '{"username":"username","password":"password","presenter":"true", "expire":"1h"}' \
    --request POST