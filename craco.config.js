module.exports = {
  webpack: {
    configure: (webpackConfig, { env }) => {
      if (env === "production") {
        webpackConfig.optimization.splitChunks = {
          cacheGroups: {
            default: false,
          },
        }
        webpackConfig.devtool = false
        webpackConfig.optimization.runtimeChunk = false
        webpackConfig.output.filename = "static/js/youtube-plus.js"
      }
      return webpackConfig
    },
  },
}
