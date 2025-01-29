#!/bin/bash

API_KEY_SECRET="collab_default_secret"
COLLAB_URL="https://sfu.collab.com/api/v1/meetings"
#COLLAB_URL="http://localhost:3010/api/v1/meetings"

curl $COLLAB_URL \
    --header "authorization: $API_KEY_SECRET" \
    --header "Content-Type: application/json" \
    --request GET
