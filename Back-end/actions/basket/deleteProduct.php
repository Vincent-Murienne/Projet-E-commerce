<?php
require_once "../../config/security.php";
require_once "../../config/db.php";

// Set default success response to false in case of unlegitimate API call
$response["success"] = false;

// Check if the API call is legitimate
if($isAllowed) {
    // Check if the input variables are set
    if(isset($json["user_id"]) && isset($json["product_id"])) {
        $db = new Database();
        $data = $db->deleteProductBasket($json["user_id"], $json["product_id"]);

        if($data) {
            $response["success"] = true;
            $response["data"] = $data;
        }
    } else {
        $response["error"] = "Une erreur est survenue lors de la suppression de ce produit.";
    }
} else {
    $response["error"] = "La clé API n'est pas fournie ou est incorrecte.";
}

// Print the response in the JSON format
echo json_encode($response);
?>

