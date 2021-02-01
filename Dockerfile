FROM node:14.4.0

WORKDIR /app/
COPY package*.json /app/

RUN npm install

COPY . .

RUN npm test

COPY ./dev-bin/wait.sh /wait.sh
RUN chmod +x /wait.sh

EXPOSE 3003
