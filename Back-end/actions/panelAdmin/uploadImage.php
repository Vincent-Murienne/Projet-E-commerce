<?php
require_once "../../config/db.php";


// We need to put each of these headers to allow api calls from our react project
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Set default success response to false in case of unlegitimate API call
$response["success"] = false;

// Check if the table to lookup for is given
if(isset($_FILES["file"])) {

    $upload_directory = "../../../B3_Arneis/public/img/";
    $file_name = time() . "_" . $_FILES["file"]["name"];
    $upload_file = $upload_directory . $file_name;

    if(move_uploaded_file($_FILES["file"]["tmp_name"], $upload_file)) {
        $response["success"] = true;
        $response["imageName"] = $file_name;
    }
} else {
    $response["error"] = "Veuillez indiquer toutes les données nécessaires à ce traitement.";
}

// Print the response in the json format
echo json_encode($response);