/*
 * This file is part of the Runr package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const CreateFileWebpack = require('create-file-webpack');
const webpack = require('webpack');

const webpackPlugin = [
  new webpack.DefinePlugin({
    __VERSION__: JSON.stringify(require("./package.json").version),
  })
];

if ('production' === process.env.NODE_ENV && process.env.VUE_APP_APP_DOMAIN) {
  webpackPlugin.push(new CreateFileWebpack({
    path: './dist',
    fileName: 'CNAME',
    content: process.env.VUE_APP_APP_DOMAIN,
  }));
}

module.exports = {
  devServer: {
    disableHostCheck: true,
  },

  css: {
    sourceMap: true,
  },

  pwa: {
    themeColor: '#fafafa',
  },

  configureWebpack: {
    plugins: webpackPlugin,
  },

  outputDir: undefined,
  assetsDir: undefined,
  runtimeCompiler: undefined,
  productionSourceMap: false,
  parallel: undefined,
};
