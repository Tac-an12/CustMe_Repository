# Use the official PHP image as the base
FROM php:8.1-fpm

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    libzip-dev \
    unzip \
    git \
    curl \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libxml2-dev \
    libicu-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install zip pdo_mysql gd xml intl mbstring

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set memory limit for Composer
ENV COMPOSER_MEMORY_LIMIT=-1

# Set working directory
WORKDIR /var/www

# Copy only composer files first (composer.json and composer.lock)
COPY composer.json composer.lock ./

# Install Composer dependencies (this will be run in a separate step)
RUN composer install --no-dev --optimize-autoloader --prefer-dist --no-interaction --no-cache --timeout=300 --memory-limit=-1

# Debug: List files in the working directory after composer install
RUN ls -la /var/www

# Now copy the rest of the Laravel files
COPY . .

# Set permissions for Laravel storage and cache
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Expose port 8000
EXPOSE 8000

# Start Laravel development server
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
