# Use the official PHP image as the base
FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
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
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install zip pdo_mysql gd xml intl mbstring \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set memory limit for Composer
ENV COMPOSER_MEMORY_LIMIT=-1

# Set working directory
WORKDIR /var/www

# Copy the Laravel application files first (to make sure artisan is available)
COPY . .

# Copy only composer files first (not needed if you're copying all files above)
# COPY composer.json composer.lock ./ 

# Ensure the .env file is present in the Docker container (if not set via Render)
COPY .env .env

# Install Composer dependencies
RUN composer install --no-dev --optimize-autoloader --prefer-dist --no-interaction --no-cache

# Clear Laravel's configuration and cache
RUN php artisan config:clear && php artisan cache:clear

# Debug: Add a build step to log installed extensions and libraries
RUN php -m && php -i && composer --version && ls -la /var/www

# Set permissions for Laravel storage and cache
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Expose port 8000
EXPOSE 8000

# Start Laravel development server
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
