FROM node:20.19.0-alpine as tsbuild

#ARG NPM_TOKEN
#ENV NPM_TOKEN=$NPM_TOKEN

ARG BUILD_SERVICE_NAME
ENV BUILD_SERVICE_NAME=$BUILD_SERVICE_NAME

RUN mkdir /usr/app
WORKDIR /usr/app

COPY .npmrc package*.json tsconfig*.json nest-cli*.json ./

#RUN echo "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}" >> ~/.npmrc

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
COPY API.md project-info.json package.json nest-cli*.json ./
COPY ./tools/entrypoint.sh .

RUN npm prune --omit=dev

USER node

EXPOSE 8080

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["sh", "entrypoint.sh"]
