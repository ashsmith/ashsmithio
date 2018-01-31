# Ash Smith's Blog

High level good to know stuff:

- Site is built on [GatsbyJS](https://www.gatsbyjs.org)
- Docker can be used to run the environment, but I've had issues with FSEvents and changes therefor not being recompiled.
- `serverless-code-build-trigger` uses [serverless.com](https://serverless.com/) to create an AWS Lambda function with an endpoint to be configured so whenever I push to this repository a CodeBuild process will be triggered, which builds and deploys the blog (and clears CloudFront cache!). See `buildspec.yml` for info on the CodeBuild process.


## Running with docker:

    docker-compose up

Then it'll be available on port 8000.

Want to build the production site locally?

    docker-compose run --rm node gatsby build

## Configuring the serverless deployment


    cd serverless-code-build-trigger
    cp env.yml.sample env.yml #edit the details
    npm install -g serverless
    serverless deploy

The output of the deployment will give you a URL endpoint. Head over to github, and configure the endpoint to receive only 'push' notifications.

## Notes on CodeBuild process

There are three steps: `pre_build`, `build`, `post_build`

`pre_build` will configure the environment, which currently means logging into AWS ECR, and making sure cloudfront commands are allowed on the AWS CLI.

`build` will run the configured docker container which handles the actual build tasks.

`post_build` will copy all files over the configured S3 bucket, then create an invalidation with cloudfront to let the CDN know the files have changed.

## Notes on docker FSEvents

In my experience you could open up configuration files and tweak them, but for some reason I'm not entirely sure of the filesystem events that should be fired and picked up by Gatsby doesn't seem to happen.

Until I can figure it out, I'm not using the docker environment.