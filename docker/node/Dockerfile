FROM node:9

WORKDIR /usr/src/app

COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

RUN npm install --global gulp

ENTRYPOINT [ "entrypoint.sh" ]

CMD ["gulp"]