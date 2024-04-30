<?php
require_once "../../config/security.php";
require_once "../../config/db.php";

// Set default success response to false in case of an illegitimate API call
$response["success"] = false;

// Check if the API call is legitimate
if($isAllowed) {
    // Check if the user ID is provided in the JSON data
    if(isset($json["user_id"]))  {
        // Create a new instance of the Database class to interact with the database
        $db = new Database();
        
        // Call the getUser function to retrieve user information
        $userData = $db->getUser($json["user_id"]);
        
        // Check if user data is retrieved successfully
        if($userData) {
            $response["success"] = true;
            $response["data"] = $userData;
        } else {
            $response["error"] = "Impossible de récupérer les informations de l'utilisateur.";
        }
    } else {
        $response["error"] = "L'identifiant de l'utilisateur n'est pas fourni.";
    }
} else {
    $response["error"] = "Accès non autorisé.";
}

// Print the response in the JSON format
echo json_encode($response);
?>
