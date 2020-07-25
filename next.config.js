const withImages = require('next-images');
const withPlugins = require('next-compose-plugins');
module.exports = withPlugins(
  [
    withImages,
    {
      webpack(config) {
        config.module.rules.push({
          test: /\.svg$/,
          use: ['url-loader'],
        });

        return config;
      },
    }
  ],
  {
    target: 'serverless'
  }
);