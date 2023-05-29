# Establece la imagen base
FROM node:16

# Establece el directorio de trabajo dentro del contenedor
WORKDIR ./

# Copia los archivos de tu aplicación al contenedor
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos de tu aplicación al contenedor
COPY . .

# Expone el puerto en el que tu aplicación escucha
EXPOSE 3311

# Comando para iniciar tu aplicación cuando el contenedor se ejecute
CMD ["npm", "start"]
