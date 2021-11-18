const nodeExternals = require('webpack-node-externals');
const path = require('path');
const webpack = require('webpack');

const distPath = path.join(__dirname, '../dist');

const config = {
  mode: 'production',
  cache: false,
  target: 'node',
  resolve: {
    // https://github.com/octokit/rest.js/issues/1485
    mainFields: ['main'],
    alias: {
      filters: path.resolve(__dirname, '../src/filters'),
      parser: path.resolve(__dirname, '../src/parser')
    }
  },
  module: {
    rules: [
      {
        test: /\.hbs$/,
        loader: `handlebars-loader?helperDirs[]=${__dirname}/../src/render/templates/helpers`
      },
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        enforce: 'pre'
      }
    ]
  },
  plugins: [
    // https://github.com/node-fetch/node-fetch/issues/412
    new webpack.IgnorePlugin(/^encoding$/, /node-fetch/)
  ]
};

const cliConfigFull = Object.assign({}, config, {
  entry: {
    './cli': './src/cli.js'
  },
  output: {
    filename: '[name].js',
    path: distPath,
    libraryTarget: 'umd'
  }
});

const cliConfigLight = Object.assign({}, config, {
  entry: {
    './cli.light': './src/cli.js'
  },
  output: {
    filename: '[name].js',
    path: distPath,
    libraryTarget: 'umd'
  },
  externals: [nodeExternals()]
});

const lambdaConfigFull = Object.assign({}, config, {
  entry: {
    './index': './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: distPath,
    libraryTarget: 'commonjs2'
  }
});

const lambdaConfigLight = Object.assign({}, config, {
  entry: {
    './index.light': './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: distPath,
    libraryTarget: 'commonjs2'
  },
  externals: [nodeExternals()]
});

module.exports = [
  cliConfigLight,
  cliConfigFull,
  lambdaConfigLight,
  lambdaConfigFull
];

