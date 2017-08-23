// Global styles
import React from 'react'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'

import App from './app'

const $root = document.getElementById('root')

function render () {
  ReactDOM.render((
    <AppContainer>
      <App />
    </AppContainer>
  ), $root)
}

render()

if (module.hot) {
  module.hot.accept('./app', () => {
    const NextApp = require('./app').default

    ReactDOM.render((
      <AppContainer>
        <NextApp />
      </AppContainer>
    ), $root)
  })
}
