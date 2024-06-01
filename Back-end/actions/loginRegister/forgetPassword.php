<?php
require_once "../../config/security.php";
require_once "../../config/db.php";
require_once "../../actions/loginRegister/mailSender.php";

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

// Récupérez les données JSON envoyées par la méthode POST
$input = json_decode(file_get_contents('php://input'), true);

// Vérifiez si l'e-mail est fourni.
if (isset($input['email'])) {
    $email = $input['email'];
    $database = new Database();

    // Vérifiez si l'utilisateur existe.
    $user = $database->selectWhere('users', ['email' => $email]);
    if (!empty($user)) {
        // Générez un token unique.
        $token = bin2hex(random_bytes(50));
        $expiry = time() + 3600; // Le token expire après 1 heure.

        // Enregistrez le token dans la base de données.
        $database->insert('password_reset', [
            'email' => $email,
            'token' => $token,
            'expiry' => $expiry
        ]);

        // Préparez le lien de réinitialisation du mot de passe.
        $resetLink = "http://localhost:5173/resetpassword/$token";

        // Envoyez l'e-mail.
        $mailSender = new MailSender();
        $result = $mailSender->sendResetLink($email, $resetLink);

        if ($result['success']) {
            echo json_encode(['success' => true, 'message' => 'Un e-mail de réinitialisation a été envoyé.']);
        } else {
            echo json_encode(['success' => false, 'message' => $result['message']]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Aucun utilisateur trouvé avec cet e-mail.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'E-mail non fourni.']);
}
?>