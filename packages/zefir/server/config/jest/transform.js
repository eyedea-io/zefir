const babelJest = require('babel-jest')
const babelDev = require('../babel.dev')

module.exports = babelJest.createTransformer(babelDev)
