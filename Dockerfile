# --- ETAPA 1: CONSTRUCCIÓN (BUILD) ---
# Usamos una imagen de Node.js para la compilación
FROM node:20-alpine AS build

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código fuente
COPY . .

# Ejecutamos el comando de compilación de Angular para producción
RUN npm run build -- --configuration production

# --- ETAPA 2: SERVIDOR (SERVE) ---
# Usamos una imagen de Nginx súper ligera
FROM nginx:alpine

# Copiamos la configuración personalizada de Nginx
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copiamos los archivos compilados de la etapa 'build' al directorio web de Nginx
COPY --from=build /app/dist/taskflow-ui/browser /usr/share/nginx/html

# Exponemos el puerto 80 del contenedor
EXPOSE 80