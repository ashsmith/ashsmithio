const withImages = require('next-images');
const withPlugins = require('next-compose-plugins');
const path = require('path');
module.exports = withPlugins(
  [

    {
      webpack(config) {
        config.module.rules.push({
          test: /\.svg$/,
          use: ['url-loader'],
        });

        return config;
      },
    },
    withImages,
  ],
  {
    exclude: path.resolve(__dirname, 'components/Header'),
    target: 'serverless'
  }
);