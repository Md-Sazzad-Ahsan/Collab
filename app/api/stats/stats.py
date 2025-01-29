# pip3 install requests
import requests
import json

API_KEY_SECRET = "collab_default_secret"
COLLAB_URL = "https://sfu.collab.com/api/v1/stats"
#COLLAB_URL = "http://localhost:3010/api/v1/stats"

headers = {
    "authorization": API_KEY_SECRET,
    "Content-Type": "application/json",
}

response = requests.get(
    COLLAB_URL,
    headers=headers
)

print("Status code:", response.status_code)

if response.status_code == 200:
    data = response.json()
    pretty_printed_data = json.dumps(data, indent=4)
    print(data)
else:
    print("Failed to retrieve data. Error:", response.text)
