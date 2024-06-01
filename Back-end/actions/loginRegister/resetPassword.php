<?php
require_once "../../config/security.php";
require_once "../../config/db.php";

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method not allowed
    echo json_encode(['message' => 'Méthode non autorisée']);
    exit;
}

$inputJSON = file_get_contents('php://input');
error_log("Input JSON: " . $inputJSON); // Log for debugging
$input = json_decode($inputJSON, TRUE);

if (isset($input['token'], $input['password'])) {
    $token = $input['token'];
    $newPassword = $input['password'];
    $database = new Database();

    // Verify the token
    $resetRecord = $database->selectWhere('password_reset', ['token' => $token]);
    if (!empty($resetRecord) && time() < $resetRecord[0]['expiry']) {
        $email = $resetRecord[0]['email'];
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

        // Fetch the user ID based on the email
        $userRecord = $database->selectWhere('users', ['email' => $email]);
        if (!empty($userRecord)) {
            $userId = $userRecord[0]['id']; // Assuming 'id' is the column name for the user ID

            // Update the user's password
            $updateSuccess = $database->update('users', ['password' => $hashedPassword], $userId);

            if ($updateSuccess) {
                // Optionally, delete the token record if it's a one-time use
                $database->delete('password_reset', $token);
                echo json_encode(['success' => true, 'message' => 'Password has been reset.']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to update password.']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'User not found.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid or expired token.']);
    }
} else {
    error_log("Token or password not provided. Input array: " . print_r($input, true));
    echo json_encode(['success' => false, 'message' => 'Token or password not provided.']);
}
?>