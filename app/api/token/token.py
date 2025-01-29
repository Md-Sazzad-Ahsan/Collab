# pip3 install requests
import requests
import json

API_KEY_SECRET = "collab_default_secret"
COLLAB_URL = "https://sfu.collab.com/api/v1/token"
#COLLAB_URL = "http://localhost:3010/api/v1/token"

headers = {
    "authorization": API_KEY_SECRET,
    "Content-Type": "application/json",
}

data = {
    "username": "username",
    "password": "password",
    "presenter": "true",
    "expire": "1h"
}

response = requests.post(
    COLLAB_URL, 
    headers=headers, 
    json=data
)

print("Status code:", response.status_code)
data = json.loads(response.text)
print("token:", data["token"])
