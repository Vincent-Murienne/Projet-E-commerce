<?php
// On met les headers nécessaires afin de pouvoir correctement récupérer les données envoyés via un appel api depuis un projet react en local
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// On importe le parser afin de pouvoir récupérer la clé api
require_once "../../config/envParser.php";

(new DotEnv("../../config/.env"))->load();
$apiKey = getenv("API_KEY");

// On vient comparer notre clé api avec celle fournit dans la requête API afin de vérifier qu'elle est légitime
$isAllowed = false;
$json = json_decode(file_get_contents("php://input"), true);
//$json = ["table" => "images", "apiKey" => $apiKey];
if(isset($json["apiKey"]) && $json["apiKey"] == $apiKey) {
    $isAllowed = true;
}