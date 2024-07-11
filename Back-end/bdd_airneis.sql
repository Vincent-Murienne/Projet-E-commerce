CREATE DATABASE airneis_e_commerce;
USE airneis_e_commerce;

CREATE TABLE `users` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `full_name` varchar(100),
  `email` varchar(50),
  `password` char(128),
  `role` boolean
);

CREATE TABLE `payments` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `user_id` integer,
  `card_name` varchar(50),
  `card_owner` varchar(50),
  `card_number` varchar(16),
 `expiration_date` varchar(7) NOT NULL,
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
  `phone_number` varchar(10)
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
  `date` timestamp NOT NULL default CURRENT_TIMESTAMP,
  `user_id` integer,
  `address_id` integer,
  `payment_id` integer,
  `order_state` VARCHAR(10)
);

CREATE TABLE `lots_of_product` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `order_id` integer,
  `product_id` integer,
  `quantity` integer
);

CREATE TABLE `password_reset` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `token` varchar(100) NOT NULL,
  `expiry` integer NOT NULL
);

ALTER TABLE `payments` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `addresses` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `products` ADD FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

ALTER TABLE `images` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
ALTER TABLE `images` ADD FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

ALTER TABLE `products_materials` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

ALTER TABLE `products_materials` ADD FOREIGN KEY (`materials_list_id`) REFERENCES `materials_list` (`id`);

ALTER TABLE `baskets` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

ALTER TABLE `orders` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
ALTER TABLE `orders` ADD FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`);
ALTER TABLE `orders` ADD FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`);

ALTER TABLE `lots_of_product` ADD FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);
ALTER TABLE `lots_of_product` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

INSERT INTO users (full_name, email, password, role) VALUES
('ADMIN', 'admin@admin.com', '395bdb57512f444f07f23923cb637b5bba7c38ea967a458a0553199e8615f1a747a468de07a213c259ac42c390e8c12a48d35cec2d255d89a1d8f6f149b5d976', 1),
('Neriman', 'neri@gmail.com', '53db0fc135fbce6f381cf5acd2c0e1010d7597e32b7f5c91e371f6985945d7f1bad9e7d6468f885d8849450ebb603540cb59080ff376d7030e707c6ee67b3b32', 1);


INSERT INTO categories (name, `order`) VALUES
('Chaises', 1),
('Tables', 2),
('Canapés', 3),
('Armoires', null),
('Meubles de jardin', null),
('Tables de chevet', null),
('Accessoires de bureau', null); 

INSERT INTO products (category_id, name, price, quantity, description, `order`) VALUES
(1, 'Chaise design en bois clair', 69.99, 20, 'Chaise ergonomique en bois clair avec un design contemporain', 1),
(1, 'Chaise pivotante rembourrée', 110, 15, 'Chaise pivotante rembourrée pour un confort maximal pendant de longues heures', null),
(1, 'Chaise moderne en métal', 89.99, 25, 'Chaise moderne en métal avec un siège confortable pour votre salle à manger', null),
(1, 'Chaise de bar contemporaine', 79.99, 15, 'Chaise de bar contemporaine avec assise rembourrée', null),
(2, 'Table à manger en chêne massif', 995.99, 10, 'Table à manger spacieuse en chêne massif pour les réunions de famille', null),
(2, 'Table basse scandinave', 100, 25, 'Table basse scandinave avec un design épuré et des pieds coniques', 2),
(2, 'Table de cuisine extensible', 349.99, 15, 'Table de cuisine extensible pour les petits et grands repas', null),
(3, 'Canapé 3 places en cuir italien', 1499.99, 8, 'Canapé 3 places en cuir italien de qualité supérieure pour un salon élégant', null),
(3, 'Canapé-lit avec rangement', 799.99, 10, 'Canapé-lit avec rangement pour un gain despace dans votre salon', null),
(4, 'Armoire à deux portes coulissantes', 599.99, 12, 'Armoire moderne à deux portes coulissantes pour un rangement organisé', null),
(4, 'Armoire de rangement en bois de cerisier', 899.99, 10, 'Armoire de rangement en bois de cerisier pour une chambre chaleureuse', null),
(4, 'Armoire dressing avec miroir', 1199.99, 8, 'Armoire dressing avec miroir pour un dressing fonctionnel et élégant', null),
(5, 'Ensemble de salon de jardin en rotin', 850, 15, 'Ensemble de salon de jardin en rotin pour profiter du plein air avec style', 3),
(5, 'Chaise longue de jardin pliante', 145, 20, 'Chaise longue de jardin pliante pour se détendre au soleil', null),
(5, 'Table de jardin avec parasol', 399.99, 10, "Table de jardin avec parasol pour des repas en plein air à l'ombre", null),
(6, 'Table de chevet en bois avec tiroir', 79.99, 30, 'Table de chevet en bois avec tiroir pour garder vos essentiels à portée de main', null),
(6, 'Table de chevet suspendue moderne', 99.99, 25, 'Table de chevet suspendue moderne pour un look épuré dans la chambre', null),
(6, 'Table de chevet design en verre', 129.99, 20, 'Table de chevet design en verre pour une touche contemporaine dans la chambre', null),
(6, 'Table de chevet en métal noir', 79.99, 15, 'Table de chevet en métal noir pour une touche industrielle', null),
(7, 'Organiseur de bureau en bois', 49.99, 20, 'Organiseur de bureau en bois pour garder votre espace de travail propre et organisé', null),
(7, 'Lampe de bureau articulée en métal', 39.99, 25, 'Lampe de bureau articulée en métal pour un éclairage ajustable pendant le travail', null),
(7, 'Poubelle de bureau en acier inoxydable', 29.99, 15, 'Poubelle de bureau en acier inoxydable pour un bureau élégant et propre', null);

INSERT INTO images (product_id, category_id, name, `order`) VALUES
(1, null, 'a1_1_chaise_design_blanc_et_bois_clair.jpg', null),
(1, null, 'a1_2_chaise_design_blanc_et_bois_clair.jpg', null),
(1, null, 'a1_3_chaise_design_blanc_et_bois_clair.jpg', 1),
(2, 1, 'a2_1_chaise_pivotante.jpg', null),
(2, null, 'a2_2_chaise_pivotante.jpg', null),
(2, null, 'a2_3_chaise_pivotante.jpg', null),
(3, null, 'a3_1_chaise_en_metal.jpg', null),
(3, null, 'a3_2_chaise_en_metal.jpg', null),
(3, null, 'a3_3_chaise_en_metal.jpg', null),
(4, null, 'a4_1_chaise_de_bar.jpg', null),
(4, null, 'a4_2_chaise_de_bar.jpg', null),
(4, null, 'a4_3_chaise_de_bar.jpg', null),
(5, 2, 'b1_1_table_en_chene.jpg', 2),
(5, null, 'b1_2_table_en_chene.jpg', null),
(5, null, 'b1_3_table_en_chene.jpg', null),
(6, null, 'b2_1_table_basse.jpg', null),
(6, null, 'b2_2_table_basse.jpg', null),
(6, null, 'b2_3_table_basse.jpg', null),
(7, null, 'b3_1_table_de_cuisine_extensible.jpg', null),
(7, null, 'b3_2_table_de_cuisine_extensible.jpg', null),
(7, null, 'b3_3_table_de_cuisine_extensible.jpg', null),
(8, 3, 'c1_1_canape_3_places_en_cuir_italien.jpg', 3),
(8, null, 'c1_2_canape_3_places_en_cuir_italien.jpg', null),
(8, null, 'c1_3_canape_3_places_en_cuir_italien.jpg', null),
(9, null, 'c2_1_canape_lit_avec_rangement.jpg', null),
(9, null, 'c2_2_canape_lit_avec_rangement.jpg', null),
(9, null, 'c2_3_canape_lit_avec_rangement.jpg', null),
(10, 4, 'd1_1_armoire_coulissant.jpg', null),
(10, null, 'd1_2_armoire_coulissant.jpg', null),
(10, null, 'd1_3_armoire_coulissant.jpg', null),
(11, null, 'd2_1_armoire_de_rangement_en_bois_de_cerisier.jpg', null),
(11, null, 'd2_2_armoire_de_rangement_en_bois_de_cerisier.jpg', null),
(11, null, 'd2_3_armoire_de_rangement_en_bois_de_cerisier.jpg', null),
(12, null, 'd3_1_armoire_dressing_avec_miroir.jpg', null),
(12, null, 'd3_2_armoire_dressing_avec_miroir.jpg', null),
(12, null, 'd3_3_armoire_dressing_avec_miroir.jpg', null),
(13, null, 'e1_1_ensemble_de_salon_de_jardin.jpg', null),
(13, null, 'e1_2_ensemble_de_salon_de_jardin.jpg', null),
(13, null, 'e1_3_ensemble_de_salon_de_jardin.jpg', null),
(14, null, 'e2_1_chaise_longue_de_jardin_pliante.jpg', null),
(14, null, 'e2_2_chaise_longue_de_jardin_pliante.jpg', null),
(14, null, 'e2_3_chaise_longue_de_jardin_pliante.jpg', null),
(15, 5, 'e3_1_table_de_jardin_avec_parasol.jpg', null),
(15, null, 'e3_2_table_de_jardin_avec_parasol.jpg', null),
(15, null, 'e3_3_table_de_jardin_avec_parasol.jpg', null),
(16, null, 'f1_1_table_chevet_avec_tiroir.jpg', null),
(16, null, 'f1_2_table_chevet_avec_tiroir.jpg', null),
(16, null, 'f1_3_table_chevet_avec_tiroir.jpg', null),
(17, 6, 'f2_1_table_de_chevet_suspendue.jpg', null),
(17, null, 'f2_2_table_de_chevet_suspendue.jpg', null),
(17, null, 'f2_3_table_de_chevet_suspendue.jpg', null),
(18, null, 'f3_1_table_de_chevet_design_en_verre.jpg', null),
(18, null, 'f3_2_table_de_chevet_design_en_verre.jpg', null),
(18, null, 'f3_3_table_de_chevet_design_en_verre.jpg', null),
(19, null, 'f4_1_table_de_chevet_en_metal_noir.jpg', null),
(19, null, 'f4_2_table_de_chevet_en_metal_noir.jpg', null),
(19, null, 'f4_3_table_de_chevet_en_metal_noir.jpg', null),
(20, 7, 'g1_1_organiseur_de_bureau_en_bois.jpg', null),
(20, null, 'g1_2_organiseur_de_bureau_en_bois.jpg', null),
(20, null, 'g1_3_organiseur_de_bureau_en_bois.jpg', null),
(21, null, 'g2_1_lampe_de_bureau.jpg', null),
(21, null, 'g2_2_lampe_de_bureau.jpg', null),
(21, null, 'g2_3_lampe_de_bureau.jpg', null),
(22, null, 'g3_1_poubelle_de_bureau_en_acier_inoxydable.jpg', null),
(22, null, 'g3_2_poubelle_de_bureau_en_acier_inoxydable.jpg', null),
(22, null, 'g3_3_poubelle_de_bureau_en_acier_inoxydable.jpg', null);

INSERT INTO orders (date, user_id, order_state) VALUES
(STR_TO_DATE("11/05/2024", "%d/%m/%Y"), 1, "EN COURS"),
(STR_TO_DATE("10/05/2024", "%d/%m/%Y"), 1, "EN COURS"),
(STR_TO_DATE("05/05/2024", "%d/%m/%Y"), 1, "LIVRÉE"),
(STR_TO_DATE("05/05/2024", "%d/%m/%Y"), 1, "LIVRÉE"),
(STR_TO_DATE("05/05/2024", "%d/%m/%Y"), 1, "LIVRÉE"),
(STR_TO_DATE("28/04/2024", "%d/%m/%Y"), 1, "LIVRÉE"),
(STR_TO_DATE("28/04/2024", "%d/%m/%Y"), 1, "LIVRÉE");

INSERT INTO lots_of_product (order_id, product_id, quantity) VALUES
(1, 1, 2),
(1, 5, 1),
(1, 7, 1),
(2, 6, 5),
(2, 12, 2),
(3, 11, 1),
(3, 1, 5),
(3, 2, 5),
(4, 3, 2),
(4, 15, 7),
(5, 19, 2),
(5, 20, 10),
(6, 12, 1),
(7, 22, 3),
(7, 17, 1),
(7, 10, 1),
(7, 10, 1),
(7, 11, 1);

INSERT INTO `addresses` (`user_id`, `address_name`, `first_name`, `last_name`, `address`, `city`, `zip_code`, `region`, `country`, `phone_number`) VALUES
(2, 'Maison de neri', 'neri', 'her', '123 Rue de la Liberté', 'Paris', 75001, 'Île-de-France', 'France', 0723456789),
(2, 'Maison de neri 2', 'neri', 'her', '456 Business Boulevard', 'Paris', 75002, 'Île-de-France', 'France', 0723456789);

INSERT INTO `materials_list` (`id`, `name`) VALUES
(1, 'Bois'),
(2, 'Fer'),
(3, 'Cuivre'),
(4, 'Bronze'),
(5, 'Papier'),
(6, 'Coton');

INSERT INTO `products_materials` (`product_id`, `materials_list_id`) VALUES
(7, 1),
(1, 5),
(2, 1),
(2, 6),
(3, 2),
(4, 2);