var webpack = require('webpack')
var path = require('path')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

var BUILD_DIR = path.resolve(__dirname, 'app/win/out')
var APP_DIR = path.resolve(__dirname, 'app')

var config = {
  entry: APP_DIR + '/win/renderer.js',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js?/,
        query: {
          comments: false,
          compact: true
        },
        exclude: /node_modules/,
        include: APP_DIR,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new UglifyJSPlugin()
  ]
}

module.exports = config
