<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../../vendor/autoload.php';

// This class will be used to send emails to reset a new password or for the contact form
class MailSender {
    private $mail;

    public function __construct() {
        $this->mail = new PHPMailer(true);
        $this->setup();
    }

    private function setup() {
        $config = require '../../config/configSecure.php';
        $smtp = $config['smtp'];

        // Configure SMTP server
        $this->mail->isSMTP();
        $this->mail->Host = $smtp['host'];
        $this->mail->SMTPAuth = true;
        $this->mail->Username = $smtp['username'];
        $this->mail->Password = $smtp['password'];
        $this->mail->SMTPSecure = $smtp['secure'];
        $this->mail->Port = $smtp['port'];
    }

    public function sendResetLink($email, $resetLink) {
        try {
            $this->mail->setFrom('airneis.commerce@gmail.com', 'Mailer');
            $this->mail->addAddress($email); // Add a reciever
            $this->mail->isHTML(true); // Set email format to HTML
            $this->mail->Subject = 'Airneis Modification du Mot de Passe';
            $this->mail->Body = <<<EOT
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <title>Airneis Modification du Mot de Passe</title>
                <style>
                    body-mail {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        background-color: #f4f4f4;
                        padding: 20px;
                    }
                    .container-mail {
                        max-width: 600px;
                        margin: 0 auto;
                        background: #fff;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    .button-mail {
                        display: inline-block;
                        padding: 15px 30px;
                        margin: 20px 0;
                        background-color: #16253F;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 5px;
                        font-weight: bold;
                    }
                    .footer-mail {
                        text-align: center;
                        margin-top: 20px;
                        font-size: 0.9em;
                        color: #666;
                    }
                </style>
            </head>
            <body class="body-mail">
                <div class="container-mail">
                    <h2>Bonjour,</h2>
                    <p>Une demande de modification de mot de passe vient d'être effectuée sur votre compte.</p>
                    <p>Si vous en êtes à l'origine, veuillez cliquer sur le bouton ci-dessous pour modifier votre mot de passe :</p>
                    <a href="{$resetLink}" class="button-mail">Modifier votre mot de passe</a>
                    <p class="footer-mail">Cordialement,<br>L'équipe Airneis</p>
                </div>
            </body>
            </html>
            EOT;
            $this->mail->send();
                return ['success' => true, 'message' => 'An email has been sent to reset your password.'];
        } catch (Exception $e) {
            return ['success' => false, 'message' => "The message could not be sent. Mailer Error: " . $this->mail->ErrorInfo];
        }
    }
}
?>