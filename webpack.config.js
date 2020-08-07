/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const StartServerPlugin = require('start-server-webpack-plugin');


// webpack.config.js
const baseConfig = {
    entry: './index.js',
    target: 'node',
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'index.js',
    },
    plugins: [
      new CopyPlugin({
         patterns: [
        {
          // Copy the binary Oracle DB driver to dist.
          from: path.resolve(__dirname, 'node_modules/oracledb/build'),
          to: 'node_modules/oracledb/build',
        },
        ],
      })
    ],
    module: {
      rules: [
        {
          // Use __non_webpack_require__ to look for the Oracle binary in the dist folder at runtime.
          test: /oracledb\.js$/,
          loader: 'string-replace-loader',
          options: {
            search: 'require(binaryLocations[i])',
            replace: '__non_webpack_require__(binaryLocations[i])',
          },
        },
      ],
    },
  };

  module.exports = baseConfig;