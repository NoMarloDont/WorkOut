FROM node:14-alpine

WORKDIR /

ADD package.json /

RUN yarn install

ADD src /src
ADD types /types
ADD tsconfig.json /
ADD nodemon.json /

EXPOSE 8000