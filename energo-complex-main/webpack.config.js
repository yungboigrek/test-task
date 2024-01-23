'use strict';
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const plugins = [
  new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename:  "../css/style.css",
    chunkFilename:  "../css/[id].css" ,
  }),
];
module.exports = {
  plugins,
  mode: 'production',
  entry: './js/index.js',
  output: {
    filename: 'app.js',
    path: __dirname + '/js'
  },
  watch: true,

  devtool: "source-map",
  
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { 
            loader: 'css-loader', 
            options: { 
              url: false, 
              sourceMap: true 
            } 
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "autoprefixer",
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true, 
            }
          },
        ],
      },
    ],
  }
};
