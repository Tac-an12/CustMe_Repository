# Use the official PHP image as the base
FROM php:8.2-fpm

# Install system dependencies
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
    libonig-dev \
    && apt-get clean

# Configure GD extension with FreeType and JPEG
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install zip pdo_mysql gd xml intl mbstring

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set memory limit for Composer (optional)
ENV COMPOSER_MEMORY_LIMIT=-1

# Set timeout for Composer installation
ENV COMPOSER_PROCESS_TIMEOUT=300

# Set working directory
WORKDIR /var/www

# Copy only composer files first
COPY composer.json composer.lock ./ 

# Now copy the rest of the Laravel files (including artisan)
COPY . .

# Install Composer dependencies after copying all necessary files
RUN composer install --no-dev --optimize-autoloader --prefer-dist --no-interaction --no-cache

# Debug: List files in the working directory
RUN ls -la /var/www

# Set permissions for Laravel storage and cache
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Expose port 8000
EXPOSE 8000

# Start Laravel development server
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
