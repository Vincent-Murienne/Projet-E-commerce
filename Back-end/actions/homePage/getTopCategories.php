<?php
require_once "../../config/security.php";
require_once "../../config/db.php";

$response["success"] = false;

if($isAllowed) {
    $response["success"] = true;
}

echo json_encode($response);