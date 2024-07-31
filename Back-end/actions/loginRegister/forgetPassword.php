<?php
require_once "../../config/security.php";
require_once "../../config/db.php";
require_once "../../actions/loginRegister/mailSender.php";
require_once "../../config/crypto.php";

// We need to put each of these headers to allow api calls from our react project
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// If the REQUEST_METHOD isn't POST, we quit
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

// We retrieve POST datas
$input = json_decode(file_get_contents('php://input'), true);

// Check if the input variables are set
if (isset($input['email'])) {
    $crypto = new Crypto();

    $email = $crypto->cryptData($input['email']); // Crypt personnal information before sending it into the database
    $database = new Database();

    // Check if user already exists
    $user = $database->selectWhere('users', ['email' => $email]);
    if (!empty($user)) {
        // Generate a token with an hour of lifetime
        $token = bin2hex(random_bytes(50));
        $expiry = time() + 3600;

        // Save it in the database
        $database->insert('password_reset', [
            'email' => $email,
            'token' => $token,
            'expiry' => $expiry
        ]);

        // Prepare link to reset a new password
        $resetLink = "http://localhost:5173/resetpassword/$token";

        // Send the email to reset a new password
        $mailSender = new MailSender();
        $result = $mailSender->sendResetLink($crypto->decryptData($email), $resetLink);

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