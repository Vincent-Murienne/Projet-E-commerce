<?php
require_once "../../config/security.php";
require_once "../../config/db.php";

// Set default success response to false in case of unlegitimate API call
$response["success"] = false;

// Check if the API call is legitimate
if($isAllowed) {
    // Check if the table to lookup for is given
    if(isset($json["table"])) {
        // Create new instance of class Database to interact with the database
        $db = new Database();
        $data = $db->getProduitDetail($json["table"]);
        if($data) {
            $response["success"] = true;
            $response["data"] = $data;
        }
    } else {
        $response["error"] = "Veuillez indiquer dans les données envoyées la table dans laquelle faire cette recherche.";
        // Log the received data for debugging
        error_log("Received data: " . print_r($json, true));
    }
} else {
    $response["error"] = "La clé API n'est pas fournie ou est incorrecte.";
}

// Print the response in the json format
echo json_encode($response);
?>
