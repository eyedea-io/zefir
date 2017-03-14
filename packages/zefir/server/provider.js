import { Component, PropTypes, Children } from 'react'

export default class Provider extends Component {
  static propTypes = {
    stores: PropTypes.object.isRequired,
    services: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired
  }

  static childContextTypes = {
    services: PropTypes.object.isRequired,
    stores: PropTypes.object.isRequired
  }

  constructor (props, context) {
    super(props, context)

    const { stores, services } = this.props

    this.stores = stores
    this.services = Object
      .keys(services)
      .reduce((initializedServices, serviceName) => ({
        ...initializedServices,
        [serviceName]: new services[serviceName](this.stores)// eslint-disable-line new-parens
      }), {})

    Object
      .keys(services)
      .forEach(actionName => {
        this.services[actionName].stores = this.stores
        this.services[actionName].services = this.services
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
