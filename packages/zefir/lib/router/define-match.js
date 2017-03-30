import React from 'react'
import {Redirect, Route} from 'react-router-dom'
import connect from '../utils/connect'

const defineMatch = (shouldRender) => {
  const DefinedMatch = ({
    component,
    exact,
    path,
    ...rest
  }) => {
    const ConnectedRoute = connect(Route)

    return (
      <ConnectedRoute
        path={path}
        exact={exact}
        render={props => (
          shouldRender(rest)
            ? renderComponent(component, props)
            : rest.redirect
            ? renderRedirect(rest.redirect, props.location)
            : null
        )}
        />
    )
  }

  return connect(DefinedMatch)
}

function renderRedirect (pathname, from) {
  return (
    <Redirect to={{pathname, state: {from}}} />
  )
}

function renderComponent (component, {history, location, match, ...props}) {
  const Component = connect(component)

  return (
    <Component {...props} />
  )
}

export default defineMatch
