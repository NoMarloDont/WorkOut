FROM node:14-alpine

WORKDIR /

ADD package.json /

RUN yarn install

ADD src /src
ADD tsconfig.json /
ADD webpack.config.js /

CMD yarn start:dev

EXPOSE 8080