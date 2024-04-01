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

    // This method takes the name of the table and the id of what you wants to get the informations of (assuming the field you want to search in is called id)
    public function find(string $table, int $id)
    {
        $query = $this->pdo->prepare("SELECT * FROM $table WHERE id = :id ");
        $query->execute(["id" => $id]);
        return $query->fetch(PDO::FETCH_ASSOC);
    }

    // This methods takes the name of the table and an array to insert into the database
    public function insert($table, $data) {
        $columns = implode(', ', array_keys($data));
        $placeholders = ':' . implode(', :', array_keys($data));
        $sql = "INSERT INTO $table ($columns) VALUES ($placeholders)";
        $query = $this->pdo->prepare($sql);
        $query->execute($data);
        return $query->rowCount();
    }

    // This methods takes the name of the table, an array and you can also give a field to sort on. It will return you the data to matches the condition given in the array.
    public function selectWhere($table, $data, $orderby = false, $orderbyField = null) {
        $sqlFields = [];
        foreach ($data as $key => $value) {
            $sqlFields[] = "$key = :$key";
        }
        $sql = "SELECT * FROM $table WHERE " . implode(" AND ", $sqlFields);
        if ($orderby && $orderbyField !== null) {
            $sql .= " ORDER BY $orderbyField";
        }
        $query = $this->pdo->prepare($sql);
        $query->execute($data);
        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    // This method takes the table an array of data and an integer where to update the data
    function update(string $table, array $data, int $id) {
        $sqlFields = [];
        foreach ($data as $key => $value){
            $sqlFields[] = "$key = :$key";
        }
        $query = $this->pdo->prepare("UPDATE $table SET " . implode(', ', $sqlFields) .
            " WHERE id = :id");
    
        return $query->execute(array_merge($data, ['id' => $id]));
    }

    // This method is specific, it retrieves the top categories/images/products from the database.
    public function getTop(string $table)
    {
        if($table == "categories") {
            $sql = "SELECT categories.id AS 'category_id', categories.name AS 'category_name', categories.order AS 'category_order', images.name AS 'image_name' FROM categories LEFT JOIN images ON categories.id = images.category_id WHERE categories.`order` IS NOT NULL ORDER BY categories.`order`";
        } else if($table == "products") {
            $sql = "SELECT products.id AS 'product_id', products.name AS 'product_name', products.order AS 'product_order', images.name AS 'image_name' FROM products LEFT JOIN images ON products.id = images.product_id WHERE products.`order` IS NOT NULL GROUP BY products.id ORDER BY products.`order`";
        } else if($table == "images") {
            $sql = "SELECT * FROM images WHERE `order` IS NOT NULL ORDER BY `order`";
        }
         else {
            $sql = "";
        }
        $query = $this->pdo->prepare($sql);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    // This method is specific, it deletes the order associated to the old element and assigns it to the new top categories/images/products in the database.
    function updateTop(string $table, int $order, int $id) {
        $query = $this->pdo->prepare("UPDATE $table SET `order` = NULL WHERE `order` = :order");

        $query->bindValue("order", $order, PDO::PARAM_INT);

        $query->execute();

        $query = $this->pdo->prepare("UPDATE $table SET `order` = :order WHERE id = :id");

        $query->bindValue("order", $order, PDO::PARAM_INT);
        $query->bindValue("id", $id, PDO::PARAM_INT);
    
        return $query->execute();
    }

    // This method is specific, it creates a new user if it doesn't already exists
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

    public function getProductsFromCategory($id)
    {
        $sql = "SELECT products.*, product_image.category_id AS product_image_category_id, product_image.name AS product_image_name, category_image.category_id AS category_image_category_id, category_image.name AS category_image_name FROM products INNER JOIN (SELECT product_id, MIN(id) AS min_image_id FROM images GROUP BY product_id) AS first_image ON products.id = first_image.product_id INNER JOIN images AS product_image ON first_image.min_image_id = product_image.id LEFT JOIN images AS category_image ON products.category_id = category_image.category_id AND category_image.category_id = :id WHERE products.category_id = :id ORDER BY products.quantity DESC";

        $query = $this->pdo->prepare($sql);
        $query->bindValue("id", $id, PDO::PARAM_INT);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    } 
    
    public function getAllCategoriesWithImage()
    {
        $sql = "SELECT categories.id AS 'category_id', categories.name AS 'category_name', categories.order AS 'category_order', images.name AS 'image_name' FROM categories LEFT JOIN images ON categories.id = images.category_id";
        $query = $this->pdo->prepare($sql);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    } 

    // This method will return you the id of the last inserted things into the database. Useful to get the id of the last new user (to add it to the session to prevent the user to have to re login after signing in)
    public function getLastIdInserted()
    {
        return $this->pdo->query("SELECT LAST_INSERT_ID()")->fetch(PDO::FETCH_ASSOC);
    }

    // This method is generic, it receives the table and the id and will then delete this id from the table
    public function delete(string $table, string $id):bool 
    {
        $sql = "DELETE FROM $table WHERE id = :id";
        $query = $this->pdo->prepare($sql);
        $query->bindValue("id", $id, PDO::PARAM_INT);
        
        return $query->execute();
    }
}