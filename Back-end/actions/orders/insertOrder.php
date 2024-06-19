<?php
require_once "../../config/security.php";
require_once "../../config/db.php";

// Set default success response to false in case of unlegitimate API call
$response["success"] = false;
$orderFailed = false;

// Check if the API call is legitimate
if($isAllowed) {
    // Check if the table to lookup for is given
    if(isset($json["table"]) && isset($json["data"])) {
        // Create new instance of class Database to interact with the database
        $db = new Database();

        //Check si la quantité de chaque produits est présente dans la base de donnée
        $data = $db->selectWhere("baskets",["user_id" => $json["data"]["user_id"]]);
        foreach($data as $element){
            $getProductDetails = $db->selectWhere("products", ["id" => $element["product_id"]]);

            if($getProductDetails){
                if(!($getProductDetails[0]["quantity"] >= $element["quantity"])){
                    $response["error"] = "Le stock du produit '" . $getProductDetails[0]["name"] . "' n'est pas suffisant pour votre commande.";
                    $orderFailed = True;
                    break;
                }
            }
        }

        if(!$orderFailed){
            $createOrder = $db->insert($json["table"], $json["data"]);
            if($createOrder) {
                $orderId = $db->getLastIdInserted();
                if($data){
                    foreach($data as $element){
                        $getProductDetails = $db->selectWhere("products", ["id" => $element["product_id"]]);

                        if($getProductDetails){
                            $tab = [
                                "order_id" => $orderId["LAST_INSERT_ID()"],
                                "product_id" => $element["product_id"],
                                "quantity" => $element["quantity"]
                            ];
        
                            $insertProduct = $db->insertLotsOfProduct($tab);
    
                            //update la quantité dans la table products
                            $new_quantity = (int)$getProductDetails[0]["quantity"]-(int)$element["quantity"];
                            $updateQuantity = $db->update("products", ["quantity" => $new_quantity], $element["product_id"]);
                        }
                    }
    
                    //Supprimer le panier de l'utilisateur
                    $orderId = $db->deleteBasket($json["data"]["user_id"]);
                    $response["success"] = true;
                }
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