<?php

require_once "../../config/security.php";
require_once "../../config/db.php";

// Set default success response to false in case of unlegitimate API call
$response["success"] = false;

if ($isAllowed) {
    if (isset($json["email"]) && isset($json["password"])) {
        $db = new Database();

        $email = $json["email"];
        $password = hash("sha512", $json["password"]);

        // Récupérer l'utilisateur avec l'email fourni
        $user = $db->selectWhere("users", ["email" => $email], false, null);

        if ($user) {
            // Vérifier si le mot de passe haché correspond
            if ($password == $user[0]["password"]) {
                // Mot de passe correct, connexion réussie
                $response["success"] = true;
                $response["user"] = $user;
            } else {
                // Mot de passe incorrect
                $response["error"] = "Nom d'utilisateur/email ou mot de passe incorrect.";
            }
        } else {
            // Utilisateur non trouvé
            $response["error"] = "Nom d'utilisateur/email ou mot de passe incorrect.";
        }
    } else {
        // Email ou mot de passe manquant
        $response["error"] = "Veuillez fournir un nom d'utilisateur/email et un mot de passe pour vous connecter.";
    }
} else {
    // Clé API invalide
    $response["error"] = "La clé API n'est pas fournie ou est incorrecte.";
}

echo json_encode($response);
