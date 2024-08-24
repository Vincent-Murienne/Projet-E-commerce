<?php
require_once "../../config/security.php";
require_once "../../config/db.php";
require_once "../../config/crypto.php";

// Set default success response to false in case of unlegitimate API call
$response["success"] = false;

// Check if the API call is legitimate
if($isAllowed) {
    // Check if the input variables are set
    if(isset($json["table"]) && isset($json["id"]) && isset($json["data"])) {
        $db = new Database();

        // The data array contains sensitive information so we have to encrypt them before sending them to the database
        $crypto = new Crypto();

        $updateData = [];

        foreach($json["data"] as $key => $value) {
            if(!in_array($key, ["id", "password", "role"])) {
                $encrypted_value = $crypto->cryptData($value);
                $updateData[$key] = $encrypted_value;
            } else {
                $updateData[$key] = $value;
            }
        }

        $data = $db->update($json["table"], $updateData, $json["id"]);
        if($data) {
            $response["success"] = true;
        }
    } else {
        $response["error"] = "Veuillez indiquer toutes les données nécessaires à ce traitement.";
    }
} else {
    $response["error"] = "La clé API n'est pas fournie ou est incorrecte.";
}

// Print the response in the json format
echo json_encode($response);