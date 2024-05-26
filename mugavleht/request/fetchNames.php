<?php

$curl = curl_init("https://api.namefake.com/spanish/male");
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
$response = curl_exec($curl);

echo $response;