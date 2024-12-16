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

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Configure GD extension with JPEG and Freetype support
RUN docker-php-ext-configure gd --with-freetype --with-jpeg

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql zip gd xml intl mbstring

# Create a non-root user and set ownership for the Laravel app
RUN useradd -m -s /bin/bash laravel
RUN chown -R laravel:laravel /var/www

# Set working directory
WORKDIR /var/www

# Switch back to root to create directories
USER root

# Copy the whole Laravel app (including artisan) before running composer
COPY . .

# Create necessary directories with the correct permissions
RUN mkdir -p storage/logs && \
    chown -R laravel:laravel storage bootstrap/cache

# Switch to the non-root user
USER laravel

# Install Composer dependencies
RUN composer install --no-dev --optimize-autoloader --prefer-dist --no-interaction --no-cache

# Set permissions for Laravel storage and cache
RUN chown -R laravel:laravel /var/www/storage /var/www/bootstrap/cache

# Expose port for Laravel
EXPOSE 8000

# Start Laravel server
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]