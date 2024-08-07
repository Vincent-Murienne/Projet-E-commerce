# Mise en place du back-end

## Pré-requis

- **Composer**
  - [Guide d'installation de Composer](https://kinsta.com/blog/install-composer/)
- **XAMPP**
  - [Lien d'installation de XAMPP](https://www.apachefriends.org/fr/download.html)
- **PHP**
  - [Guide d'installation de PHP](https://kinsta.com/fr/blog/installer-php/)

## Configuration de PHP

1. **Vérifier la version de PHP**
   - Exécutez la commande suivante pour vérifier la version de PHP que vous utilisez :
     ```sh
     php -v
     ```

2. **Activer PDO pour MySQL et Sodium**
   - Naviguez vers le chemin d'installation de PHP.
   - Trouvez les fichiers `php.ini-development` et `php.ini-production`.
   - Renommez l'un d'eux en `php.ini` pour le rendre actif.
   - Ouvrez le fichier `php.ini` et éditez-le.
   - Activez l'extension `pdo_mysql` en recherchant la chaîne de caractères `pdo_mysql` (utilisez `CTRL+F` dans l'éditeur).
   - Supprimez le `;` devant la ligne contenant `pdo_mysql`.
   - Activez l'extension `sodium` en recherchant la chaîne de caractères `sodium` (utilisez `CTRL+F` dans l'éditeur).
   - Supprimez le `;` devant la ligne contenant `sodium`.
   - Enregistrez le fichier.

## Mise en place du back-end

1. **Lancer les serveurs Apache et MySQL**
   - Assurez-vous que les serveurs Apache et MySQL de XAMPP sont bien lancés.

2. **Ouvrir le projet**
   - Ouvrez le projet back-end dans un éditeur de code, tel que Visual Studio Code.

3. **Préparation des dépendances**
   - Naviguez dans `Back-end\vendor` et supprimez les dossiers `phpmailer` et `stripe` pour permettre à Composer d'installer correctement les dépendances.

4. **Installer les dépendances**
   - Ouvrez un terminal dans le dossier `Back-end`.
   - Exécutez la commande suivante pour télécharger les dépendances :
     ```sh
     composer install
     ```

5. **Lancer le serveur PHP**
   - Pour le projet web React, exécutez la commande suivante dans le terminal :
     ```sh
     php -S localhost:8000
     ```
   - Pour le projet mobile Android, exécutez la commande suivante dans le terminal :
     ```sh
     php -S 0.0.0.0:8000
     ```
   - La deuxième façon de lancer le back-end permet également d'utiliser en simultanée l'application mobile et l'application web. Cependant, on remarque une certaine latence avec cette méthode pour l'application web.
