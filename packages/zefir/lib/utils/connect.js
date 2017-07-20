import React, {Component} from 'react'
import PropTypes from 'prop-types'
import hoistStatics from 'hoist-non-react-statics'
import {observable} from 'mobx'
import {observer} from 'mobx-react'
import formize from './formize'

export default function connect (ComposedComponent) {
  const data = {
    state: {},
    events: {},
    actions: {}
  }

  const publish = (event, payload) => {
    if (data.events[event]) {
      const result = data.events[event](data.state, data.actions, payload)

      return result === undefined ? payload : result
    }

    return payload
  }

  class Connect extends Component {
    constructor (props, context) {
      super(props, context)

      const {services, stores, emit, router} = context;

      ['events', 'state', 'actions'].forEach(item => {
        const fn = ComposedComponent[item]

        if (typeof fn === 'function') {
          data[item] = fn(stores, services, {emit, router})
        } else if (fn) {
          data[item] = fn
        }
      })

      if (data.state) {
        data.state = observable(data.state)
      }

      Object.keys(data.actions).map(key => {
        const action = data.actions[key]

        data.actions[key] = (payload) => {
          if (typeof action === 'function') {
            publish('action', {
              name: key,
              data: payload
            })

            let result = action(data.state, data.actions, payload)

            if (result !== null && result.then === undefined) {
              data.state = Object.assign(data.state, publish('update', result))
            }

            return result
          }
        }
      })

      props = Object.assign({}, props, {
        state: data.state,
        actions: data.actions
      })

      this.customProps = {...props, services, stores, emit, router}
    }

    componentWillMount = () => {
      if (ComposedComponent.init) {
        const newProps = ComposedComponent.init(this.customProps)

        if (newProps) {
          this.customProps = newProps
        }
      }

      publish('create')
    }

    componentDidMount = () => {
      publish('insert')
    }

    componentWillUnmount = () => {
      publish('remove')
    }

    render () {
      const view = React.createElement(observer(ComposedComponent), this.customProps)

      return publish('render', view)
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
