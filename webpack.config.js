const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const dotenv = require('dotenv').config( {
  path: path.join(__dirname, '.env')
} );

module.exports = (_, { mode }) => ({
  entry: [
    '@babel/polyfill', 
    './src/js/index.js'
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/bundle.js'
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
  },
  node: {
    fs: "empty"
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].css',
    }),
    new webpack.DefinePlugin( {
      "process.env": dotenv.parsed
    } ),
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          mode !== 'production'
            ? 'style-loader'
            : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader', 
        ],     
      },
      { 
        test: /\.(png|jpg|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
                name: '[path][name].[ext]',
                context: path.resolve(__dirname, "src/"),
                outputPath: '/',
                publicPath: '../',
                useRelativePaths: true
            }
          }
        ] 
      }
    ], 
  }
});