<?php
require_once "../../config/security.php";
require_once "../../config/db.php";
require_once "../../config/crypto.php";

// Set default success response to false in case of unlegitimate API call
$response["success"] = false;

// Check if the API call is legitimate
if($isAllowed) {
    // Check if the input variables are set
    if(isset($json["id"])) {
        $db = new Database();
        $data = $db->downloadPersonalData($json["id"]);
        if($data) {
            // The data array contains crypted information so we have to decrypt them before sending them back to the front-end
            $crypto = new Crypto();

            $resultData = [];
            $index = 0;

            foreach($data as $address) {
                foreach($address as $key => $value) {
                    if(!in_array($key, ["zip_code"])) {
                        $decrypted_value = $crypto->decryptData($value);
                        $resultData[$index][$key] = $decrypted_value;
                    } else {
                        $resultData[$index][$key] = $value;
                    }
                }
                $index++;
            }

            $response["success"] = true;
            $response["data"] = $resultData;
        }
    } else {
        $response["error"] = "Veuillez indiquer dans les données envoyés la table dans laquelle faire cette recherche.";
    }
} else {
    $response["error"] = "La clé API n'est pas fournie ou est incorrecte.";
}

// Print the response in the json format
echo json_encode($response);