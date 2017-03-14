/* eslint-disable no-var, vars-on-top */
const path = require('path')
const url = require('url')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const paths = require('./paths')
const env = require('./env')
const babelQuery = require('./babel.prod')

if (env['process.env.NODE_ENV'] !== '"production"') {
  throw new Error('Production builds must have NODE_ENV=production.')
}

const homepagePath = require(paths.appPackageJson).homepage // eslint-disable-line import/no-dynamic-require

var publicPath = homepagePath ? url.parse(homepagePath).pathname : '/'

if (!publicPath.endsWith('/')) {
  publicPath += '/'
}

module.exports = {
  bail: true,
  devtool: 'source-map',
  entry: [
    require.resolve('./polyfills'),
    path.join(paths.appSrc, 'index')
  ],
  output: {
    path: paths.appBuild,
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    publicPath
  },
  resolve: {
    modules: [
      paths.appSrc,
      path.join(__dirname, '../node_modules')
    ],
    extensions: [
      '.js',
      '.jsx'
    ]
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'xo-loader',
        include: paths.appSrc
      },
      {
        test: /\.js$/,
        include: paths.appSrc,
        loader: 'babel-loader',
        options: babelQuery
      },
      {
        test: /\.css$/,
        include: paths.appSrc,
        exclude: paths.stylesSrc,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: 'css-loader?modules&minimize&-autoprefixer&importLoaders=1',
          publicPath: '/dist'
        })
      },
      {
        test: /\.css$/,
        include: paths.stylesSrc,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: 'css-loader?minimize'
        })
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' }
        ]
      },
      {
        test: /\.json$/,
        include: [paths.appSrc, /node_modules/],
        loader: 'json-loader'
      },
      {
        test: /\.(jpg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        include: [paths.appSrc, /node_modules/],
        loader: 'file-loader',
        options: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      },
      {
        test: /\.(mp4|webm)(\?.*)?$/,
        include: [paths.appSrc, /node_modules/],
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      favicon: paths.appFavicon,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),
    new webpack.DefinePlugin(env),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true, // eslint-disable-line camelcase
        warnings: false
      },
      mangle: {
        screw_ie8: true // eslint-disable-line camelcase
      },
      output: {
        comments: false,
        screw_ie8: true // eslint-disable-line camelcase
      }
    }),
    new ExtractTextPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
      disable: false,
      allChunks: true
    })
  ]
}
