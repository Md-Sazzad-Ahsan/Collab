# pip3 install requests
import requests
import json

API_KEY_SECRET = "collab_default_secret"
COLLAB_URL = "https://sfu.collab.com/api/v1/meeting"
# COLLAB_URL = "http://localhost:3010/api/v1/meeting"

headers = {
    "authorization": API_KEY_SECRET,
    "Content-Type": "application/json",
}

response = requests.post(
    COLLAB_URL,
    headers=headers
)

print("Status code:", response.status_code)
data = json.loads(response.text)
print("meeting:", data["meeting"])
