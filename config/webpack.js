const nodeExternals = require('webpack-node-externals');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'webtask.js',
    libraryTarget: 'commonjs2'
  },
  target: 'async-node',
  externals: [nodeExternals()],
  resolve: {
    alias: {
      filters: path.resolve(__dirname, '../src/filters'),
      parser: path.resolve(__dirname, '../src/parser')
    }
  },
  module: {
    loaders: [
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.handlebars$/,
        loader: `handlebars-loader?helperDirs[]=${__dirname}/../src/render/templates/helpers` },
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false // remove comments
      },
      compress: {
        unused: true,
        dead_code: true, // big one--strip code that will never execute
        warnings: false, // good for prod apps so users can't peek behind curtain
        drop_debugger: true,
        conditionals: true,
        evaluate: true,
        drop_console: true, // strips console statements
        sequences: true,
        booleans: true
      }
    })
  ]
};
