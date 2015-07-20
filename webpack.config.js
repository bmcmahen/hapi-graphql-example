var webpack = require('webpack')
var path = require('path')

module.exports = {
  devtool: 'eval',
  entry: [
    './client/index.js'
  ],
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /\.js?$/,
      loader: 'babel',
      query: {
        optional: ['runtime'],
        stage: 0
      },
      exclude: /node_modules/
    }]
  }
}
