<?php
// We need to put each of these headers to allow api calls from our react project
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Send a success error without doing anything if the REQUEST_METHOD isn't POST
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../../vendor/autoload.php';

$config = require '../../config/configSecure.php';

$mail = new PHPMailer(true);

try {
    // Initialize variables with data
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'];
    $subject = $data['subject'];
    $message = $data['message'];

    // Configure SMTP server
    $mail->isSMTP();
    $mail->Host = $config['smtp']['host'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['smtp']['username'];
    $mail->Password = $config['smtp']['password'];
    $mail->SMTPSecure = $config['smtp']['secure'];
    $mail->Port = $config['smtp']['port'];

    $mail->setFrom($config['smtp']['username'], 'Airneis Commerce'); // Use your email as sender
    $mail->addAddress('airneis.commerce@gmail.com', 'Airneis Commerce'); // Add a receiver
    $mail->addReplyTo($email);

    $mail->isHTML(true); // Set content as HTML
    $mail->Subject = $subject;
    $mail->Body = $message;

    $mail->send();
    echo 'Le message a bien été envoyé';
} catch (Exception $e) {
    http_response_code(500); // Send HTTP code 500 to signal an error
    echo "Le message n'a pas pu être envoyé. Erreur du maileur: {$mail->ErrorInfo}";
}
