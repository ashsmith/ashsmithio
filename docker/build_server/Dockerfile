FROM node:9-alpine
RUN npm install --global gatsby-cli
RUN apk add vips-dev fftw-dev --update-cache --repository https://dl-3.alpinelinux.org/alpine/edge/testing/
RUN apk add --no-cache build-base python
COPY build.sh /usr/bin/build.sh

WORKDIR /usr/src/app

ENTRYPOINT sh /usr/bin/build.sh