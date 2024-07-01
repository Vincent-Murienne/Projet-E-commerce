<?php
require_once "../../config/security.php";
require_once "../../config/db.php";

// Set default success response to false in case of unlegitimate API call
$response["success"] = false;

// Check if the API call is legitimate
if ($isAllowed) {
    // Create new instance of class Database to interact with the database
    $db = new Database();

    // Perform search using the defined criteria
    $searchResults = $db->searchProductNameWithFilter(
        $_GET["prix_min"],
        $_GET["prix_max"],
        $_GET["materiaux"],
        $_GET["categories"],
        $_GET["en_stock"]
    );

    // Check if any results are found
    if ($searchResults !== null) {
        $response["success"] = true;
        $response["data"] = $searchResults;
    } else {
        $response["error"] = "Aucun produit correspondant trouvé.";
    }
}
else {
    $response["error"] = "La clé API n'est pas fournie ou est incorrecte.";
}

// Print the response in the JSON format
echo json_encode($response);
?>
