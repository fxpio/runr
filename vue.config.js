/*
 * This file is part of the BibScan for Njuko package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const CreateFileWebpack = require('create-file-webpack');
const webpackPlugin = [];

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
    themeColor: '#00a58c',
  },

  configureWebpack: {
    plugins: webpackPlugin,
  },

  baseUrl: undefined,
  outputDir: undefined,
  assetsDir: undefined,
  runtimeCompiler: undefined,
  productionSourceMap: false,
  parallel: undefined,
};
