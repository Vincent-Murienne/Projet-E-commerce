<?php

require_once "../../config/envParser.php";

// This instance will allow us to get the variables from the .env file
(new DotEnv("../../config/.env"))->load();

// This class contains all the methods to retrieve data from the database
class Database {
    public $pdo;
    private $db_name, $db_host, $db_username, $db_password;

    // The constructor will create a link to the database and will set it to the attribute pdo
    public function __construct() {
        $this->db_name = getenv("DB_NAME");
        $this->db_host = getenv("DB_HOST");
        $this->db_username = getenv("DB_USERNAME");
        $this->db_password = getenv("DB_PASSWORD");
        $this->pdo = new PDO("mysql:dbname=".$this->db_name.";host=".$this->db_host,$this->db_username, $this->db_password);
    }

    // This methods takes the name of the table and will return you all the data from it
    public function findAll(string $table)
    {
        $query = $this->pdo->prepare("SELECT * FROM $table");
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    // This method takes the name of the table, the name of the field to search in and the value to research. This doesn't use a prepare execute methods because we aren't using forms input on this method so the data we give it are safe.
    public function findWhere(string $table, array $data, bool $orderby = false, string|null $orderbyField = null)
    {
        $sqlFields = [];

        foreach ($data as $key => $value) {
            $sqlFields[] = "$key = :$key";
        }

        if($orderby && $orderbyField !== null) {
            $sql = "SELECT * FROM $table WHERE " . implode(" AND ", $sqlFields) . " ORDER BY $orderbyField";
        } else {
            $sql = "INSERT INTO $table SET " . implode(" AND ", $sqlFields);
        }

        $query = $this->pdo->prepare($sql);
        $query->execute($data);
        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    // This method is specific, it retrieves the top categories from the database.
    public function getTop(string $table)
    {
        if($table == "categories") {
            $sql = "SELECT categories.id AS 'category_id', categories.name AS 'category_name', images.name AS 'image_name' FROM categories JOIN images ON categories.id = images.category_id WHERE categories.`order` IS NOT NULL ORDER BY categories.`order`";
        } else if($table == "products") {
            $sql = "SELECT products.id AS 'product_id', products.name AS 'product_name', images.name AS 'image_name' FROM products JOIN images ON products.id = images.product_id WHERE products.`order` IS NOT NULL GROUP BY products.id ORDER BY products.`order`";
        } else if($table == "images") {
            $sql = "SELECT * FROM images WHERE `order` IS NOT NULL ORDER BY `order`";
        } else {
            $sql = "";
        }
        $query = $this->pdo->prepare($sql);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function registerUser(string $fullName, string $email, string $password, int $role = 0)
    {
        $existingUserQuery = $this->pdo->prepare("SELECT * FROM users WHERE email = :email");
        $existingUserQuery->execute(['email' => $email]);
        $existingUser = $existingUserQuery->fetch(PDO::FETCH_ASSOC);

        if ($existingUser) {
            return false;
        }

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $insertQuery = $this->pdo->prepare("INSERT INTO users (full_name, email, password, role) VALUES (:full_name, :email, :password, :role)");
        $success = $insertQuery->execute(['full_name' => $fullName, 'email' => $email, 'password' => $hashedPassword, 'role' => $role]);

        return $success;
    }
}