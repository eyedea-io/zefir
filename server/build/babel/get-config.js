import findBabelConfig from './find-config'

export default function getBabelConfig(dir, dev) {
  const mainBabelOptions = {
    cacheDirectory: true,
    sourceMaps: dev ? 'both' : false,
    presets: []
  }

  const externalBabelConfig = findBabelConfig(dir)

  if (externalBabelConfig) {
    console.log(`> Using external babel configuration`)
    console.log(`> location: "${externalBabelConfig.loc}"`)
    // It's possible to turn off babelrc support via babelrc itself.
    // In that case, we should add our default preset.
    // That's why we need to do this.
    const {options} = externalBabelConfig

    mainBabelOptions.babelrc = options.babelrc !== false
  } else {
    mainBabelOptions.babelrc = false
  }

  // Add our default preset if the no "babelrc" found.
  if (!mainBabelOptions.babelrc) {
    mainBabelOptions.presets.push(require.resolve('./preset'))
  }

  return mainBabelOptions
}
