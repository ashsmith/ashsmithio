FROM ruby:2.3.4

RUN curl -sL https://deb.nodesource.com/setup_7.x | bash -
RUN apt-get install nodejs -y
RUN npm install --global gulp

COPY build.sh /build.sh

WORKDIR /usr/src/app

ENTRYPOINT /build.sh