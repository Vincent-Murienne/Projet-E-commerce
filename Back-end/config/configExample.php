<?php
// Rename this file to configSecure.php and fill in your SMTP server details

return [
    'smtp' => [
        'host' => 'smtp.example.com', // Your SMTP server 
        'username' => 'your_email@example.com',
        'password' => 'your_password',
        'secure' => 'tls', // or ssl
        'port' => 587 // 465 for SSL or 587 for TLS
    ],
];
?>