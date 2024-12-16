# Use PHP 8.2 official image for Laravel
FROM php:8.2-fpm

# Install system dependencies for Laravel
RUN apt-get update && apt-get install -y \
    libzip-dev \
    unzip \
    git \
    curl \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libxml2-dev \
    libicu-dev \
    libonig-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Configure GD extension with JPEG and Freetype support
RUN docker-php-ext-configure gd --with-freetype --with-jpeg

# Install PHP extensions for Laravel
RUN docker-php-ext-install pdo_mysql
RUN docker-php-ext-install zip
RUN docker-php-ext-install gd
RUN docker-php-ext-install xml
RUN docker-php-ext-install intl
RUN docker-php-ext-install mbstring

# Install Composer (for managing PHP dependencies)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory for Laravel
WORKDIR /var/www

# Copy Laravel-specific files first (to leverage Docker layer caching)
COPY composer.json composer.lock ./

# Install Laravel PHP dependencies
RUN composer install --no-dev --optimize-autoloader --prefer-dist --no-interaction --no-cache

# Copy the rest of the Laravel app files
COPY . .

# Set permissions for Laravel storage and cache
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Set up environment for React build
WORKDIR /var/www/resources/js

# Install Node.js dependencies for React (assuming package.json exists in the resources/js folder)
RUN npm install

# Build the React app
RUN npm run build

# Set the working directory back to the main Laravel project folder
WORKDIR /var/www

# Expose port 8000 for Laravel API
EXPOSE 8000

# Start Laravel server (the React app will be served via Laravel or via a separate container, depending on your setup)
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
