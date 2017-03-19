import {Route, Switch, Link} from 'react-router-dom'
import {connect} from '../utils'

const Match = function ({
  component,
  ...rest
}) {
  return <Route {...rest} component={connect(component)} />
}

export {default as MatchAsMember} from './match-as-member'
export {default as MatchAsGuest} from './match-as-guest'
export {Switch, Link, Match}
