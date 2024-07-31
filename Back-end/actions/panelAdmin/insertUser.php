<?php

require_once "../../config/security.php";
require_once "../../config/db.php";
require_once "../../config/crypto.php";

$response["success"] = false;

if ($isAllowed) {
    // Check if all needed informations are set
    if (isset($json["data"]["full_name"]) && isset($json["data"]["email"]) && isset($json["data"]["password"]) && isset($json["data"]["role"])) {
        // Check if all informations aren't empty
        if (!empty($json["data"]["full_name"]) && !empty($json["data"]["email"]) && !empty($json["data"]["password"])) {
            $db = new Database();
            $crypto = new Crypto();

            $fullName = $crypto->cryptData($json["data"]["full_name"]);
            $email = $crypto->cryptData($json["data"]["email"]);
            $password = $json["data"]["password"];
            $role = $json["data"]["role"];

            $hashedPassword = hash("sha512", $password);

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

echo json_encode($response);
?>
