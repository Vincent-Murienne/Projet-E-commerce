<?php
require_once "../../config/security.php";
require_once "../../config/db.php";

// Set default success response to false in case of unlegitimate API call
$response["success"] = false;

// Check if the API call is legitimate
if($isAllowed) {
    // Check if the input variables are set
    if(isset($json["table"])) {
        $db = new Database();
        $data = $db->getTop($json["table"]);
        
        if($data) {
            $response["success"] = true;
            $response["data"] = $data;
        }
        else{
            $response["error"] = "Il n'existe pas d'éléments mis en avant.";
        }
    } else {
        $response["error"] = "Veuillez indiquer dans les données envoyés la table dans laquelle faire cette recherche.";
    }
} else {
    $response["error"] = "La clé API n'est pas fournie ou est incorrecte.";
}

// Print the response in the json format
echo json_encode($response);