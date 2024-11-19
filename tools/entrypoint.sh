#!/bin/sh

BUILD_SERVICE_NAME=$BUILD_SERVICE_NAME

echo "Run ${NODE_ENV} ${BUILD_SERVICE_NAME}"

exec node ./apps/$BUILD_SERVICE_NAME/src/main.js
