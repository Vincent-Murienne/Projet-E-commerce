<?php

header('Access-Control-Allow-Origin: http://localhost:5173'); // Autoriser les requêtes provenant de votre application React
header('Access-Control-Allow-Methods: POST'); // Autoriser uniquement les méthodes POST
header('Access-Control-Allow-Headers: Content-Type'); // Autoriser les en-têtes de type Content-Type

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // Aucune action n'est nécessaire, renvoyer simplement une réponse 200 OK
    http_response_code(200);
    exit;
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../../vendor/autoload.php';

$config = require '../../config/configSecure.php';


$mail = new PHPMailer(true);

try {
    // Récupération des données POST au format JSON
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'];
    $subject = $data['subject'];
    $message = $data['message'];

    // Configuration du serveur SMTP
    $mail->isSMTP();
    $mail->Host = $config['smtp']['host'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['smtp']['username'];
    $mail->Password = $config['smtp']['password'];
    $mail->SMTPSecure = $config['smtp']['secure'];
    $mail->Port = $config['smtp']['port'];

    // Destinataires
    $mail->setFrom($config['smtp']['username'], 'Airneis Commerce'); // Utilisez votre adresse e-mail comme expéditeur
    $mail->addAddress('airneis.commerce@gmail.com', 'Airneis Commerce'); // Ajouter un destinataire
    $mail->addReplyTo($email);

    // Contenu
    $mail->isHTML(true); // Définir le format de l'email en HTML
    $mail->Subject = $subject;
    $mail->Body    = $message;

    $mail->send();
    echo 'Le message a bien été envoyé';
} catch (Exception $e) {
    http_response_code(500); // Envoyer un code de réponse HTTP 500 pour indiquer une erreur serveur
    echo "Le message n'a pas pu être envoyé. Erreur du maileur: {$mail->ErrorInfo}";
}
