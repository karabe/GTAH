const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  mode: 'development',
  entry: {
    background: './src/background.js',
    browser_action: './src/browser_action.js'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/addon'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ],
  devtool: false
}
