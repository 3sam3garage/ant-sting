FROM node:20.19.0-alpine as tsbuild


ARG BUILD_SERVICE_NAME
ENV BUILD_SERVICE_NAME=$BUILD_SERVICE_NAME

RUN mkdir /usr/app
WORKDIR /usr/app

COPY package*.json tsconfig*.json nest-cli*.json ./

RUN npm ci
COPY apps ./apps
COPY libs ./libs
RUN npm run build:${BUILD_SERVICE_NAME}

FROM node:20.19.0-alpine
LABEL maintainer="3sam3 <iamdap91@gmail.com>"

ARG BUILD_SERVICE_NAME
ENV BUILD_SERVICE_NAME=$BUILD_SERVICE_NAME

RUN mkdir /usr/app
WORKDIR /usr/app

RUN apk add --no-cache tini tzdata
RUN mkdir /var/log/nodejs
RUN chown node:node /var/log/nodejs

RUN mkdir /usr/app/temp
RUN chown node:node /usr/app/temp

COPY --from=tsbuild /usr/app/dist .
COPY --from=tsbuild /usr/app/node_modules ./node_modules
COPY package.json nest-cli*.json ./

RUN npm prune --omit=dev

USER node

EXPOSE 8080

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "./apps/${BUILD_SERVICE_NAME}/src/main.js"]
