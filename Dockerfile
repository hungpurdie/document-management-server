FROM node:16.15.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g pm2

CMD ["pm2-runtime", "start", "server.js"]

