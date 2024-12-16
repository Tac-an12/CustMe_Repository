# Step 1: Build the frontend (React) app
FROM node:16 AS frontend

# Set working directory for frontend
WORKDIR /var/www/frontend

# Copy React files and install dependencies
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

# Build the React app
COPY frontend/ ./
RUN npm run build

# Step 2: Set up Laravel (backend) app
FROM php:8.2-fpm AS backend

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

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql zip gd xml intl mbstring

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory for Laravel
WORKDIR /var/www

# Copy Laravel's composer files
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --prefer-dist --no-interaction --no-cache

# Copy the rest of the Laravel app
COPY . .

# Step 3: Copy the built React files into the Laravel public folder
COPY --from=frontend /var/www/frontend/build /var/www/public

# Set permissions for Laravel storage and cache
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Expose port for Laravel
EXPOSE 8000

# Start Laravel server
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
