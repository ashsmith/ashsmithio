FROM nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN mkdir -p /etc/nginx/ssl/
COPY _ssl/ /etc/nginx/ssl/
COPY _site/ /usr/share/nginx/html/
