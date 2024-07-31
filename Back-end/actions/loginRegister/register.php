<?php

require_once "../../config/security.php";
require_once "../../config/db.php";
require_once "../../config/crypto.php";

$response["success"] = false;

if ($isAllowed) {
    // Check if all needed informations are set
    if (isset($json["full_name"]) && isset($json["email"]) && isset($json["password"])) {
        // Check if all informations aren't empty
        if (!empty($json["full_name"]) && !empty($json["email"]) && !empty($json["password"])) {
            $db = new Database();
            $crypto = new Crypto();

            $fullName = $crypto->cryptData($json["full_name"]);
            $email = $crypto->cryptData($json["email"]);
            $password = $json["password"];

            $hashedPassword = hash("sha512", $password);

            $existingUser = $db->selectWhere("users", ["email" => $email], false, null);

            if (!$existingUser) {
                $insertedUser = $db->insert("users", ["full_name" => $fullName, "email" => $email, "password" => $hashedPassword, "role" => 0]);

                if ($insertedUser) {
                    $lastInsertedId = $db->getLastIdInserted()["LAST_INSERT_ID()"];
                    $user = $db->find("users", $lastInsertedId);

                    if($user){
                        $response["success"] = true;
                        $response["user"] = ["id" => $user["id"], "role" => $user["role"]];
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
