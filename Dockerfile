# Etapa 1: Build de la aplicación Angular
FROM node:18-alpine AS build
WORKDIR /app

# Copia los archivos package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia todo el código fuente
COPY . .

# Construye la aplicación en modo producción
RUN npm run build

# Etapa 2: Servir la aplicación con un servidor NGINX
FROM nginx:stable-alpine

# Copia la configuración personalizada de NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia los archivos compilados de Angular
COPY --from=build /app/dist/admin-board-with-module/browser /usr/share/nginx/html

# Expone el puerto 80
EXPOSE 80

# Comando para iniciar NGINX
CMD ["nginx", "-g", "daemon off;"]
