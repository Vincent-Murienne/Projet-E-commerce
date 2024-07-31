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
    
        $sql = "SELECT categories.name AS category_name, products.*, product_image.category_id AS product_image_category_id, product_image.name AS product_image_name, category_image.category_id AS category_image_category_id, category_image.name AS category_image_name FROM products INNER JOIN (SELECT product_id, MIN(id) AS min_image_id FROM images GROUP BY product_id) AS first_image ON products.id = first_image.product_id INNER JOIN images AS product_image ON first_image.min_image_id = product_image.id LEFT JOIN images AS category_image ON products.category_id = category_image.category_id AND category_image.category_id = :id LEFT JOIN categories ON products.category_id = categories.id WHERE products.category_id = :id ORDER BY products.quantity DESC";
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

    // This method is generic, it receives the table and the id and will then delete this id from the table
    public function delete(string $table, string $id):bool 
    {
        $sql = "DELETE FROM $table WHERE id = :id";
        $query = $this->pdo->prepare($sql);
        $query->bindValue("id", $id, PDO::PARAM_INT);
        
        return $query->execute();
    }

    // This method is specific, it receives the id of a user and will then delete this id from the table users and also deletes every data linked to that user in the other tables
    public function deleteUser(string $id):bool 
    {
        $sql = "UPDATE orders SET address_id = null, user_id = null WHERE user_id = :id";       
        $query = $this->pdo->prepare($sql);
        $query->bindValue("id", $id, PDO::PARAM_INT);
        $query->execute();
        
        $sql1 = "DELETE FROM addresses WHERE user_id = :id";
        $query1 = $this->pdo->prepare($sql1);
        $query1->bindValue("id", $id, PDO::PARAM_INT);
        $query1->execute();

        $sql2 = "DELETE FROM baskets WHERE user_id = :id";
        $query2 = $this->pdo->prepare($sql2);
        $query2->bindValue("id", $id, PDO::PARAM_INT);
        $query2->execute();

        $sql4 = "DELETE FROM users WHERE id = :id";
        $query4 = $this->pdo->prepare($sql4);
        $query4->bindValue("id", $id, PDO::PARAM_INT);
        
        return $query4->execute();
    }

    public function deleteAddress(string $id):bool 
    {
        $sql = "UPDATE orders SET address_id = null WHERE address_id = :id";
        $query = $this->pdo->prepare($sql);
        $query->bindValue("id", $id, PDO::PARAM_INT);
        $query->execute();
        
        $sql1 = "DELETE FROM addresses WHERE id = :id";
        $query1 = $this->pdo->prepare($sql1);
        $query1->bindValue("id", $id, PDO::PARAM_INT); 
        
        return $query1->execute();
    }

    public function deleteBasket(int $user_id):bool 
    {
        $sql = "DELETE FROM baskets WHERE user_id = :user_id";
        $query = $this->pdo->prepare($sql);
        $query->bindValue("user_id", $user_id, PDO::PARAM_INT); 
        
        return $query->execute();
    }

    // This method will return you the id of the last inserted things into the database. Useful to get the id of the last new user (to add it to the session to prevent the user to have to re login after signing in)
    public function getLastIdInserted()
    {
        return $this->pdo->query("SELECT LAST_INSERT_ID()")->fetch(PDO::FETCH_ASSOC);
    }

    public function getProductDetail($id)
    {
        $sql = "SELECT categories.name AS category_name, products.*, images.id AS image_id, images.name AS image_name, materials_list.name AS material FROM products INNER JOIN images ON products.id = images.product_id LEFT JOIN categories ON products.category_id = categories.id LEFT JOIN products_materials ON products.id = products_materials.product_id LEFT JOIN materials_list ON products_materials.materials_list_id = materials_list.id WHERE products.id = :id ORDER BY products.quantity DESC LIMIT 3;";
        $query = $this->pdo->prepare($sql);
        $query->bindValue("id", $id, PDO::PARAM_INT);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);       
    }

    public function getProductSimilaire($id)
    {
        $sql = "SELECT categories.name AS category_name, products.*, product_image.category_id AS product_image_category_id, product_image.name AS product_image_name, category_image.category_id AS category_image_category_id, category_image.name AS category_image_name FROM products INNER JOIN (SELECT product_id, MIN(id) AS min_image_id FROM images GROUP BY product_id) AS first_image ON products.id = first_image.product_id INNER JOIN images AS product_image ON first_image.min_image_id = product_image.id LEFT JOIN images AS category_image ON products.category_id = category_image.category_id AND category_image.category_id = :id LEFT JOIN categories ON products.category_id = categories.id WHERE products.category_id = :id ORDER BY products.quantity DESC";
        $query = $this->pdo->prepare($sql);
        $query->bindValue("id", $id, PDO::PARAM_INT);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getChart1Data($date_start, $date_end)
    {
        $sql = "SELECT date, ROUND(SUM(lots_of_product.quantity*products.price), 2) AS 'total_price' FROM `orders` JOIN lots_of_product ON `orders`.id = lots_of_product.order_id JOIN products ON lots_of_product.product_id = products.id WHERE date BETWEEN STR_TO_DATE(:date_start, '%e/%c/%Y %H:%i:%s') AND STR_TO_DATE(:date_end, '%e/%c/%Y %H:%i:%s') GROUP BY CAST(orders.date as DATE)";
        $query = $this->pdo->prepare($sql);
        $query->bindValue("date_start", $date_start, PDO::PARAM_STR);
        $query->bindValue("date_end", $date_end, PDO::PARAM_STR);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getChart2Data($date_start, $date_end)
    {
        $sql = "SELECT date, categories.name, ROUND(SUM(lots_of_product.quantity*products.price), 2) AS 'total_price' FROM `orders` JOIN lots_of_product ON `orders`.id = lots_of_product.order_id JOIN products ON lots_of_product.product_id = products.id JOIN categories ON products.category_id = categories.id WHERE date BETWEEN STR_TO_DATE(:date_start, '%e/%c/%Y %H:%i:%s') AND STR_TO_DATE(:date_end, '%e/%c/%Y %H:%i:%s') GROUP BY date, categories.name";
        $query = $this->pdo->prepare($sql);
        $query->bindValue("date_start", $date_start, PDO::PARAM_STR);
        $query->bindValue("date_end", $date_end, PDO::PARAM_STR);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getChart3Data($date_start, $date_end)
    {
        $sql = "SELECT categories.name, SUM(lots_of_product.quantity) AS 'value' FROM `orders` JOIN lots_of_product ON `orders`.id = lots_of_product.order_id JOIN products ON lots_of_product.product_id = products.id JOIN categories ON products.category_id = categories.id WHERE date BETWEEN STR_TO_DATE(:date_start, '%e/%c/%Y %H:%i:%s') AND STR_TO_DATE(:date_end, '%e/%c/%Y %H:%i:%s') GROUP BY categories.name";
        $query = $this->pdo->prepare($sql);
        $query->bindValue("date_start", $date_start, PDO::PARAM_STR);
        $query->bindValue("date_end", $date_end, PDO::PARAM_STR);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function searchProductNameWithFilter($recherche, $prix_min, $prix_max, $materiaux, $categories, $en_stock, $orderBy) 
    {   
        // Construction de la requête SQL de base
        $sql = "SELECT products.id AS 'produits_id', products.name AS 'produits_nom', products.description, products.price, images.name AS 'image_name'
                FROM products
                LEFT JOIN images ON products.id = images.product_id
                LEFT JOIN categories ON products.category_id = categories.id
                LEFT JOIN products_materials ON products.id = products_materials.product_id
                LEFT JOIN materials_list ON products_materials.materials_list_id = materials_list.id
                WHERE 1=1";

        // Ajout des filtres dynamiques
        if (!is_null($recherche)) {
            $sql .= " AND (products.name LIKE CONCAT('%', :recherche, '%') OR products.description LIKE CONCAT('%', :recherche, '%'))";
        }
        if (!is_null($prix_min)) {
            $sql .= " AND products.price >= :prix_min";
        }
        if (!is_null($prix_max)) {
            $sql .= " AND products.price <= :prix_max";
        }
        if (!empty($materiaux)) {
            $count = 0;
            $totalMateriaux = count($materiaux);
            $placeholders = '';

            foreach ($materiaux as $materiel) {
                $placeholders .= ":mat" . $count;
                $count++;
                if ($count < $totalMateriaux) {
                    $placeholders .= ", ";
                }
            }
            $sql .= " AND materials_list.id IN ($placeholders)";
        }
        if (!empty($categories)) {
            $count = 0;
            $totalCategories = count($categories);
            $placeholders = '';

            foreach ($categories as $category) {
                $placeholders .= ":cat" . $count;
                $count++;
                if ($count < $totalCategories) {
                    $placeholders .= ", ";
                }
            }

            $sql .= " AND categories.id IN ($placeholders)";
        }
        if ($en_stock) {
            $sql .= " AND products.quantity > 0";
        }

        // Add GROUP BY clause to keep each products only once
        $sql .= " GROUP BY products.id";

        if (!is_null($orderBy)) {
            switch($orderBy) {
                case "nomAsc":
                    $sql .= " ORDER BY products.name;";
                    break;
                case "nomDesc":
                    $sql .= " ORDER BY products.name DESC;";
                    break;
                case "prixAsc":
                    $sql .= " ORDER BY products.price;";
                    break;
                case "prixDesc":
                    $sql .= " ORDER BY products.price DESC;";
                    break;
                case "QuantiteAsc":
                    $sql .= " ORDER BY products.quantity;";
                    break;
                case "QuantiteDesc":
                    $sql .= " ORDER BY products.quantity DESC;";
                    break;
            }
        }

        $query = $this->pdo->prepare($sql);

        // Liaison des valeurs des paramètres
        if (!is_null($recherche)) {
            $query->bindValue("recherche", $recherche, PDO::PARAM_STR);
        }
        if (!is_null($prix_min)) {
            $query->bindValue("prix_min", $prix_min, PDO::PARAM_INT);
        }
        if (!is_null($prix_max)) {
            $query->bindValue("prix_max", $prix_max, PDO::PARAM_INT);
        }
        if (!empty($materiaux)) {
            $count = 0;
            foreach ($materiaux as $materiel) {
                $query->bindValue("mat" . $count, $materiel, PDO::PARAM_INT);
                $count++;
            }
        }
        if (!empty($categories)) {
            $count = 0;
            foreach ($categories as $category) {
                $query->bindValue("cat" . $count, $category, PDO::PARAM_INT);
                $count++;
            }
        }

        $query->execute();
        return $query->fetchAll(PDO::FETCH_ASSOC);
    }


    public function getProductBasket($user_id)
    {
        $sql = "SELECT p.id, p.name, SUM(b.quantity) AS quantity, p.price, p.description, p.quantity AS stock, 
        (SELECT i.name FROM images i WHERE i.product_id = p.id LIMIT 1) AS image_name
        FROM baskets b
        LEFT JOIN products p ON b.product_id = p.id
        WHERE b.user_id = :user_id
        GROUP BY p.id, p.name, p.price, p.description";

        $query = $this->pdo->prepare($sql);
        $query->bindValue('user_id', $user_id, PDO::PARAM_INT);
        $query->execute();
        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function deleteProductBasket($user_id, $product_id)
    {
        $sql = "DELETE FROM baskets WHERE user_id = :user_id AND product_id = :product_id";
        $query = $this->pdo->prepare($sql);
        $query->bindValue('user_id', $user_id, PDO::PARAM_INT);
        $query->bindValue('product_id', $product_id, PDO::PARAM_INT);
        return $query->execute();
    }

    public function updateProductQuantity($user_id, $product_id, $quantity)
    {
        $sql = "UPDATE baskets SET quantity = :quantity WHERE user_id = :user_id AND product_id = :product_id";
        $query = $this->pdo->prepare($sql);
        $query->bindValue('user_id', $user_id, PDO::PARAM_INT);
        $query->bindValue('product_id', $product_id, PDO::PARAM_INT);
        $query->bindValue('quantity', $quantity, PDO::PARAM_INT);
        return $query->execute();
    }
    function updateOrder(string $table, array $data, int $id) {
        if (array_key_exists('adresse_id', $data)) {
            $data['adresse_id'] = null;
        }
        
        $sqlFields = [];
        foreach ($data as $key => $value){
            $sqlFields[] = "$key = :$key";
        }
        $query = $this->pdo->prepare("UPDATE $table SET " . implode(', ', $sqlFields) .
            " WHERE id = :id");
    
        return $query->execute(array_merge($data, ['id' => $id]));
    }

    function getAllOrdersByUser($userId) {
        $sql = "SELECT o.id AS order_id, o.date AS order_date, o.order_state AS order_status, SUM(lop.quantity) AS total_items, SUM(p.price * lop.quantity) AS total_price
        FROM orders o
        JOIN lots_of_product lop ON o.id = lop.order_id
        JOIN products p ON lop.product_id = p.id
        WHERE o.user_id = :userId
        GROUP BY o.id, o.date, o.order_state
        ORDER BY o.date DESC";
        $query = $this->pdo->prepare($sql);
        $query->bindValue(":userId", $userId, PDO::PARAM_INT);
        $query->execute();
        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    function getOrderDetail($order_id) {
        $sql = "SELECT orders.date, orders.order_state, lots_of_product.product_id AS 'product_id', lots_of_product.quantity AS 'quantity', products.name AS 'product_name', products.price AS 'product_price', products.description AS 'product_description', images.name AS 'image_name', addresses.address_name FROM lots_of_product
                LEFT JOIN products ON lots_of_product.product_id = products.id
                LEFT JOIN images ON lots_of_product.product_id = images.product_id
                LEFT JOIN orders ON lots_of_product.order_id = orders.id
                LEFT JOIN addresses ON orders.address_id = addresses.id
                WHERE lots_of_product.order_id = :order_id
                GROUP BY lots_of_product.product_id;";

        $query = $this->pdo->prepare($sql);
        $query->bindValue("order_id", $order_id, PDO::PARAM_INT);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function insertLotsOfProduct($data) {
        $sql = "INSERT INTO lots_of_product (order_id, product_id, quantity) VALUES (:order_id, :product_id, :quantity)";
        $query = $this->pdo->prepare($sql);
        $query->bindValue("order_id", $data["order_id"], PDO::PARAM_INT);
        $query->bindValue("product_id", $data["product_id"], PDO::PARAM_INT);
        $query->bindValue("quantity", $data["quantity"], PDO::PARAM_INT);
        $query->execute();
        return $query->rowCount();
    }

    public function downloadPersonalData($id) {
        $sql = "SELECT users.full_name, users.email, addresses.address_name, addresses.first_name, addresses.last_name, addresses.address, addresses.city, addresses.zip_code, addresses.region, addresses.country, addresses.phone_number FROM users
                JOIN addresses ON users.id = addresses.user_id
                WHERE users.id = :id;";

        $query = $this->pdo->prepare($sql);
        $query->bindValue("id", $id, PDO::PARAM_INT);
        $query->execute();

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }
}