// Global styles
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './app'

class Root {
  constructor() {
    this.$root = document.getElementById('root')

    this.render()

    if (module.hot) {
      module.hot.accept('./app', () => {
        require('./app')
        this.render();
      })
    }
  }

  render() {
    ReactDOM.render((
      <AppContainer>
        <App/>
      </AppContainer>
    ), this.$root)
  }
}

new Root()
