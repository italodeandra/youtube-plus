module.exports = {
  eslint: {
    configure: {
      parser: "@typescript-eslint/parser",
    },
  },
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.optimization.splitChunks = {
        cacheGroups: {
          default: false,
        },
      }
      webpackConfig.devtool = false
      webpackConfig.optimization.runtimeChunk = false
      webpackConfig.output.filename = "static/js/youtube-plus.js"
      return webpackConfig
    },
  },
}
