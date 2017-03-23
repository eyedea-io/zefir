import React from 'react'
import {Route, Switch, Link, NavLink, Prompt} from 'react-router-dom'
import {connect} from '../utils'

const Match = function ({
  component,
  ...rest
}) {
  return <Route {...rest} component={connect(component)} />
}

export {default as defineMatch} from './define-match'
export {Route, Switch, Link, Match, NavLink, Prompt}
