# Step 1: Build the frontend (React with Vite)
FROM node:18 AS frontend

WORKDIR /app

# Install dependencies for React
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

# Build the React app for production
COPY frontend ./ 
RUN npm run build

# Step 2: Set up the Laravel backend (PHP)
FROM php:8.2-fpm AS backend

# Install necessary PHP extensions and tools for Laravel
RUN apt-get update && apt-get install -y libpng-dev libjpeg-dev libfreetype6-dev libzip-dev git unzip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd zip pdo pdo_mysql

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set the working directory for Laravel
WORKDIR /var/www

# Copy Laravel project files
COPY backend/composer.json backend/composer.lock ./
RUN composer install --no-dev --optimize-autoloader

# Copy the entire Laravel app into the container
COPY backend ./ 

# Set appropriate file permissions for Laravel
RUN chown -R www-data:www-data /var/www

# Copy the built React app into Laravel's public directory
COPY --from=frontend /app/dist /var/www/public

# Step 3: Nginx setup (You need Nginx to serve the application)
FROM nginx:alpine

# Copy Nginx configuration file for Laravel
COPY nginx/default.conf /etc/nginx/conf.d/

# Set the working directory
WORKDIR /var/www

# Expose port 80 for the web server
EXPOSE 80

# Start Nginx and PHP-FPM
CMD ["sh", "-c", "php-fpm & nginx -g 'daemon off;'"]
