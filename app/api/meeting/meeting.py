# pip3 install requests
import requests
import json

API_KEY_SECRET = "meetversesfu_default_secret"
MEETVERSE_URL = "https://sfu.meetverse.com/api/v1/meeting"
# MEETVERSE_URL = "http://localhost:3010/api/v1/meeting"

headers = {
    "authorization": API_KEY_SECRET,
    "Content-Type": "application/json",
}

response = requests.post(
    MEETVERSE_URL,
    headers=headers
)

print("Status code:", response.status_code)
data = json.loads(response.text)
print("meeting:", data["meeting"])
