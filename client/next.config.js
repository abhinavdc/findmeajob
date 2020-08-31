const withImages = require('next-images');
module.exports = withImages({
  env: {
    HOTJAR_ID: process.env.HOTJAR_ID,
  },
});
