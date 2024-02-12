CREATE DATABASE arneis_e_commerce;
USE arneis_e_commerce;

CREATE TABLE `users` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `full_name` varchar(100),
  `email` varchar(50),
  `password` char,
  `role` varchar(5)
);

CREATE TABLE `payments` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `user_id` integer,
  `card_name` varchar(50),
  `card_owner` varchar(50),
  `card_number` varchar(16),
  `expiration_date` timestamp,
  `cvv` integer
);

CREATE TABLE `addresses` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `user_id` integer,
  `address_name` varchar(50),
  `first_name` varchar(50),
  `last_name` varchar(50),
  `address` varchar(100),
  `city` varchar(50),
  `zip_code` integer,
  `region` varchar(50),
  `country` varchar(30),
  `phone_number` integer
);

CREATE TABLE `categories` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(50),
  `order` integer DEFAULT NULL
);

CREATE TABLE `products` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `category_id` integer,
  `name` varchar(50),
  `price` float,
  `quantity` integer,
  `description` TEXT,
  `order` integer DEFAULT NULL
);

CREATE TABLE `images` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `product_id` integer,
  `category_id` integer,
  `name` varchar(255),
  `order` integer DEFAULT NULL
);

CREATE TABLE `materials_list` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(50)
);

CREATE TABLE `products_materials` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `product_id` integer,
  `materials_list_id` integer
);

CREATE TABLE `baskets` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `user_id` integer,
  `product_id` integer,
  `quantity` integer
);

CREATE TABLE `orders` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `date` timestamp
);

CREATE TABLE `lots_of_product` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `order_id` integer,
  `product_id` integer,
  `quantity` integer
);

ALTER TABLE `payments` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `addresses` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `products` ADD FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

ALTER TABLE `images` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
ALTER TABLE `images` ADD FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

ALTER TABLE `products_materials` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

ALTER TABLE `products_materials` ADD FOREIGN KEY (`materials_list_id`) REFERENCES `materials_list` (`id`);


ALTER TABLE `baskets` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

ALTER TABLE `lots_of_product` ADD FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);
ALTER TABLE `lots_of_product` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

INSERT INTO categories (name, order) VALUES
('Chaises', 1),
('Tables', 2),
('Canapés', 3),
('Armoires', NULL),
('Meubles de jardin', NULL),
('Tables de chevet', NULL),
('Accessoires de bureau', NULL); 

INSERT INTO products (category_id, name, price, quantity, description, order) VALUES
(1, 'Chaise design en bois clair', 69.99, 20, 'Chaise ergonomique en bois clair avec un design contemporain', 1),
(1, 'Chaise pivotante rembourrée', 110, 15, 'Chaise pivotante rembourrée pour un confort maximal pendant de longues heures', 2),
(2, 'Table à manger en chêne massif', 250, 10, 'Table à manger spacieuse en chêne massif pour les réunions de famille', 3),
(2, 'Table basse scandinave', 100, 25, 'Table basse scandinave avec un design épuré et des pieds coniques', NULL),
(3, 'Canapé 3 places en cuir italien', 1499.99, 8, 'Canapé 3 places en cuir italien de qualité supérieure pour un salon élégant', NULL),
(4, 'Armoire à deux portes coulissantes', 599.99, 12, 'Armoire moderne à deux portes coulissantes pour un rangement organisé', NULL),
(5, 'Ensemble de salon de jardin en rotin', 850, 15, 'Ensemble de salon de jardin en rotin pour profiter du plein air avec style', NULL),
(5, 'Chaise longue de jardin pliante', 145, 20, 'Chaise longue de jardin pliante pour se détendre au soleil', NULL),
(6, 'Table de chevet en bois avec tiroir', 79.99, 30, 'Table de chevet en bois avec tiroir pour garder vos essentiels à portée de main', NULL),
(6, 'Table de chevet suspendue moderne', 99.99, 25, 'Table de chevet suspendue moderne pour un look épuré dans la chambre', NULL),
(7, 'Organiseur de bureau en bois', 49.99, 20, 'Organiseur de bureau en bois pour garder votre espace de travail propre et organisé', NULL),
(7, 'Lampe de bureau articulée en métal', 39.99, 25, 'Lampe de bureau articulée en métal pour un éclairage ajustable pendant le travail', NULL);


INSERT INTO images (product_id, name, order) VALUES
(1, '1-chaise_bois_clair_1.jpg', NULL),
(2, '2-chaise_pivotante_1.jpg', 2),
(3, '3-table_manger_chene_1.jpg', 1),
(4, '4-table_basse_scandinave_1.jpg', NULL),
(5, '5-canape_cuir_italien_1.jpg', NULL),
(6, '6-armoire_deux_portes_1.jpg', NULL),
(7, '7-ensemble_salond_jardin_rotin_1.jpg', 3),
(8, '8-chaise_longue_jardin_pliante_1.jpg', NULL),
(9, '9-table_chevet_bois_1.jpg', NULL),
(10, '10-table_chevet_suspendue_1.jpg', NULL),
(11, '11-organiseur_bureau_bois_1.jpg', NULL),
(12, '12-lampe_bureau_metal_1.jpg', NULL);
