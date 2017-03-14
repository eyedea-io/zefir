import React from 'react'
// App routing
import { BrowserRouter as Router } from 'react-router-dom'
// Provider inserts store and services into context of childrens
import Provider from './provider'
// App routes
import Index from 'src'

import {connect} from 'zefir/utils'

const ConnectedIndex = connect(Index)

let req

const stores = {}
const services = {}

req = require.context('_ROOT_/src', true, /\.(store|service)\.js$/)
req.keys().forEach(modulePath => {
  const filename = modulePath.split('/').pop()
  const [name, type] = filename.match(/(.*)\.js$/)[1].split('.')

  if (type === 'store') {
    stores[name] = req(modulePath).default
  }

  if (type === 'service') {
    services[name] = req(modulePath).default
  }
})

export default () => (
  <Provider stores={stores} services={services}>
    <Router>
      <ConnectedIndex />
    </Router>
  </Provider>
)
