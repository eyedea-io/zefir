import {Component, PropTypes, Children} from 'react'
import {emit} from '../lib/utils/listener'

class Provider extends Component {
  constructor (props, context) {
    super(props, context)

    const {stores, services} = this.props
    this.listeners = []
    this.stores = stores

    this.services = Object
      .keys(services)
      .reduce((initializedServices, serviceName) => {
        return ({
          ...initializedServices,
          [serviceName]: new services[serviceName](this.stores)
        })
      }, {})

    Object
      .keys(this.services)
      .forEach(serviceName => {
        this.services[serviceName].stores = this.stores
        this.services[serviceName].services = this.services

        if (this.stores[serviceName]) {
          this.services[serviceName].store = this.stores[serviceName]
        }

        let listeners = this.services[serviceName]._whenable || []
        listeners = listeners.map(l => ({
          ...l,
          handler: l.handler.bind(this.services[serviceName])
        }))
        this.listeners = this.listeners.concat(listeners)
      })

    Object
      .keys(this.services)
      .forEach(serviceName => {
        this.services[serviceName].emit = emit.bind(null, this.listeners)
      })
  }

  getChildContext () {
    return {
      listeners: this.listeners,
      services: this.services,
      stores: this.stores
    }
  }

  render () {
    return Children.only(this.props.children)
  }
}

Provider.propTypes = {
  stores: PropTypes.object.isRequired,
  services: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired
}

Provider.childContextTypes = {
  listeners: PropTypes.array.isRequired,
  services: PropTypes.object.isRequired,
  stores: PropTypes.object.isRequired
}

export default Provider
