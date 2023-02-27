const path = require('path');
const webpack = require('webpack');
const getPackageJson = require('./scripts/getPackageJson');
const CopyPlugin = require("copy-webpack-plugin");

const {
  version,
  name,
  license,
  repository,
  author,
} = getPackageJson('version', 'name', 'license', 'repository', 'author');

const banner = `
  ${name} v${version}
  ${repository.url}

  Copyright (c) ${author.replace(/ *\<[^)]*\> */g, " ")}

  This source code is licensed under the ${license} license found in the
  LICENSE file in the root directory of this source tree.
`;

module.exports = {
  mode: "production",
  devtool: 'source-map',
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'build'),
    library: {
      name: 'ariamanager',
      type: 'umd',
    },
  },
  optimization: {
    minimize: false
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ]
  },
  plugins: [
    new webpack.BannerPlugin(banner),
    new CopyPlugin({
      patterns:[
         {
            context:'./src/',
            from:'*.ts',
            to: './',
         }
       ]
    }),
  ],
  resolve: {
      extensions: [".tsx", ".ts", ".js"]
  }
};