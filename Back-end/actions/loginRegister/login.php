<?php
require_once "../../config/security.php";
require_once "../../config/db.php";
require_once "../../config/crypto.php";

// Set default success response to false in case of unlegitimate API call
$response["success"] = false;

// Check if the API call is legitimate
if ($isAllowed) {
    // Check if the input variables are set
    if (isset($json["email"]) && isset($json["password"])) {
        $db = new Database();
        $crypto = new Crypto();

        $email = $crypto->cryptData($json["email"]); // Crypt personnal information before sending it into the database
        $password = hash("sha512", $json["password"]);

        // Check if user exist
        $user = $db->selectWhere("users", ["email" => $email], false, null);

        if ($user) {
            // Check if passwords matches
            if ($password == $user[0]["password"]) {
                $response["success"] = true;
                $response["user"] = ["id" => $user[0]["id"], "role" => $user[0]["role"]];
            } else {
                $response["error"] = "Nom d'utilisateur/email ou mot de passe incorrect.";
            }
        } else {
            $response["error"] = "Nom d'utilisateur/email ou mot de passe incorrect.";
        }
    } else {
        $response["error"] = "Veuillez fournir un nom d'utilisateur/email et un mot de passe pour vous connecter.";
    }
} else {
    $response["error"] = "La clé API n'est pas fournie ou est incorrecte.";
}

// Print the response in the JSON format
echo json_encode($response);
?>
