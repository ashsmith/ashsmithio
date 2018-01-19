# Blog for ashsmith.io

## Requirements:

- Docker
- Jekyll
- Gulp
- Sass

## Get running:

    docker-compose up -d

This launches two containers by default: the jekyll server, and also runs the gulp watch task on the node container. Port 4000 will be exposed for viewing the website.

If you're on Mac I recommend using the latest release of Docker for Mac, as this improves performances (and I know it works!!)

## Build server

The website is deployed via AWS CodeBuild, to generate the site and build assets for production the docker image you'll need to build the image first:

    docker build -t build_server docker/build_server

Then you can test it with:

    docker run -v ./:/usr/src/app build_server

For more info on the deployment process refer to `buildspec.yml`.