<?php

require_once "../../config/security.php";
require_once "../../config/db.php";

$response["success"] = false;

if ($isAllowed) {
    // Vérification si tous les champs requis sont présents
    if (isset($json["full_name"]) && isset($json["email"]) && isset($json["password"])) {
        // Vérification si tous les champs requis sont non vides
        if (!empty($json["full_name"]) && !empty($json["email"]) && !empty($json["password"])) {
            $db = new Database();

            $fullName = $json["full_name"];
            $email = $json["email"];
            $password = $json["password"];

            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            $existingUser = $db->selectWhere("users", ["email" => $email], false, null);

            if (!$existingUser) {
                $insertedUser = $db->insert("users", ["full_name" => $fullName, "email" => $email, "password" => $hashedPassword, "role" => 0]);

                if ($insertedUser) {
                    $lastInsertedId = $db->getLastIdInserted()["LAST_INSERT_ID()"];
                    $user = $db->find("users", $lastInsertedId);

                    if($user){
                        $response["success"] = true;
                        $response["user"] = $user;
                    } else {
                        $response["error"] = "Impossible de récupérer les informations de l'utilisateur.";
                    }
                } else {
                    $response["error"] = "Une erreur s'est produite lors de l'inscription.";
                }
            } else {
                $response["error"] = "L'utilisateur avec cette adresse e-mail existe déjà.";
            }
        } else {
            $response["error"] = "Champs manquants à remplir.";
        }
    } else {
        $response["error"] = "Veuillez fournir une adresse e-mail, un nom complet et un mot de passe pour vous inscrire.";
    }
} else {
    $response["error"] = "La clé API n'est pas fournie ou est incorrecte.";
}

echo json_encode($response);
?>
