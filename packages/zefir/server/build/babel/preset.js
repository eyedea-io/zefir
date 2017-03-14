// const relativeResolve = require('../root-module-relative-path').default(require)

const envPlugins = {
  'development': [
    require.resolve('babel-plugin-transform-react-jsx-source')
  ],
  'production': [
    require.resolve('babel-plugin-transform-react-remove-prop-types')
  ]
}

const plugins = envPlugins[process.env.NODE_ENV] || []

module.exports = {
  presets: [
    [require.resolve('babel-preset-latest'), {
      'es2015': { modules: false }
    }],
    require.resolve('babel-preset-react')
  ],
  plugins: [
    require.resolve('babel-plugin-react-require'),
    require.resolve('babel-plugin-transform-decorators-legacy'),
    // { ...todo, completed: true }
    require.resolve('babel-plugin-transform-object-rest-spread'),
    // class { handleClick = () => { } }
    require.resolve('babel-plugin-transform-class-properties'),
    require.resolve('babel-plugin-transform-runtime'),
    require.resolve('styled-jsx/babel'),
    ...plugins,
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        alias: {
          // 'babel-runtime': relativeResolve('babel-runtime/package')
        }
      }
    ]
  ]
}
