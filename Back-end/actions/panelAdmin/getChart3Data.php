<?php
require_once "../../config/security.php";
require_once "../../config/db.php";

// Set default success response to false in case of unlegitimate API call
$response["success"] = false;

// Check if the API call is legitimate
if($isAllowed) {
    // Check if the input variables are set
    if(isset($json["date_start"]) && isset($json["date_end"])) {
        $db = new Database();
        $data = $db->getChart3Data($json["date_start"], $json["date_end"]);
        
        if($data) {
            $response["success"] = true;
            $response["data"] = $data;
        } else {
            $response["error"] = "Il n'existe aucune donnée pour cette période de temps.";
        }
    } else {
        $response["error"] = "Veuillez indiquer toutes les données nécessaires à ce traitement.";
    }
} else {
    $response["error"] = "La clé API n'est pas fournie ou est incorrecte.";
}

// Print the response in the json format
echo json_encode($response);