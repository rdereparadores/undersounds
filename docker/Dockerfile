# Imagen base
FROM node:23-alpine

# Directorio de trabajo
WORKDIR /app

# Dependencias
RUN apk add --no-cache git curl bash

COPY ./package*.json ./
RUN npm install

COPY ./ ./

# Compilación del frontend
RUN mkdir -p ./dist
RUN npm run update-views
RUN cp -r ./src/views ./dist/src/views

# Compilación del backend
RUN npm run build

# Exponer el puerto 80
EXPOSE 80

# Borrar archivos temporales
RUN mkdir -p /temp
RUN cp -r /app/dist/* /temp/
RUN cp /app/package.json /temp/
RUN cp /app/package-lock.json /temp/
RUN rm -r /app/*
RUN cp -r /temp/* /app/
RUN rm -r /temp/

RUN mkdir -p /app/public
RUN mkdir -p /app/protected
RUN npm install

# Comando para iniciar el servidor
CMD ["node", "index.js"]