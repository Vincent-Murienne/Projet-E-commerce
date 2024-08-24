<?php
require_once "../../config/security.php";
require_once "../../config/db.php";

// Set default success response to false in case of unlegitimate API call
$response["success"] = false;

// Check if the API call is legitimate
if ($isAllowed) {
    // Check if the input variables are set
    if (isset($json["user_id"])) {
        $db = new Database();
        $productBasket = $db->getProductBasket($json["user_id"]);

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