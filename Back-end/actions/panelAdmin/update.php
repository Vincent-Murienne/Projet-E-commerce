<?php
require_once "../../config/security.php";
require_once "../../config/db.php";

// Set default success response to false in case of unlegitimate API call
$response["success"] = false;

// Check if the API call is legitimate
if($isAllowed) {
    // Check if the input variables are set
    if(isset($json["table"]) && isset($json["id"]) && isset($json["data"])) {
        $db = new Database();

        // This will prevent to have multiple images linked to one category (because a category only has 1 image)
        if($json["table"] == "images") {
            if(isset($json["data"]["category_id"]) && isset($json["data"]["category_id"]) != null) {
                $data = $db->selectWhere($json["table"], ["category_id" => $json["data"]["category_id"]]);
                if($data) {
                    $eraseOldCategoryId = $db->update($json["table"], ["category_id" => null], $data[0]["id"]);
                }
            }
        }

        $data = $db->update($json["table"], $json["data"], $json["id"]);
        if($data) {
            $response["success"] = true;
        }
    } else {
        $response["error"] = "Veuillez indiquer toutes les données nécessaires à ce traitement.";
    }
} else {
    $response["error"] = "La clé API n'est pas fournie ou est incorrecte.";
}

// Print the response in the json format
echo json_encode($response);