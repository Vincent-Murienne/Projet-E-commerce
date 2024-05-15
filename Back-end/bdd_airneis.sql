-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : mar. 14 mai 2024 à 10:48
-- Version du serveur : 8.2.0
-- Version de PHP : 8.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `airneis_e_commerce`
--

-- --------------------------------------------------------

--
-- Structure de la table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
CREATE TABLE IF NOT EXISTS `addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `address_name` varchar(50) DEFAULT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `zip_code` int DEFAULT NULL,
  `region` varchar(50) DEFAULT NULL,
  `country` varchar(30) DEFAULT NULL,
  `phone_number` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `addresses`
--

INSERT INTO `addresses` (`id`, `user_id`, `address_name`, `first_name`, `last_name`, `address`, `city`, `zip_code`, `region`, `country`, `phone_number`) VALUES
(1, 2, 'Maison de neri', 'neri', 'her', '123 Rue de la Liberté', 'Paris', 75001, 'Île-de-France', 'France', 723456789),
(2, 2, 'Maison de neri 2', 'neri', 'her', '456 Business Boulevard', 'Paris', 75002, 'Île-de-France', 'France', 723456789);

-- --------------------------------------------------------

--
-- Structure de la table `baskets`
--

DROP TABLE IF EXISTS `baskets`;
CREATE TABLE IF NOT EXISTS `baskets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `baskets`
--

INSERT INTO `baskets` (`id`, `user_id`, `product_id`, `quantity`) VALUES
(1, 3, 5, 1);

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `order` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `categories`
--

INSERT INTO `categories` (`id`, `name`, `order`) VALUES
(1, 'Chaises', 1),
(2, 'Tables', 2),
(3, 'Canapés', 3),
(4, 'Armoires', NULL),
(5, 'Meubles de jardin', NULL),
(6, 'Tables de chevet', NULL),
(7, 'Accessoires de bureau', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `images`
--

DROP TABLE IF EXISTS `images`;
CREATE TABLE IF NOT EXISTS `images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `order` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `category_id` (`category_id`)
) ENGINE=MyISAM AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `images`
--

INSERT INTO `images` (`id`, `product_id`, `category_id`, `name`, `order`) VALUES
(1, 1, NULL, '1-1-chaise-design-blanc-et-bois-clair-.jpg', NULL),
(2, 1, NULL, '1-2-chaise-design-blanc-et-bois-clair-.jpg', NULL),
(3, 1, NULL, '1-3-chaise-design-blanc-et-bois-clair-.jpg', 1),
(4, 2, 1, '2-1-chaise-pivotante.jpg', NULL),
(5, 2, NULL, '2-2-chaise-pivotante.jpg', NULL),
(6, 2, NULL, '2-3-chaise-pivotante.jpg', NULL),
(7, 3, NULL, '3-1-Chaise en metal.jpg', NULL),
(8, 3, NULL, '3-2-Chaise en metal.jpg', NULL),
(9, 3, NULL, '3-3-Chaise en metal.jpg', NULL),
(10, 4, NULL, '4-1-Chaise de bar.jpg', NULL),
(11, 4, NULL, '4-2-Chaise de bar.jpg', NULL),
(12, 4, NULL, '4-3-Chaise de bar.jpg', NULL),
(13, 5, 2, '5-1-table-en-chene.jpg', 2),
(14, 5, NULL, '5-2-table-en-chene.jpg', NULL),
(15, 5, NULL, '5-3-table-en-chene.jpg', NULL),
(16, 6, NULL, '6-1-table-basse.jpg', NULL),
(17, 6, NULL, '6-2-table-basse.jpg', NULL),
(18, 6, NULL, '6-3-table-basse.jpg', NULL),
(19, 7, NULL, '7-1-Table de cuisine extensible.jpg', NULL),
(20, 7, NULL, '7-2-Table de cuisine extensible.jpg', NULL),
(21, 7, NULL, '7-3-Table de cuisine extensible.jpg', NULL),
(22, 8, 3, '8-1-Canape 3 places en cuir italien.jpg', 3),
(23, 8, NULL, '8-2-Canape 3 places en cuir italien.jpg', NULL),
(24, 8, NULL, '8-3-Canape 3 places en cuir italien.jpg', NULL),
(25, 9, NULL, '9-1-Canape-lit avec rangement.jpg', NULL),
(26, 9, NULL, '9-2-Canape-lit avec rangement.jpg', NULL),
(27, 9, NULL, '9-3-Canape-lit avec rangement.jpg', NULL),
(28, 10, 4, '10-1-armoire-coulissant.jpg', NULL),
(29, 10, NULL, '10-2-armoire-coulissant.jpg', NULL),
(30, 10, NULL, '10-3-armoire-coulissant.jpg', NULL),
(31, 11, NULL, '11-1-Armoire de rangement en bois de cerisier.jpg', NULL),
(32, 11, NULL, '11-2-Armoire de rangement en bois de cerisier.jpg', NULL),
(33, 11, NULL, '11-3-Armoire de rangement en bois de cerisier.jpg', NULL),
(34, 12, NULL, '12-1-Armoire dressing avec miroir.jpg', NULL),
(35, 12, NULL, '12-2-Armoire dressing avec miroir.jpg', NULL),
(36, 12, NULL, '12-3-Armoire dressing avec miroir.jpg', NULL),
(37, 13, NULL, '13-1-Ensemble de salon de jardin.jpg', NULL),
(38, 13, NULL, '13-2-Ensemble de salon de jardin.jpg', NULL),
(39, 13, NULL, '13-3-Ensemble de salon de jardin.jpg', NULL),
(40, 14, NULL, '14-1-Chaise longue de jardin pliante.jpg', NULL),
(41, 14, NULL, '14-2-Chaise longue de jardin pliante.jpg', NULL),
(42, 14, NULL, '14-3-Chaise longue de jardin pliante.jpg', NULL),
(43, 15, 5, '15-1-Table de jardin avec parasol.jpg', NULL),
(44, 15, NULL, '15-2-Table de jardin avec parasol.jpg', NULL),
(45, 15, NULL, '15-3-Table de jardin avec parasol.jpg', NULL),
(46, 16, NULL, '16-1-table-chevet-avec-tiroir.jpg', NULL),
(47, 16, NULL, '16-2-table-chevet-avec-tiroir.jpg', NULL),
(48, 16, NULL, '16-3-table-chevet-avec-tiroir.jpg', NULL),
(49, 17, 6, '17-1-Table de chevet suspendue.jpg', NULL),
(50, 17, NULL, '17-2-Table de chevet suspendue.jpg', NULL),
(51, 17, NULL, '17-3-Table de chevet suspendue.jpg', NULL),
(52, 18, NULL, '18-1-Table de chevet design en verre.jpg', NULL),
(53, 18, NULL, '18-2-Table de chevet design en verre.jpg', NULL),
(54, 18, NULL, '18-3-Table de chevet design en verre.jpg', NULL),
(55, 19, NULL, '19-1-Table de chevet en metal noir.jpg', NULL),
(56, 19, NULL, '19-2-Table de chevet en metal noir.jpg', NULL),
(57, 19, NULL, '19-3-Table de chevet en metal noir.jpg', NULL),
(58, 20, 7, '20-1-Organiseur de bureau en bois.jpg', NULL),
(59, 20, NULL, '20-2-Organiseur de bureau en bois.jpg', NULL),
(60, 20, NULL, '20-3-Organiseur de bureau en bois.jpg', NULL),
(61, 21, NULL, '21-1-lampe-de-bureau.jpg', NULL),
(62, 21, NULL, '21-2-lampe-de-bureau.jpg', NULL),
(63, 21, NULL, '21-3-lampe-de-bureau.jpg', NULL),
(64, 22, NULL, '22-1-Poubelle de bureau en acier inoxydable.jpg', NULL),
(65, 22, NULL, '22-2-Poubelle de bureau en acier inoxydable.jpg', NULL),
(66, 22, NULL, '22-3-Poubelle de bureau en acier inoxydable.jpg', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `lots_of_product`
--

DROP TABLE IF EXISTS `lots_of_product`;
CREATE TABLE IF NOT EXISTS `lots_of_product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`)
) ENGINE=MyISAM AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `lots_of_product`
--

INSERT INTO `lots_of_product` (`id`, `order_id`, `product_id`, `quantity`) VALUES
(1, 1, 1, 2),
(2, 1, 5, 1),
(3, 1, 7, 1),
(4, 2, 6, 5),
(5, 2, 12, 2),
(6, 3, 11, 1),
(7, 3, 1, 5),
(8, 3, 2, 5),
(9, 4, 3, 2),
(10, 4, 15, 7),
(11, 5, 19, 2),
(12, 5, 20, 10),
(13, 6, 12, 1),
(14, 7, 22, 3),
(15, 7, 17, 1),
(16, 7, 10, 1),
(17, 7, 10, 1),
(18, 7, 11, 1);

-- --------------------------------------------------------

--
-- Structure de la table `materials_list`
--

DROP TABLE IF EXISTS `materials_list`;
CREATE TABLE IF NOT EXISTS `materials_list` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `materials_list`
--

INSERT INTO `materials_list` (`id`, `name`) VALUES
(1, 'Bois'),
(2, 'Verre'),
(3, 'Fer'),
(4, 'Cuivre'),
(5, 'Bronze'),
(6, 'Coton'),
(7, 'Papier'),
(8, 'Roche'),
(9, 'Céramique'),
(10, 'Fibre de carbone');

-- --------------------------------------------------------

--
-- Structure de la table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int DEFAULT NULL,
  `address_id` int DEFAULT NULL,
  `payment_id` int DEFAULT NULL,
  `order_state` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `address_id` (`address_id`),
  KEY `payment_id` (`payment_id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `orders`
--

INSERT INTO `orders` (`id`, `date`, `user_id`, `address_id`, `payment_id`, `order_state`) VALUES
(1, '2024-05-10 23:00:00', 1, NULL, NULL, 'En cours'),
(2, '2024-05-09 23:00:00', 1, NULL, NULL, 'En cours'),
(3, '2024-05-04 23:00:00', 1, NULL, NULL, 'Livré'),
(4, '2024-05-04 23:00:00', 1, NULL, NULL, 'Livré'),
(5, '2024-05-04 23:00:00', 1, NULL, NULL, 'Livré'),
(6, '2024-04-27 23:00:00', 1, NULL, NULL, 'Livré'),
(7, '2024-04-27 23:00:00', 1, NULL, NULL, 'Livré');

-- --------------------------------------------------------

--
-- Structure de la table `payments`
--

DROP TABLE IF EXISTS `payments`;
CREATE TABLE IF NOT EXISTS `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `card_name` varchar(50) DEFAULT NULL,
  `card_owner` varchar(50) DEFAULT NULL,
  `card_number` varchar(16) DEFAULT NULL,
  `expiration_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `cvv` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `payments`
--

INSERT INTO `payments` (`id`, `user_id`, `card_name`, `card_owner`, `card_number`, `expiration_date`, `cvv`) VALUES
(1, 2, 'Mastercard', 'Neriman Her', '1111111111111234', '2026-04-30 23:00:00', 123),
(2, 2, 'Visa', 'Neriman Her', '1111111111115364', '2025-08-31 23:00:00', 456);

-- --------------------------------------------------------

--
-- Structure de la table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `price` float DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `description` text,
  `order` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`)
) ENGINE=MyISAM AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `products`
--

INSERT INTO `products` (`id`, `category_id`, `name`, `price`, `quantity`, `description`, `order`) VALUES
(1, 1, 'Chaise design en bois clair', 69.99, 20, 'Chaise ergonomique en bois clair avec un design contemporain', 1),
(2, 1, 'Chaise pivotante rembourrée', 110, 15, 'Chaise pivotante rembourrée pour un confort maximal pendant de longues heures', NULL),
(3, 1, 'Chaise moderne en métal', 89.99, 25, 'Chaise moderne en métal avec un siège confortable pour votre salle à manger', NULL),
(4, 1, 'Chaise de bar contemporaine', 79.99, 15, 'Chaise de bar contemporaine avec assise rembourrée', NULL),
(5, 2, 'Table à manger en chêne massif', 995.99, 10, 'Table à manger spacieuse en chêne massif pour les réunions de famille', NULL),
(6, 2, 'Table basse scandinave', 100, 25, 'Table basse scandinave avec un design épuré et des pieds coniques', 2),
(7, 2, 'Table de cuisine extensible', 349.99, 15, 'Table de cuisine extensible pour les petits et grands repas', NULL),
(8, 3, 'Canapé 3 places en cuir italien', 1499.99, 8, 'Canapé 3 places en cuir italien de qualité supérieure pour un salon élégant', NULL),
(9, 3, 'Canapé-lit avec rangement', 799.99, 10, 'Canapé-lit avec rangement pour un gain despace dans votre salon', NULL),
(10, 4, 'Armoire à deux portes coulissantes', 599.99, 12, 'Armoire moderne à deux portes coulissantes pour un rangement organisé', NULL),
(11, 4, 'Armoire de rangement en bois de cerisier', 899.99, 10, 'Armoire de rangement en bois de cerisier pour une chambre chaleureuse', NULL),
(12, 4, 'Armoire dressing avec miroir', 1199.99, 8, 'Armoire dressing avec miroir pour un dressing fonctionnel et élégant', NULL),
(13, 5, 'Ensemble de salon de jardin en rotin', 850, 15, 'Ensemble de salon de jardin en rotin pour profiter du plein air avec style', 3),
(14, 5, 'Chaise longue de jardin pliante', 145, 20, 'Chaise longue de jardin pliante pour se détendre au soleil', NULL),
(15, 5, 'Table de jardin avec parasol', 399.99, 10, 'Table de jardin avec parasol pour des repas en plein air à l\'ombre', NULL),
(16, 6, 'Table de chevet en bois avec tiroir', 79.99, 30, 'Table de chevet en bois avec tiroir pour garder vos essentiels à portée de main', NULL),
(17, 6, 'Table de chevet suspendue moderne', 99.99, 25, 'Table de chevet suspendue moderne pour un look épuré dans la chambre', NULL),
(18, 6, 'Table de chevet design en verre', 129.99, 20, 'Table de chevet design en verre pour une touche contemporaine dans la chambre', NULL),
(19, 6, 'Table de chevet en métal noir', 79.99, 15, 'Table de chevet en métal noir pour une touche industrielle', NULL),
(20, 7, 'Organiseur de bureau en bois', 49.99, 20, 'Organiseur de bureau en bois pour garder votre espace de travail propre et organisé', NULL),
(21, 7, 'Lampe de bureau articulée en métal', 39.99, 25, 'Lampe de bureau articulée en métal pour un éclairage ajustable pendant le travail', NULL),
(22, 7, 'Poubelle de bureau en acier inoxydable', 29.99, 15, 'Poubelle de bureau en acier inoxydable pour un bureau élégant et propre', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `products_materials`
--

DROP TABLE IF EXISTS `products_materials`;
CREATE TABLE IF NOT EXISTS `products_materials` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int DEFAULT NULL,
  `materials_list_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `materials_list_id` (`materials_list_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `products_materials`
--

INSERT INTO `products_materials` (`id`, `product_id`, `materials_list_id`) VALUES
(1, 1, 1);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `password` char(128) DEFAULT NULL,
  `role` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `password`, `role`) VALUES
(1, 'ADMIN', 'admin@admin.com', '395bdb57512f444f07f23923cb637b5bba7c38ea967a458a0553199e8615f1a747a468de07a213c259ac42c390e8c12a48d35cec2d255d89a1d8f6f149b5d976', 1),
(2, 'Neriman', 'neri@gmail.com', '53db0fc135fbce6f381cf5acd2c0e1010d7597e32b7f5c91e371f6985945d7f1bad9e7d6468f885d8849450ebb603540cb59080ff376d7030e707c6ee67b3b32', 1),
(3, 'VINCENT MURIENNE', 'muriennevincent@gmail.com', 'a9246d9cfee6457b69bd989fc5316802bc7f456a603e3bcf1421a7cd551cbdde2fdf79d81e6374eab01dfc3563cab0137a647ba1f0efcb4b9efe64699a836915', 0);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
