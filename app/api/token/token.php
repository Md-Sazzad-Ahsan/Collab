<?php

$API_KEY_SECRET = "meetversesfu_default_secret";
$MEETVERSE_URL = "https://sfu.meetverse.com/api/v1/token";
#$MEETVERSE_URL = "http://localhost:3010/api/v1/token";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $MEETVERSE_URL);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);

$headers = [
    'authorization:' . $API_KEY_SECRET,
    'Content-Type: application/json'
];

curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$data = array(
    "username"      => "username",
    "password"      => "password",
    "presenter"     => true,
    "expire"        => "1h",
);

$data_string = json_encode($data);

curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

curl_close($ch);

echo "Status code: $httpcode \n";
$data = json_decode($response);
echo "token: ", $data->{'token'}, "\n";
