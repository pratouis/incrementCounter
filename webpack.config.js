var webpack = require('webpack');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './reactApp/App.js',
  output: {
    path: path.join(__dirname,'./build'),
    filename: 'app.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              'env',
              'react'
            ]
          }
        }
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: 'source-map'
};
