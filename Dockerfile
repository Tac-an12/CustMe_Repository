# Use PHP 8.2 official image
FROM php:8.2-fpm

# Install dependencies
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

# Debug: Check installed libraries
RUN ldconfig -p | grep -E 'libjpeg|libfreetype|libpng'

# Configure GD
RUN docker-php-ext-configure gd --with-freetype --with-jpeg

# Debug: Install extensions one by one
RUN docker-php-ext-install pdo_mysql
RUN docker-php-ext-install zip
RUN docker-php-ext-install gd
RUN docker-php-ext-install xml
RUN docker-php-ext-install intl
RUN docker-php-ext-install mbstring

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy Laravel files
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --prefer-dist --no-interaction --no-cache

COPY . .

# Set permissions
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Expose port
EXPOSE 8000

# Start Laravel server
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
