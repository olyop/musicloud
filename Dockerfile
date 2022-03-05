FROM node:alpine

WORKDIR /usr/src/app

COPY . .

RUN npm i -g npm@latest
RUN npm install
RUN npm run build-player

EXPOSE 3000

CMD npm run host:player