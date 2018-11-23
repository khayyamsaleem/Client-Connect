const withImages = require('next-images')
const withSass = require('@zeit/next-sass')
module.exports = withImages(withSass({
    webpack: function(config) {
      config.externals.push('fs')
      return config;
    }
}))
