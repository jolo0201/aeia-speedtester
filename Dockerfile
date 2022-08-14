FROM node:16-alpine3.15
 
COPY package*.json ./
   
WORKDIR '/var/www/app'
 
RUN npm install
RUN npm install --global speed-test
 
COPY . .
 
EXPOSE 4000