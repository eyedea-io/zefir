import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import Index from 'src'
import {connect} from '../lib/utils'
import Provider from './provider'

const ConnectedIndex = connect(Index)

const stores = {}
const services = {}

const storesAndServices = /\.(store|service)\.js$/
const req = require.context('_SRC_', true, storesAndServices)

req
  .keys()
  .filter(key => storesAndServices.test(key))
  .forEach(modulePath => {
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
