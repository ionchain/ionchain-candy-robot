'use strict';
const path = require('path');
const webpack = require('webpack');
module.exports = {
  entry: './app/public/js/main.js',
  output: {
    path: __dirname + '/app/public/js/',
    filename: 'bundle.js',
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js',
    },
  },
  mode: 'development',
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      /* 'window.jQuery': 'jquery',
      d3: 'd3',
      Backbone: 'backbone',
      _: 'underscore',
      SockJS: 'sockjs-client',
      moment: 'moment',*/
    }),
    new webpack.HotModuleReplacementPlugin({
      multiStep: true,
    }),
  ],
  module: {
    rules: [
      {
        test: '/\.js$/',
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [ 'env' ],
            },

          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
};
