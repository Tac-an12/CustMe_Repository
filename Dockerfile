# Use PHP 8.2 official image
FROM php:8.2-fpm

# Install system dependencies
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

# Install PHP extensions one by one
RUN docker-php-ext-install pdo_mysql
RUN docker-php-ext-install zip
RUN docker-php-ext-install gd
RUN docker-php-ext-install xml
RUN docker-php-ext-install intl
RUN docker-php-ext-install mbstring

# Create a non-root user and set ownership
RUN useradd -m -s /bin/bash laravel
RUN chown -R laravel:laravel /var/www

# Set working directory
WORKDIR /var/www

# Switch to the non-root user
USER laravel

# Copy only Composer files first to leverage Docker layer caching
COPY composer.json composer.lock ./

# Install Composer dependencies
RUN composer install --no-dev --optimize-autoloader --prefer-dist --no-interaction --no-cache

# Copy the rest of the Laravel app files
COPY . .

# Set permissions for Laravel storage and cache
RUN chown -R laravel:laravel /var/www/storage /var/www/bootstrap/cache /var/www/artisan

# Expose port for Laravel
EXPOSE 8000

# Start Laravel server
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
