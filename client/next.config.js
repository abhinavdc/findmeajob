const withImages = require('next-images');

module.exports = withImages({
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            outputPath: 'static/webfonts/',
            publicPath: '../webfonts/',
            name: '[name].[ext]',
          },
        },
      ],
    });
    return config;
  },
});
