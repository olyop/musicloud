FROM node:alpine

RUN apk update
RUN apk upgrade

WORKDIR /usr/src/app

COPY . .

RUN npm i -g npm@latest
RUN npm i
RUN npm run build-player

EXPOSE 3000

CMD npm run host-player