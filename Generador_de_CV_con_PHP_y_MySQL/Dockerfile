FROM php:8.3-fpm-alpine

RUN apk update && apk add --no-cache --virtual .build-deps build-base mariadb-dev \
    # Limpia el caché de paquetes después de instalar
    && rm -rf /var/cache/apk/*

RUN docker-php-ext-install pdo_mysql

RUN apk del .build-deps