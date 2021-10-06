FROM node:current-alpine

WORKDIR /app

COPY .env .
COPY .npmrc .
COPY package.json .

RUN npm i --production

COPY . .

CMD node -r dotenv/config build/server/index.js