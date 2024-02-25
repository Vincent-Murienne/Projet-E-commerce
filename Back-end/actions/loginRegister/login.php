<?php

require_once "../../config/security.php";
require_once "../../config/db.php";

// Set default success response to false in case of unlegitimate API call
$response["success"] = false;

// Récupérer la clé API depuis les données POST
$apiKey = $_POST['apiKey'];

// Ajoutons un log pour vérifier la clé API
error_log("API Key received: " . $apiKey);

// Check if the API call is legitimate
if ($isAllowed) {
    // Check if email and password are provided
    if (isset($json["email"]) && isset($json["password"])) {
        // Create new instance of class Database to interact with the database
        $db = new Database();

        $email = $json["email"];
        $password = $json["password"];
        $user = $db->findWhere("users", ["email" => $email, "password" => $password]);

        if ($user) {
            $response["success"] = true;
            $response["user"] = $user;
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
