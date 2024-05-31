<?php
require_once "../../config/security.php";
require_once "../../config/db.php";

$response["success"] = false;

if($isAllowed) {
    // Check if the table to lookup for is given
    if(isset($json["id"])) {
        $db = new Database();     
   
        $data = $db->deletePayment($json["id"]);
        if ($data) {
            $response["success"] = true;
        }
    } else {
        $response["error"] = "Veuillez indiquer toutes les données nécessaires à ce traitement.";
    }
} else {
    $response["error"] = "La clé API n'est pas fournie ou est incorrecte.";
}


// Imprimer la réponse au format JSON
echo json_encode($response);