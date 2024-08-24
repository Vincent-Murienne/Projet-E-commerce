<?php
require_once "../../config/security.php";
require_once "../../config/db.php";
require_once "../../config/crypto.php";

// Set default success response to false in case of an illegitimate API call
$response = ["success" => false];

// Check if the API call is legitimate
if ($isAllowed) {
    // Check if the input variables are set
    if (isset($json["order_id"])) {
        $db = new Database();
        $orderDetail = $db->getOrderDetail($json["order_id"]);

        if ($orderDetail) {
            // The orderDetail array contains crypted information so we have to decrypt them before sending them back to the front-end
            $crypto = new Crypto();

            $resultData = [];
            $index = 0;

            foreach($orderDetail as $order) {
                foreach($order as $key => $value) {
                    if(in_array($key, ["address_name"])) {
                        $decrypted_value = $crypto->decryptData($value);
                        $resultData[$index][$key] = $decrypted_value;
                    } else {
                        $resultData[$index][$key] = $value;
                    }
                }
                $index++;
            }

            $response["success"] = true;
            $response["data"] = $resultData;
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