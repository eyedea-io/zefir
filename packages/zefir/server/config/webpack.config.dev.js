import path from 'path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin'
import paths from './paths'
import env from './env'
import babelQuery from './babel.dev'

process.noDeprecation = true

const dir = process.cwd()

const projectNodeModules = path.join(dir, 'node_modules')
const zefirNodeModules = path.join(__dirname, '..', '..', '..', './node_modules')

module.exports = {
  context: dir,
  devtool: 'eval',
  entry: [
    'webpack-hot-middleware/client',
    'react-hot-loader/patch',
    require.resolve('../polyfills'),
    require.resolve('../root')
  ],
  output: {
    path: paths.appBuild,
    pathinfo: true,
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    publicPath: ''
  },
  resolve: {
    modules: [
      paths.appSrc,
      projectNodeModules,
      zefirNodeModules
    ],
    extensions: [
      '.js',
      '.jsx'
    ],
    alias: {
      _ROOT_: dir,
      'zefir/head': require.resolve(path.join(__dirname, '..', '..', 'lib', 'head')),
      'zefir/utils': require.resolve(path.join(__dirname, '..', '..', 'lib', 'utils')),
      'zefir/router': require.resolve(path.join(__dirname, '..', '..', 'lib', 'router'))
    }
  },
  resolveLoader: {
    modules: [
      paths.appSrc,
      projectNodeModules,
      zefirNodeModules
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
        options: babelQuery
      },
      {
        test: /\.json$/,
        include: [paths.appSrc],
        exclude: [/node_modules/],
        loader: 'json-loader'
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      React: 'react'
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.join(__dirname, '..', 'index.html')
    }),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: ['Live at: http://localhost:3000']
      }
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      options: {
        context: dir
      }
    }),
    new webpack.DefinePlugin(env),
    new webpack.HotModuleReplacementPlugin()
  ]
}
