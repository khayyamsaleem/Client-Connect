FROM node:alpine

WORKDIR /app

ADD . /app

RUN yarn
RUN yarn global add nodemon

CMD ["yarn", "dev:start"]
