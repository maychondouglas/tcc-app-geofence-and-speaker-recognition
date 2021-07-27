/**
 * Descrição: Configurações do WebPack
 * Autor: Maychon Douglas // @maychondouglas
 * Data: 2021/1
 */

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const WebpackPwaManifestPlugin = require('webpack-pwa-manifest');

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
    new WorkboxPlugin.GenerateSW({
      // O nome do arquivo que será criado.
      swDest: 'sw.js',
      clientsClaim: true,
      skipWaiting: true,
      maximumFileSizeToCacheInBytes: 5000000,
      runtimeCaching: [{
        urlPattern: new RegExp('^https:\/\/fonts\.googleapis\.com/'),
        /**
         * Se tiver versão em cache, ele irá carregar esta versão
         * Caso contrário, aguarda a resposta da rede.
         * */ 
        handler: 'StaleWhileRevalidate',
        options: {
          //Nome do cache
          cacheName: 'google-fonts',   
          //respostas consideradas armazenáveis no cache da APP.
          cacheableResponse: {
            statuses: [0, 200],
          }
        }
      }]
    }),
    /**
     * Gera um 'manifest.json' para o PWA, 
     * realiza o dimensionamento automático dos icones.
     */
    new WebpackPwaManifestPlugin({
      // Nome abreviado para o aplicativo
      short_name: 'GeoLocutor',
      // Nome do aplicativo
      name: 'Speaker and Geofencing',
      description: 'Reconhecimento de Locutor com Uso de Georreferenciamento',
      start_url: '/',
      display: 'standalone',
      background_color: '#D4F3EF',
      theme_color: '#AFE0E5',
      orientation: 'portrait-primary',
      icons: [ 
        {
          src: path.resolve('src/images/icons/icon-tcc.png'),
          sizes: [96, 128, 180, 192, 256, 512],
          type: 'image/png',
          purpose: 'maskable any'
        }
      ]
    }),

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