<?php
require_once "../../config/security.php";
require_once "../../config/db.php";
require_once "../../config/crypto.php";

// Set default success response to false in case of unlegitimate API call
$response["success"] = false;

// Check if the API call is legitimate
if($isAllowed) {
    // Check if the table to lookup for is given
    if(isset($json["table"]) && isset($json["id"])) {
        // Create new instance of class Database to interact with the database
        $db = new Database();
        
        $data = $db->selectWhere($json["table"], ["id" => $json["id"]]);
        if($data) {
            $crypto = new Crypto();

            $resultData = [];

            foreach($data[0] as $key => $value) {
                if(!in_array($key, ["id", "password", "role"])) {
                    $decrypted_value = $crypto->decryptData($value);
                    $resultData[$key] = $decrypted_value;
                } else {
                    $resultData[$key] = $value;
                }
            }

            $response["success"] = true;
            $response["data"] = $resultData;
        }
    } else {
        $response["error"] = "Veuillez indiquer toutes les données nécessaires pour faire cette recherche.";
    }
} else {
    $response["error"] = "La clé API n'est pas fournie ou est incorrecte.";
}

// Print the response in the json format
echo json_encode($response);