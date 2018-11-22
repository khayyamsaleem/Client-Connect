FROM node:alpine

WORKDIR /app

add . /app

RUN yarn install

CMD ["yarn", "dev:start"]
