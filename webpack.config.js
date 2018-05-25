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
  devtool: false
}
