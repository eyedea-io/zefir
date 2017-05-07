import React, {Component} from 'react'
import PropTypes from 'prop-types'
import hoistStatics from 'hoist-non-react-statics'
import {observer} from 'mobx-react'
import formize from './formize'

export default function connect (ComposedComponent) {
  class Connect extends Component {
    constructor (props, context) {
      super(props, context)

      this.customProps = {
        ...props,
        services: context.services,
        stores: context.stores,
        emit: context.emit,
        router: context.router
      }
    }

    componentWillMount = () => {
      if (ComposedComponent.init) {
        const newProps = ComposedComponent.init(this.customProps)

        if (newProps) {
          this.customProps = newProps
        }
      }
    }

    render () {
      return React.createElement(observer(ComposedComponent), this.customProps)
    }
  }

  Connect.contextTypes = {
    services: PropTypes.object,
    stores: PropTypes.object,
    emit: PropTypes.func,
    router: PropTypes.object
  }

  let WrappedComponent = hoistStatics(Connect, ComposedComponent)

  // formize
  if (WrappedComponent.form) {
    WrappedComponent = formize(WrappedComponent.form)(WrappedComponent)
  }

  return WrappedComponent
}
