FROM node:22.21.0-alpine as tsbuild


ARG APP_NAME
ENV APP_NAME=$APP_NAME

RUN mkdir /usr/app
WORKDIR /usr/app

COPY package*.json tsconfig*.json nest-cli*.json ./

RUN npm ci
COPY apps ./apps
COPY libs ./libs
RUN npm run build ${APP_NAME}

FROM node:22.21.0-alpine
LABEL maintainer="3sam3 <iamdap91@gmail.com>"

ARG APP_NAME
ENV APP_NAME=$APP_NAME

RUN mkdir /usr/app
WORKDIR /usr/app

RUN apk add --no-cache tini tzdata
RUN mkdir /var/log/nodejs
RUN chown node:node /var/log/nodejs

RUN mkdir /usr/app/temp
RUN chown node:node /usr/app/temp

# Chromium 설치 (consumer 앱인 경우)
RUN if [ "$APP_NAME" = "consumer" ]; then \
    apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont; \
    fi

#ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
#ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY --from=tsbuild /usr/app/dist .
COPY --from=tsbuild /usr/app/node_modules ./node_modules
COPY package.json nest-cli*.json ./

RUN npm prune --omit=dev

USER node

# Start the application
CMD node apps/${APP_NAME}/src/main.js
