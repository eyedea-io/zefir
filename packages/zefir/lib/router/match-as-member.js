import React, { PropTypes } from 'react'
import { Redirect, Route } from 'react-router-dom'
import connect from '../utils/connect'

const MatchAsMember = ({
  redirectTo = '/',
  component: Component,
  store: { user: { isLoggedIn } },
  path,
  exact
}) => {
  return (
    <Route
      path={path}
      exact={exact}
      render={props => {
        return isLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: redirectTo,
              state: { from: props.location }
            }}
            />
        )
      }}
      />
  )
}

MatchAsMember.propTypes = {
  path: PropTypes.string,
  exact: PropTypes.bool,
  component: PropTypes.func.isRequired,
  store: PropTypes.object.isRequired,
  location: PropTypes.object,
  redirectTo: PropTypes.string
}

export default connect(MatchAsMember)
