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

INSERT INTO categories (name) VALUES
('Chaises'),
('Tables'),
('Canapés'),
('Armoires'),
('Meubles de jardin'),
('Tables de chevet'),
('Accessoires de bureau'); 

INSERT INTO products (category_id, name, price, quantity, description) VALUES
(1, 'Chaise design en bois clair', 69.99, 20, 'Chaise ergonomique en bois clair avec un design contemporain'),
(1, 'Chaise pivotante rembourrée', 110, 15, 'Chaise pivotante rembourrée pour un confort maximal pendant de longues heures'),
(1, 'Chaise moderne en métal', 89.99, 25, 'Chaise moderne en métal avec un siège confortable pour votre salle à manger'),
(1, 'Chaise de bar contemporaine', 79.99, 15, 'Chaise de bar contemporaine avec assise rembourrée'),
(2, 'Table à manger en chêne massif', 995.99, 10, 'Table à manger spacieuse en chêne massif pour les réunions de famille'),
(2, 'Table basse scandinave', 100, 25, 'Table basse scandinave avec un design épuré et des pieds coniques'),
(2, 'Table de cuisine extensible', 349.99, 15, 'Table de cuisine extensible pour les petits et grands repas'),
(3, 'Canapé 3 places en cuir italien', 1499.99, 8, 'Canapé 3 places en cuir italien de qualité supérieure pour un salon élégant'),
(3, 'Canapé-lit avec rangement', 799.99, 10, 'Canapé-lit avec rangement pour un gain despace dans votre salon'),
(4, 'Armoire à deux portes coulissantes', 599.99, 12, 'Armoire moderne à deux portes coulissantes pour un rangement organisé'),
(4, 'Armoire de rangement en bois de cerisier', 899.99, 10, 'Armoire de rangement en bois de cerisier pour une chambre chaleureuse'),
(4, 'Armoire dressing avec miroir', 1199.99, 8, 'Armoire dressing avec miroir pour un dressing fonctionnel et élégant'),
(5, 'Ensemble de salon de jardin en rotin', 850, 15, 'Ensemble de salon de jardin en rotin pour profiter du plein air avec style'),
(5, 'Chaise longue de jardin pliante', 145, 20, 'Chaise longue de jardin pliante pour se détendre au soleil'),
(5, 'Table de jardin avec parasol', 399.99, 10, 'Table de jardin avec parasol pour des repas en plein air à l\'ombre'),
(6, 'Table de chevet en bois avec tiroir', 79.99, 30, 'Table de chevet en bois avec tiroir pour garder vos essentiels à portée de main'),
(6, 'Table de chevet suspendue moderne', 99.99, 25, 'Table de chevet suspendue moderne pour un look épuré dans la chambre'),
(6, 'Table de chevet design en verre', 129.99, 20, 'Table de chevet design en verre pour une touche contemporaine dans la chambre'),
(6, 'Table de chevet en métal noir', 79.99, 15, 'Table de chevet en métal noir pour une touche industrielle'),
(7, 'Organiseur de bureau en bois', 49.99, 20, 'Organiseur de bureau en bois pour garder votre espace de travail propre et organisé'),
(7, 'Lampe de bureau articulée en métal', 39.99, 25, 'Lampe de bureau articulée en métal pour un éclairage ajustable pendant le travail'),
(7, 'Poubelle de bureau en acier inoxydable', 29.99, 15, 'Poubelle de bureau en acier inoxydable pour un bureau élégant et propre');

INSERT INTO images (product_id, name) VALUES
(1, '1-1-chaise-design-blanc-et-bois-clair-.jpg'),
(1, '1-2-chaise-design-blanc-et-bois-clair-.jpg'),
(1, '1-3-chaise-design-blanc-et-bois-clair-.jpg'),
(2, '2-1-chaise-pivotante.jpg'),
(2, '2-2-chaise-pivotante.jpg'),
(2, '2-3-chaise-pivotante.jpg'),
(3, '3-1-Chaise en métal.jpg'),
(3, '3-2-Chaise en métal.jpg'),
(3, '3-3-Chaise en métal.jpg'),
(4, '4-1-Chaise de bar.jpg'),
(4, '4-2-Chaise de bar.jpg'),
(4, '4-3-Chaise de bar.jpg'),
(5, '5-1-table-en-chaine.jpg'),
(5, '5-2-table-en-chaine.jpg'),
(5, '5-3-table-en-chaine.jpg'),
(6, '6-1-table-basse.jpg'),
(6, '6-2-table-basse.jpg'),
(6, '6-3-table-basse.jpg'),
(7, '7-1-Table de cuisine extensible.jpg'),
(7, '7-2-Table de cuisine extensible.jpg'),
(7, '7-3-Table de cuisine extensible.jpg'),
(8, '8-1-Canapé 3 places en cuir italien.jpg'),
(8, '8-2-Canapé 3 places en cuir italien.jpg'),
(8, '8-3-Canapé 3 places en cuir italien.jpg'),
(9, '9-1-Canapé-lit avec rangement.jpg'),
(9, '9-2-Canapé-lit avec rangement.jpg'),
(9, '9-3-Canapé-lit avec rangement.jpg'),
(10, '10-1-armoire-coulissant.jpg'),
(10, '10-2-armoire-coulissant.jpg'),
(10, '10-3-armoire-coulissant.jpg'),
(11, '11-1-Armoire de rangement en bois de cerisier.jpg'),
(11, '11-2-Armoire de rangement en bois de cerisier.jpg'),
(11, '11-3-Armoire de rangement en bois de cerisier.jpg'),
(12, '12-1-Armoire dressing avec miroir.jpg'),
(12, '12-2-Armoire dressing avec miroir.jpg'),
(12, '12-3-Armoire dressing avec miroir.jpg'),
(13, '13-1-Ensemble de salon de jardin.jpg'),
(13, '13-2-Ensemble de salon de jardin.jpg'),
(13, '13-3-Ensemble de salon de jardin.jpg'),
(14, '14-1-Chaise longue de jardin pliante.jpg'),
(14, '14-2-Chaise longue de jardin pliante.jpg'),
(14, '14-3-Chaise longue de jardin pliante.jpg'),
(15, '15-1-Table de jardin avec parasol.jpg'),
(15, '15-2-Table de jardin avec parasol.jpg'),
(15, '15-3-Table de jardin avec parasol.jpg'),
(16, '16-1-table-chevet-avec-tiroir.jpg'),
(16, '16-2-table-chevet-avec-tiroir.jpg'),
(16, '16-3-table-chevet-avec-tiroir.jpg'),
(17, '17-1-Table de chevet suspendue.jpg'),
(17, '17-2-Table de chevet suspendue.jpg'),
(17, '17-3-Table de chevet suspendue.jpg'),
(18, '18-1-Table de chevet design en verre.jpg'),
(18, '18-2-Table de chevet design en verre.jpg'),
(18, '18-3-Table de chevet design en verre.jpg'),
(19, '19-1-Table de chevet en métal noir.jpg'),
(19, '19-2-Table de chevet en métal noir.jpg'),
(19, '19-3-Table de chevet en métal noir.jpg'),
(20, '20-1-Organiseur de bureau en bois.jpg'),
(20, '20-2-Organiseur de bureau en bois.jpg'),
(20, '20-3-Organiseur de bureau en bois.jpg'),
(21, '21-1-lampe-de-bureau.jpg'),
(21, '21-2-lampe-de-bureau.jpg'),
(21, '21-3-lampe-de-bureau.jpg'),
(22, '22-1-Poubelle de bureau en acier inoxydable.jpg'),
(22, '22-2-Poubelle de bureau en acier inoxydable.jpg'),
(22, '22-3-Poubelle de bureau en acier inoxydable.jpg');
