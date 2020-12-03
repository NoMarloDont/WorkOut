FROM node:14-alpine

WORKDIR /

ADD package.json /

RUN yarn install

ADD src /src
ADD tsconfig.json /

CMD yarn start

EXPOSE 8000