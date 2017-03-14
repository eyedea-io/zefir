import React, { PropTypes } from 'react'
import { Redirect, Route } from 'react-router-dom'
import connect from '../utils/connect'

const MatchAsGuest = ({
  redirectTo = '/dashboard',
  component: Component,
  store: { user: { isLoggedIn } },
  ...rest
}) => (
  <Route
    {...rest}
    render={props => (
      isLoggedIn ? (
        <Redirect
          to={{
            pathname: redirectTo,
            state: { from: props.location }
          }}
          />
      ) : (
        <Component {...props} />
      )
    )}
    />
)

MatchAsGuest.propTypes = {
  component: PropTypes.func.isRequired,
  store: PropTypes.object.isRequired,
  location: PropTypes.object,
  redirectTo: PropTypes.string
}

export default connect(MatchAsGuest)
