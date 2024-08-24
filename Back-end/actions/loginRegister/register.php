<?php

require_once "../../config/security.php";
require_once "../../config/db.php";
require_once "../../config/crypto.php";

// Set default success response to false in case of unlegitimate API call
$response["success"] = false;

// Check if the API call is legitimate
if ($isAllowed) {
    // Check if the input variables are set
    if (isset($json["full_name"]) && isset($json["email"]) && isset($json["password"])) {
        // Check if all informations aren't empty
        if (!empty($json["full_name"]) && !empty($json["email"]) && !empty($json["password"])) {
            $db = new Database();
            $crypto = new Crypto();

            // Crypt personnal information before sending it into the database
            $fullName = $crypto->cryptData($json["full_name"]);
            $email = $crypto->cryptData($json["email"]);
            $password = $json["password"];

            $hashedPassword = hash("sha512", $password); // Hash the password

            // Check if an account with this email already exists
            $existingUser = $db->selectWhere("users", ["email" => $email], false, null);

            if (!$existingUser) {
                $insertedUser = $db->insert("users", ["full_name" => $fullName, "email" => $email, "password" => $hashedPassword, "role" => 0]);

                if ($insertedUser) {
                    // Retrieve the id of the user we just created to get back all informations and send them back to front-end
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

// Print the response in the JSON format
echo json_encode($response);
?>
