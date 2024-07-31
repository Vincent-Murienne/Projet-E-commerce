<?php
require_once "../../config/security.php";
require_once "../../config/db.php";

// Set default success response to false in case of unlegitimate API call
$response["success"] = false;

// Check if the API call is legitimate
if($isAllowed) {
    // Check if the input variables are set
    if(isset($json["table"]) && isset($json["id"])) {
        $db = new Database();
        $data = $db->getProductDetail($json["id"]);
        if($data) {
            $response["success"] = true;
            $response["data"] = $data;
        } else {
            $response["error"] = "Aucun produit trouvé avec l'ID spécifié.";
        }
    } else {
        $response["error"] = "Veuillez indiquer la table et l'ID du produit dans les données envoyées.";
    }
} else {
    $response["error"] = "La clé API n'est pas fournie ou est incorrecte.";
}

// Print the response in the json format
echo json_encode($response);
?>
