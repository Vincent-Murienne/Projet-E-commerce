<?php
require_once "../../config/security.php";
require_once "../../config/db.php";

// We need to put each of these headers to allow api calls from our react project
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// If the REQUEST_METHOD is OPTIONS, we quit
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

// If the REQUEST_METHOD is POST, we send an error and we quit
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Méthode non autorisée']);
    exit;
}

// Retrieve the data
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE);

// Check if the input variables are set
if (isset($input['token'], $input['password'])) {
    $token = $input['token'];
    $newPassword = $input['password'];
    $database = new Database();

    // Verify the token
    $resetRecord = $database->selectWhere('password_reset', ['token' => $token]);
    if (!empty($resetRecord) && time() < $resetRecord[0]['expiry']) {
        $email = $resetRecord[0]['email'];
        $hashedPassword = hash("sha512", $newPassword); // Hash the new password

        // Fetch the user ID based on the email
        $userRecord = $database->selectWhere('users', ['email' => $email]);
        if (!empty($userRecord)) {
            $userId = $userRecord[0]['id']; // Assuming 'id' is the column name for the user ID

            // Update the user's password
            $updateSuccess = $database->update('users', ['password' => $hashedPassword], $userId);

            if ($updateSuccess) {
                // Delete the token record after use
                $database->delete('password_reset', $token);
                echo json_encode(['success' => true, 'message' => 'Le mot de passe a bien été changé.']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Une erreur est survenu lors de la modification du mot de passe.']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Utilisateur inconnu.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Token invalide ou expiré.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Token ou mot de passe manquant.']);
}
?>