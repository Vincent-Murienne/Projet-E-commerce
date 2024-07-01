# Use the official PHP image with Apache
FROM php:7.4-apache

# Install required packages
RUN apt-get update && apt-get install -y \
    git \
    zip \
    unzip

# Install PDO and PDO_MYSQL extensions
RUN docker-php-ext-install pdo pdo_mysql

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Copy Composer from the latest Composer image
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set the working directory
WORKDIR /var/www/html

# Copy Composer files
COPY composer.* ./

# Allow Composer to run as superuser and install dependencies without scripts and autoloading
RUN COMPOSER_ALLOW_SUPERUSER=1 composer install --no-scripts --no-autoloader

# Copy the rest of the application code
COPY . ./

# Optimize Composer autoloading
RUN composer dump-autoload --optimize

# Set the appropriate ownership of the files
RUN chown -R www-data:www-data /var/www/html

# Expose port 80
EXPOSE 80