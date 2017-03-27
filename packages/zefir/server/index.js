const mime = require('mime')
const path = require('path')
const {existsSync} = require('fs')

let config = {}
const dir = process.cwd()
const configPath = path.join(dir, 'zefir.config.js')

if (existsSync(configPath)) {
  config = require(configPath)
}

// Dev middleware
const addDevMiddlewares = (app, webpackConfig) => {
  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  if (config.webpack) {
    console.log('> Using "webpack" config function defined in zefir.config.js.')
    webpackConfig = config.webpack(webpackConfig, {dev: true})
  }
  const compiler = webpack(webpackConfig)
  const middleware = webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    clientLogLevel: 'none',
    noInfo: true,
    silent: true,
    stats: 'none'
  })

  app.use(middleware)
  app.use(webpackHotMiddleware(compiler, {
    log: false
  }))

  // Since webpackDevMiddleware uses memory-fs internally to store build
  // artifacts, we use it instead
  const fs = middleware.fileSystem

  app.get('/static/*', function (req, res) {
    try {
      const root = `${compiler.outputPath}/../src/static`
      const file = req.originalUrl.split('static/')[1].split('?')[0]
      res.set('Content-Type', mime.lookup(file))
      res.sendFile(file, {root})
    } catch (e) {
      res.sendStatus(404)
    }
  })
  app.get('*', (req, res) => {
    fs.readFile(path.join(compiler.outputPath, 'index.html'), (err, file) => {
      if (err) {
        res.sendStatus(404)
      } else {
        res.send(file.toString())
      }
    })
  })
}

module.exports = (app, options) => {
  const webpackConfig = require('./config/webpack.config.dev')

  addDevMiddlewares(app, webpackConfig)

  return app
}
