<?php

require_once "../../config/security.php";
require_once "../../config/db.php";
require_once "../../config/crypto.php";

// Set default success response to false in case of unlegitimate API call
$response["success"] = false;

// Check if the API call is legitimate
if ($isAllowed) {
    // Check if the input variables are set
    if (isset($json["data"]["full_name"]) && isset($json["data"]["email"]) && isset($json["data"]["password"]) && isset($json["data"]["role"])) {
        // Check if all informations aren't empty
        if (!empty($json["data"]["full_name"]) && !empty($json["data"]["email"]) && !empty($json["data"]["password"])) {
            $db = new Database();

            // The data array contains sensitive information so we have to encrypt them before sending them to the database
            $crypto = new Crypto();

            $fullName = $crypto->cryptData($json["data"]["full_name"]);
            $email = $crypto->cryptData($json["data"]["email"]);
            $password = $json["data"]["password"];
            $role = $json["data"]["role"];

            $hashedPassword = hash("sha512", $password); // Hash the password

            // Check if the email already exists in the database
            $existingUser = $db->selectWhere("users", ["email" => $email], false, null);

            if (!$existingUser) {
                $insertedUser = $db->insert("users", ["full_name" => $fullName, "email" => $email, "password" => $hashedPassword, "role" => $role]);

                if ($insertedUser) {
                    $response["success"] = true;
                } else {
                    $response["error"] = "Une erreur s'est produite lors de l'enregistrement de l'utilisateur en base de données.";
                }
            } else {
                $response["error"] = "Un utilisateur avec cette adresse e-mail existe déjà.";
            }
        } else {
            $response["error"] = "Champs manquants à remplir.";
        }
    } else {
        $response["error"] = "Veuillez fournir une adresse e-mail, un nom complet et un mot de passe.";
    }
} else {
    $response["error"] = "La clé API n'est pas fournie ou est incorrecte.";
}

// Print the response in the json format
echo json_encode($response);
?>
