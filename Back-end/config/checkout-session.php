<?php
require 'vendor/autoload.php';

\Stripe\Stripe::setApiKey('sk_test_51PNVhmP9bcXFAffetHMDd6KuTLvE84TgtFsx2EuAR5NJX7tRg0gKWdY4g8PCo7XCwFsLefjYv8RG7zxmsocFHYkp00g96pDN3y');

header('Content-Type: application/json');

$YOUR_DOMAIN = 'http://localhost:3000';

$checkout_session = \Stripe\Checkout\Session::create([
    'payment_method_types' => ['card'],
    'line_items' => [[
    'price_data' => [
        'currency' => 'usd',
        'product_data' => [
        'name' => 'T-shirt',
    ],
    'unit_amount' => 2000,
    ],
    'quantity' => 1,
]],
'mode' => 'payment',
'success_url' => $YOUR_DOMAIN . '/success',
'cancel_url' => $YOUR_DOMAIN . '/cancel',
]);

echo json_encode(['id' => $checkout_session->id]);
?>
