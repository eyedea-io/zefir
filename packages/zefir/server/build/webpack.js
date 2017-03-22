import {resolve, join} from 'path'
import {createHash} from 'crypto'
import webpack from 'webpack'
import glob from 'glob-promise'
import WriteFilePlugin from 'write-file-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin'
import CaseSensitivePathPlugin from 'case-sensitive-paths-webpack-plugin'
import UnlinkFilePlugin from './plugins/unlink-file-plugin'
import WatchPagesPlugin from './plugins/watch-pages-plugin'
import JsonPagesPlugin from './plugins/json-pages-plugin'
import getBabelConfig from './babel/get-config'

process.noDeprecation = true

const defaultPage = join(__dirname, '..', 'index.html')
const defaultPages = [
  '_error.js',
  '_document.js'
]

const nextPagesDir = join(__dirname, '..', '..', 'pages')
const interpolateNames = new Map(defaultPages.map(p => {
  return [join(nextPagesDir, p), `dist/pages/${p}`]
}))

export default async function createCompiler (dir, {dev = false, quiet = false, buildDir} = {}) {
  dir = resolve(dir)

  const projectNodeModules = join(dir, 'node_modules')
  const zefirNodeModules = join(__dirname, '..', '..', '..', './node_modules')
  const defaultEntries = []

  let minChunks

  const entry = async () => {
    const entries = {
      'polyfils.js': require.resolve('../polyfills'),
      'main.js': require.resolve('../root')
    }

    const pages = await glob('pages/**/*.js', {cwd: dir})
    for (const p of pages) {
      entries[join('bundles', p)] = [...defaultEntries, `./${p}?entry`]
    }

    // for (const p of defaultPages) {
    //   const entryName = join('bundles', 'pages', p)
    //   if (!entries[entryName]) {
    //     entries[entryName] = [...defaultEntries, join(nextPagesDir, p) + '?entry']
    //   }
    // }
    //
    // // calculate minChunks of CommonsChunkPlugin for later use
    // minChunks = Math.max(2, pages.filter((p) => p !== documentPage).length)

    return entries
  }

  const plugins = [
    new webpack.LoaderOptionsPlugin({
      options: {
        context: dir,
        customInterpolateName (url) {
          return interpolateNames.get(this.resourcePath) || url
        }
      }
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: defaultPage,
      // favicon: paths.appFavicon,
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
    new WriteFilePlugin({
      exitOnErrors: false,
      log: false,
      // required not to cache removed files
      useHashIndex: false
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      filename: 'commons.js',
      minChunks (module, count) {
        // NOTE: it depends on the fact that the entry funtion is always called
        // before applying CommonsChunkPlugin
        return count >= minChunks
      }
    }),
    new JsonPagesPlugin(),
    new CaseSensitivePathPlugin()
  ]

  if (dev) {
    plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new UnlinkFilePlugin(),
      new WatchPagesPlugin(dir)
    )
    if (!quiet) {
      plugins.push(new FriendlyErrorsWebpackPlugin())
    }
  } else {
    plugins.push(
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {warnings: false},
        sourceMap: false
      })
    )
  }

  const mainBabelOptions = getBabelConfig(dir, dev)

  const rules = []
  .concat([{
    test: /\.json$/,
    loader: 'json-loader'
  }, {
    loader: 'babel-loader',
    include: nextPagesDir,
    exclude (str) {
      return /node_modules/.test(str) && str.indexOf(nextPagesDir) !== 0
    },
    options: {
      babelrc: false,
      cacheDirectory: true,
      sourceMaps: dev ? 'both' : false,
      presets: [require.resolve('./babel/preset')]
    }
  }, {
    test: /\.js(\?[^?]*)?$/,
    loader: 'babel-loader',
    include: [dir],
    exclude (str) {
      return /node_modules/.test(str)
    },
    options: mainBabelOptions
  }])

  const webpackConfig = {
    context: dir,
    entry,
    output: {
      path: join(buildDir || dir, '.zefir'),
      filename: '[name]',
      publicPath: '/',
      strictModuleExceptionHandling: true,
      devtoolModuleFilenameTemplate ({resourcePath}) {
        const hash = createHash('sha1')
        hash.update(String(Date.now()))
        const id = hash.digest('hex').slice(0, 7)

        // append hash id for cache busting
        return `webpack:///${resourcePath}?${id}`
      }
    },
    resolve: {
      modules: [
        resolve('./'),
        projectNodeModules,
        zefirNodeModules
      ],
      alias: {
        _ROOT_: dir,
        'zefir/utils': resolve(join(__dirname, '..', '..', 'lib', 'utils')),
        'zefir/router': resolve(join(__dirname, '..', '..', 'lib', 'router'))
      }
    },
    resolveLoader: {
      modules: [
        resolve('./'),
        projectNodeModules,
        zefirNodeModules
      ]
    },
    plugins,
    module: {
      rules
    },
    devtool: dev ? 'inline-source-map' : false,
    performance: {hints: false}
  }

  // if (config.webpack) {
  //   console.log('> Using "webpack" config function defined in zefir.config.js.')
  //   webpackConfig = await config.webpack(webpackConfig, { dev })
  // }
  return webpack(webpackConfig)
}
