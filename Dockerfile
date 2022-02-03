FROM node:14.4.0

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . .

RUN npm test

EXPOSE 3003
