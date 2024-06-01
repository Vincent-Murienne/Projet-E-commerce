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

// Récupérez les données JSON envoyées par la méthode POST
$input = json_decode(file_get_contents('php://input'), true);

// Vérifiez si le token est fourni.
if (isset($input['token'])) {
    $token = $input['token'];
    $database = new Database();

    // Utilisez la méthode getToken pour vérifier le token dans la base de données.
    $tokenData = $database->getToken($token);

    if (!empty($tokenData)) {
        // Vérifiez si le token n'a pas expiré.
        $expiry = $tokenData[0]['expiry'];
        if ($expiry > time()) {
            echo json_encode(['success' => true, 'message' => 'Le token est valide.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Le token est expiré.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Token invalide.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Token non fourni.']);
}
?>