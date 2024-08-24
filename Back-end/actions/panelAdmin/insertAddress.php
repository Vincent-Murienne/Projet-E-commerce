<?php
require_once "../../config/security.php";
require_once "../../config/db.php";
require_once "../../config/crypto.php";

// Set default success response to false in case of unlegitimate API call
$response["success"] = false;

// Check if the API call is legitimate
if($isAllowed) {
    // Check if the input variables are set
    if(isset($json["table"]) && isset($json["data"])) {
        $db = new Database();

        // The data array contains sensitive information so we have to encrypt them before sending them to the database
        $crypto = new Crypto();

        $insertData = [];

        foreach($json["data"] as $key => $value) {
            if(!in_array($key, ["id", "user_id", "zip_code"])) {
                $encrypted_value = $crypto->cryptData($value);
                $insertData[$key] = $encrypted_value;
            } else {
                $insertData[$key] = $value;
            }
        }

        $data = $db->insert($json["table"], $insertData);
        if($data) {
            $id = $db->getLastIdInserted(); // Retrieve the id of the address we just created to get back all informations and send them back to front-end
            if($id) {
                $response["success"] = true;
                $response["id"] = $id["LAST_INSERT_ID()"];
            } else {
                $response["error"] = "Erreur lors du traitement en base de donnée.";
            }
        } else {
            $response["error"] = "Erreur lors du traitement en base de donnée.";
        }
    } else {
        $response["error"] = "Veuillez indiquer toutes les données nécessaires à ce traitement.";
    }
} else {
    $response["error"] = "La clé API n'est pas fournie ou est incorrecte.";
}

// Print the response in the json format
echo json_encode($response);