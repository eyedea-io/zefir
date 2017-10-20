// Grab NODE_ENV and REACT_APP_* environment variables and prepare them to be
// injected into the application via DefinePlugin in Webpack configuration.

const NODE_ENV = JSON.stringify(process.env.NODE_ENV || 'development')

module.exports = Object.keys(process.env).reduce(
  (env, key) => {
    return Object.assign({}, env, {
      [`process.env.${key}`]: JSON.stringify(process.env[key])
    })
  },
  {
    NODE_ENV,
    'process.env.NODE_ENV': NODE_ENV
  }
)
