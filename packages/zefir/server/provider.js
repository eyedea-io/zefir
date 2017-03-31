import {Component, PropTypes, Children} from 'react'

class Provider extends Component {
  constructor (props, context) {
    super(props, context)

    const {stores, services} = this.props

    this.stores = stores

    this.services = Object
      .keys(services)
      .reduce((initializedServices, serviceName) => ({
        ...initializedServices,
        [serviceName]: new services[serviceName](this.stores)
      }), {})

    Object
      .keys(services)
      .forEach(actionName => {
        this.services[actionName].stores = this.stores
        this.services[actionName].services = this.services

        if (this.stores[actionName]) {
          this.services[actionName].store = this.stores[actionName]
        }
      })
  }

  getChildContext () {
    return {
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
  services: PropTypes.object.isRequired,
  stores: PropTypes.object.isRequired
}

export default Provider
