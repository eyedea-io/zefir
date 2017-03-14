import 'babel-polyfill' // eslint-disable-line import/no-unassigned-import

window.Promise = require('promise/lib/es6-extensions')

// fetch() polyfill for making API calls.
require('whatwg-fetch') // eslint-disable-line import/no-unassigned-import
