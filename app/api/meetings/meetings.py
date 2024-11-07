# pip3 install requests
import requests
import json

API_KEY_SECRET = "meetversesfu_default_secret"
MEETVERSE_URL = "https://sfu.meetverse.com/api/v1/meetings"
#MEETVERSE_URL = "http://localhost:3010/api/v1/meetings"

headers = {
    "authorization": API_KEY_SECRET,
    "Content-Type": "application/json",
}

response = requests.get(
    MEETVERSE_URL,
    headers=headers
)

print("Status code:", response.status_code)

if response.status_code == 200:
    data = response.json()
    pretty_printed_data = json.dumps(data, indent=4)
    print(data)
else:
    print("Failed to retrieve data. Error:", response.text)
