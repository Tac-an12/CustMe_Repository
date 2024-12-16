# Base image for Laravel (PHP + Composer)
FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set the working directory
WORKDIR /var/www

# Copy Laravel files into the container
COPY backend/ . # Assuming the Laravel app is in a `backend/` folder

# Install dependencies
RUN composer install --no-dev --optimize-autoloader

# Clear and cache configurations
RUN php artisan config:clear \
    && php artisan route:clear \
    && php artisan view:clear \
    && php artisan config:cache

# Set permissions for storage and cache
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Expose the PHP-FPM port
EXPOSE 9000

# Start the PHP-FPM server
CMD ["php-fpm"]
