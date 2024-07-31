<?php
require_once "../../config/security.php";
require_once "../../config/db.php";

// Set default success response to false in case of an illegitimate API call
$response = ["success" => false];

// Check if the API call is legitimate
if ($isAllowed) {
    if (isset($json["order_id"])) {
        // Create a new instance of the Database class to interact with the database
        $db = new Database();
        // Assuming you have a method getAllOrdersByUser in your Database class
        $orderDetail = $db->getOrderDetail($json["order_id"]);

        // Check if any results are found
        if ($orderDetail) {
            $response["success"] = true;
            $response["data"] = $orderDetail;
        } else {
            $response["error"] = "Cette commande est vide.";
        }
    } else {
        $response["error"] = "L'identifiant de l'utilisateur est requis.";
    }
} else {
    $response["error"] = "La clé API n'est pas fournie ou est incorrecte.";
}

// Print the response in JSON format
echo json_encode($response);
?>