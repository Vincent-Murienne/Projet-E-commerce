<?php

require_once "../../config/security.php";
require_once "../../config/db.php";

$response["success"] = false;

$apiKey = $_POST['apiKey'];

error_log("API Key received: " . $apiKey);

if ($isAllowed) {
    if (isset($json["full_name"]) && isset($json["email"]) && isset($json["password"])) {
        $db = new Database();

        $fullName = $json["full_name"];
        $email = $json["email"];
        $password = $json["password"];

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $existingUser = $db->selectWhere("users", ["email" => $email], false, null);

        if (!$existingUser) {
            $insertedUser = $db->insert("users", ["full_name" => $fullName, "email" => $email, "password" => $hashedPassword, "role" => 0]);

            if ($insertedUser) {
                $response["success"] = true;
                $response["message"] = "Inscription réussie.";
            } else {
                $response["error"] = "Une erreur s'est produite lors de l'inscription.";
            }
        } else {
            $response["error"] = "L'utilisateur avec cette adresse e-mail existe déjà.";
        }
    } else {
        $response["error"] = "Veuillez fournir une adresse e-mail et un mot de passe pour vous inscrire.";
    }
} else {
    $response["error"] = "La clé API n'est pas fournie ou est incorrecte.";
}

echo json_encode($response);
?>
