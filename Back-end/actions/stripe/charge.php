<?php
require_once "../../config/security.php";
require_once "../../config/db.php";
require "../../vendor/autoload.php";

// Set default success response to false in case of unlegitimate API call
$response["success"] = false;

// Check if the API call is legitimate
if ($isAllowed) {
    if(isset($json["amount"]) && isset($json["id"])) {
        \Stripe\Stripe::setApiKey('sk_test_51PdxlIRplliLoCbZ2y5Ire3KzYYqALot3JT0sxbvsEGzCbv0DyGnJ0A5VGySHE9gJ8Hr2Knr3XgthBR0od4ccRAv003KjSHHRj');

        $amount = $json["amount"] * 100;

        try {
            $charge = \Stripe\Charge::create([
                "amount" => $amount,
                "currency" => "eur",
                "description" => "Airneis",
                "source" => $json["id"]
            ]);

            $response["success"] = true;

        } catch(\Stripe\Exception\CardException $e) {
            $response["error"] = $e->getMessage();
        } catch(\Exception $e) {
            $response["error"] = $e->getMessage();
        }
    }
}
else {
    $response["error"] = "La clé API n'est pas fournie ou est incorrecte.";
}

// Print the response in the JSON format
echo json_encode($response);
?>
