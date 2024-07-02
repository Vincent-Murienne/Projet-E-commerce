<?php
require_once "../../config/security.php";
require_once "../../config/db.php";

// Set default success response to false in case of unlegitimate API call
$response["success"] = false;

// Check if the API call is legitimate
if($isAllowed) {
    // Check if the table to lookup for is given
    if(isset($json["table"]) && isset($json["id"])) {
        // Create new instance of class Database to interact with the database
        $db = new Database();
        $data = $db->selectWhere($json["table"], ["user_id" => $json["id"]]);
        if($data) {
            $response["success"] = true;
            $response["CheckoutDataEmpty"] = false;
            $response["data"] = $data;
        } else {
            $response["success"] = true;
            $response["CheckoutDataEmpty"] = true;
        }
    } else {
        $response["error"] = "Veuillez indiquer toutes les données nécessaires pour faire cette recherche.";
    }
} else {
    $response["error"] = "La clé API n'est pas fournie ou est incorrecte.";
}

// Print the response in the json format
echo json_encode($response);