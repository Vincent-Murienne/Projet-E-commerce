<?php
require_once "../../config/security.php";
require_once "../../config/db.php";

// Set default success response to false in case of unlegitimate API call
$response["success"] = false;

// Check if the API call is legitimate
if($isAllowed) {
    // Check if the table to lookup for is given
    if(isset($json["user_id"]) && isset($json["product_id"]) && isset($json["quantity"])) {
        // Create new instance of class Database to interact with the database
        $db = new Database();
        $productExist = $db->selectWhere("baskets", ["user_id" => $json["user_id"], "product_id" => $json["product_id"]]);
        if($productExist){
            // Set the new quantity
            $newQuantity = (int)$productExist[0]["quantity"] + (int)$json["quantity"]; 

            // Get product info to see if the quantity isn't bigger than the stock
            $productInfo = $db->selectWhere("products", ["id" => $json["product_id"]]);
            if($productInfo){
                if($newQuantity <= (int)$productInfo[0]["quantity"]){
                    $data = $db->update("baskets", ["quantity" => $newQuantity], $productExist[0]["id"]);
                    if($data) {
                        $response["success"] = true;
                    } 
                } else {
                    $response["error"] = "Nous n'avons pas le stock suffisant pour ajouter ce nombre de produit à votre panier.";
                }
            } else {
                $response["error"] = "Erreur de traitement avec la base de donnée. Veuillez réessayer ultérieurement.";
            }
        }
        else{
            $data = $db->insert("baskets", ["user_id" => $json["user_id"], "product_id" => $json["product_id"], "quantity" => $json["quantity"]]);
            if($data) {
                $response["success"] = true;
            }          
        } 
    } else {
        $response["error"] = "Veuillez indiquer toutes les données nécessaires à ce traitement.";
    }
} else {
    $response["error"] = "La clé API n'est pas fournie ou est incorrecte.";
}

// Print the response in the json format
echo json_encode($response);