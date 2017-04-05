/* global __dirname, require, module */

const path = require('path');

const webpack = require('webpack');
const env = require('yargs').argv.env;  // Use `--env` with Webpack 2.

const packageJson = require('./package.json');

const srcDir = path.resolve(__dirname, './src');
const distDir = path.join(__dirname, env.indexOf('dist') > -1 ? 'dist' : 'build');
const libraryName = packageJson.productName || libraryName || packageJson.name;
const outputFileBase = libraryName.toLowerCase();
let outputFile = `${outputFileBase}.js`;
let plugins = [];
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

if (env.indexOf('min') > -1) {
  plugins.push(new UglifyJsPlugin({
    sourceMap: true,
    minimize: true
  }));
  outputFile = `${outputFileBase}.min.js`;
}

module.exports = {
  context: path.resolve(__dirname, '.'),
  entry: path.join(srcDir, 'index.js'),
  devtool: 'source-map',
  output: {
    path: distDir,
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  devServer: {
    contentBase: path.resolve(__dirname, '.'),
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    modules: [
      srcDir
    ],
    extensions: [
      '.json',
      '.js'
    ]
  },
  plugins: plugins
};
