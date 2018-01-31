FROM node:9

RUN npm install --global gatsby-cli

COPY build.sh /build.sh

WORKDIR /usr/src/app

ENTRYPOINT /build.sh

CMD ["gatsby", "build"]