import React, { Component, PropTypes } from 'react'
import hoistStatics from 'hoist-non-react-statics'
import formize from './formize'
import { observer } from 'mobx-react'

export default function connect (ComposedComponent) {
  class Connect extends Component {
    static contextTypes = {
      services: PropTypes.object,
      stores: PropTypes.object,
      router: PropTypes.object
    }

    constructor (props, context) {
      super(props, context)

      this.customProps = {
        ...props,
        services: context.services,
        stores: context.stores,
        router: context.router
      }
    }

    componentDidMount = () => {
      if (ComposedComponent.init) {
        ComposedComponent.init(this.customProps)
      }
    }

    render () {
      return React.createElement(observer(ComposedComponent), this.customProps)
    }
  }

  let WrappedComponent = hoistStatics(Connect, ComposedComponent)

  // formize
  if (WrappedComponent.formize) {
    WrappedComponent = formize(WrappedComponent.formize)(WrappedComponent)
  }

  return WrappedComponent
}
