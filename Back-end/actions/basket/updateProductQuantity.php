<?php
require_once "../../config/security.php";
require_once "../../config/db.php";

$response["success"] = false;

if($isAllowed) {
    if(isset($json["user_id"]) && isset($json["product_id"]) && isset($json["quantity"])) {
        $db = new Database();
        $data = $db->updateProductQuantity($json["user_id"], $json["product_id"], $json["quantity"]);
        if($data) {
            $response["success"] = true;
            $response["data"] = $data;
        }
    } else {
        $response["error"] = "Une erreur est survenue lors de la mise à jour de la quantité.";
    }
} else {
    $response["error"] = "La clé API n'est pas fournie ou est incorrecte.";
}

echo json_encode($response);
?>