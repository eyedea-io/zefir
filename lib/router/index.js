import React from 'react'
import {Route, Switch, Link, NavLink, Redirect, Prompt} from 'react-router-dom'
import {connect} from '../utils'

const Match = function({children, component, ...rest}) {
  const ConnectedRoute = connect(Route)
  const renderable = children
    ? () => {
        if (Array.isArray(children)) {
          return <div>{children}</div>
        }

        return children
      }
    : component
  return <ConnectedRoute {...rest} component={connect(renderable)} />
}

export {default as defineMatch} from './define-match'
export {Route, Switch, Link, Match, NavLink, Redirect, Prompt}
