### STAGE 1: Build ###  responsável por gerar o build da nossa aplicação
FROM node:24-bookworm AS node
 
# Create a directory for the app
WORKDIR /app
 
# Copie o package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

# Install the app dependencies  
RUN npm install --legacy-peer-deps 
  
# Copy the rest of the app files to the app directory
COPY . .

#environment
ARG NODE_ENV=production
ARG VITE_UI_VERSION=
ENV NODE_ENV=$NODE_ENV
ENV VITE_UI_VERSION=$VITE_UI_VERSION
# docker build --build-arg VITE_UI_VERSION=2026.07.31.1 -t hotelwiseui .

# Build: incrementa VITE_UI_VERSION (ou usa --build-arg VITE_UI_VERSION=YYYY.MM.DD.N)
RUN npm run build:prod
  
### ESTÁGIO 2: Executar ###   2 - Responsável por expor nossa aplicação *  based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:latest 
## Skip this if you are using kubernetes config map 
COPY nginx.conf /etc/nginx/nginx.conf
## From ‘builder’ stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=node /app/dist /usr/share/nginx/html  

EXPOSE 80  
EXPOSE 4200 
EXPOSE 4000 
## Serve
CMD ["nginx", "-g", "daemon off;"]

# Comando para iniciar o servidor Express
#CMD ["npm", "start"]