<?php
require_once "../../config/db.php";
require_once "../../config/security.php";

// Créer une nouvelle instance de la classe Database
$db = new Database();

// Récupérer les commandes avec le statut "EN COURS" depuis plus de 10 minutes
$tenMinutesAgo = date('Y-m-d H:i:s', strtotime('-10 minutes'));
$ordersToUpdate = $db->selectWhere("orders", ["order_state" => "EN COURS", "date <" => $tenMinutesAgo]);

// Mettre à jour le statut de ces commandes à "EXPEDIÉE"
foreach ($ordersToUpdate as $order) {
    $db->update("orders", ["order_state" => "EXPEDIEE"], $order["id"]);
}

// Récupérer les commandes avec le statut "EXPEDIÉE" depuis plus de 5 minutes (15 minutes au total)
$fifteenMinutesAgo = date('Y-m-d H:i:s', strtotime('-15 minutes'));
$ordersToUpdate = $db->selectWhere("orders", ["order_state" => "EXPEDIÉE", "date <" => $fifteenMinutesAgo]);

// Mettre à jour le statut de ces commandes à "LIVRÉE"
foreach ($ordersToUpdate as $order) {
    $db->update("orders", ["order_state" => "LIVRÉE"], $order["id"]);
}
?>
