import {join} from 'path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import paths from './paths'
import env from './env'
import getBabelConfig from '../build/babel/get-config'

process.noDeprecation = true

const dir = process.cwd()
const babelQuery = getBabelConfig(dir, true)

babelQuery.plugins = [require.resolve('react-hot-loader/babel')]

const projectNodeModules = join(dir, 'node_modules')
const zefirNodeModules = join(__dirname, '..', '..', '..', './node_modules')

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
    modules: [paths.appSrc, projectNodeModules, zefirNodeModules],
    extensions: ['.js', '.jsx'],
    alias: {
      _SRC_: join(dir, 'src'),
      'zefir/head': require.resolve(join(__dirname, '..', '..', 'lib', 'head')),
      'zefir/utils': require.resolve(
        join(__dirname, '..', '..', 'lib', 'utils')
      ),
      'zefir/router': require.resolve(
        join(__dirname, '..', '..', 'lib', 'router')
      )
    }
  },
  resolveLoader: {
    modules: [paths.appSrc, projectNodeModules, zefirNodeModules]
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
      template: join(__dirname, '..', 'index.html')
    }),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: ['Live at: http://localhost:3000']
      }
    }),
    new CopyWebpackPlugin([
      {
        context: join(dir, 'src/static'),
        from: '**/*',
        to: 'static'
      }
    ]),
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
