<?php
require_once "../../config/security.php";
require_once "../../config/db.php";

// Set default success response to false in case of an illegitimate API call
$response = ["success" => false];

// Check if the API call is legitimate
if ($isAllowed) {
    // Check if the input variables are set
    if (isset($json["user_id"])) {
        $db = new Database();
        $orders = $db->getAllOrdersByUser($json["user_id"]);

        // Check if any results are found
        if ($orders) {
            $response["success"] = true;
            $response["data"] = $orders;
        } else {
            $response["error"] = "Aucune commande trouvée pour cet utilisateur.";
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