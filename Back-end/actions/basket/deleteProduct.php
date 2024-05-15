<?php
require_once "../../config/security.php";
require_once "../../config/db.php";

// Set default success response to false in case of unlegitimate API call
$response["success"] = false;

// Check if the API call is legitimate
if($isAllowed) {
    // Check if the table to lookup for is given
    if(isset($json["userId"]) && isset($json["productId"])) {
        // Create new instance of class Database to interact with the database
        $db = new Database();
        $data = $db->deleteProductBasket($json["userId"], $json["productId"]);
        if($data) {
            $response["success"] = true;
            $response["data"] = $data;
        }
    } else {
        $response["error"] = "Une erreur est survenue lors de la suppression du produit.";
    }
} else {
    $response["error"] = "La clé API n'est pas fournie ou est incorrecte.";
}

echo json_encode($response);
?>

