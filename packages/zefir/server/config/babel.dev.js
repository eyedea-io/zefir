module.exports = {
  presets: [
    // Latest stable ECMAScript features
    [require.resolve('babel-preset-env'), {modules: false}],
    // JSX, Flow
    require.resolve('babel-preset-react')
  ],
  plugins: [
    // <style jsx></style>
    require.resolve('styled-jsx/babel'),
    // @decorator class MyClass {}
    require.resolve('babel-plugin-transform-decorators-legacy'),
    // export Module from './Module'
    require.resolve('babel-plugin-transform-export-extensions'),
    // class { handleClick = () => { } }
    require.resolve('babel-plugin-transform-class-properties'),
    // { ...todo, completed: true }
    require.resolve('babel-plugin-transform-object-rest-spread'),
    // Hot reloading
    require.resolve('react-hot-loader/babel')
  ]
}
