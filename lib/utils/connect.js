import React, {Component} from 'react'
import PropTypes from 'prop-types'
import hoistStatics from 'hoist-non-react-statics'
import {observable} from 'mobx'
import {observer} from 'mobx-react'
import formize from './formize'

export default function connect(ComposedComponent) {
  const data = {
    state: {},
    events: {},
    actions: {}
  }

  class Connect extends Component {
    constructor(props, context) {
      super(props, context)

      const {services, stores, emit, router} = context

      ComposedComponent._actions = {...ComposedComponent.actions}

      data.events = ComposedComponent.events || {}
      data.state = ComposedComponent.state || {}
      data.actions = ComposedComponent.actions || {}

      if (typeof data.state === 'function') {
        data.state = data.state({props, stores})
      }

      if (data.state) {
        data.state = observable(data.state)
      }

      if (ComposedComponent.isConnected === undefined) {
        this.bindActions(data)
      }

      this.customProps = {
        ...props,
        state: data.state,
        actions: data.actions,
        services,
        stores,
        emit,
        router
      }
      this.customUnmodifiedProps = this.customProps
    }

    bindActions(data) {
      Object.keys(data.actions).forEach(key => {
        let action = data.actions[key]

        data.actions[key] = payload => {
          if (typeof action === 'function') {
            this.publish('action', {
              name: key,
              data: payload
            })

            let result = action(
              {
                state: data.state,
                actions: data.actions,
                ...this.customUnmodifiedProps
              },
              payload
            )

            const hasResult = result !== null && result !== undefined

            if (hasResult && result.then === undefined) {
              data.state = Object.assign(
                data.state,
                this.publish('update', result)
              )
            } else if (hasResult && result.then !== undefined) {
              result.then(res => {
                data.state = Object.assign(
                  data.state,
                  this.publish('update', res)
                )
              })
            }

            return result
          }
        }
      })
    }

    publish = (event, payload) => {
      if (data.events[event]) {
        const result = data.events[event](
          {
            state: data.state,
            actions: data.actions,
            ...this.customUnmodifiedProps
          },
          payload
        )

        return result === undefined ? payload : result
      }

      return payload
    }

    componentWillMount = () => {
      if (ComposedComponent.init) {
        const newProps = ComposedComponent.init(this.customProps)

        if (newProps) {
          this.customProps = newProps
        }
      }

      this.publish('create')
    }

    componentDidMount = () => {
      this.publish('insert')
    }

    componentWillUnmount = () => {
      ComposedComponent.isConnected = undefined
      ComposedComponent.actions = ComposedComponent._actions
      this.publish('remove')
    }

    render() {
      const View = observer(() => {
        this.publish('update')

        return this.publish(
          'render',
          React.createElement(observer(ComposedComponent), this.customProps)
        )
      })

      ComposedComponent.isConnected = true

      return <View />
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
