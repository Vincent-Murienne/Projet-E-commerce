<?php

require_once "../../config/envParser.php";


(new DotEnv("../../config/.env"))->load();

$db_name = getenv("DB_NAME");
$db_host = getenv("DB_HOST");
$db_username = getenv("DB_USERNAME");
$db_password = getenv("DB_PASSWORD");

$pdo = new PDO("mysql:dbname=".$db_name.";host=".$db_host,$db_username, $db_password);
