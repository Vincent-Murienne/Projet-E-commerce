<?php
// We need to put each of these headers to allow api calls from our react project
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// We import the env parser to retrieve the api key
require_once "../../config/envParser.php";

(new DotEnv("../../config/.env"))->load();
$apiKey = getenv("API_KEY");

// We compare the apiKey from the one received to see if it is legitimate
$isAllowed = false;
// $json = json_decode(file_get_contents("php://input"), true);

$json = [
    "recherche" => "te",
    "prix_min" => 15,
    "prix_max" => null,
    "materiaux" => [1],
    "categories" => [3],
    "en_stock" => true,
    "apiKey" => $apiKey
];

if(isset($json["apiKey"]) && $json["apiKey"] == $apiKey) {
    $isAllowed = true;
}


