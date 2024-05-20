<?php
require_once "../../config/security.php";
require_once "../../config/db.php";

// Set default success response to false in case of unlegitimate API call
$response["success"] = false;

// Check if the API call is legitimate
if ($isAllowed) {
    if (isset($json["user_id"])) {
        // Create new instance of class Database to interact with the database
        $db = new Database();

        $productBasket = $db->getProductBasket($json["user_id"]);

        // Check if any results are found
        if ($productBasket !== null) {
            $response["success"] = true;
            $response["data"] = $productBasket;
        } else {
            $response["error"] = "Le panier est vide.";
        }
    } else {
        $response["error"] = "Veuillez vous connecter pour accéder aux produits de votre panier.";
    }
} else {
    $response["error"] = "La clé API n'est pas fournie ou est incorrecte.";
}

// Print the response in the JSON format
echo json_encode($response);
?>