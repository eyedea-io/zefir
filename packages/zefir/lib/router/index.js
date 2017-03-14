import {connect} from '../utils'
import {Route} from 'react-router-dom'

const Match = function ({
  component,
  ...rest
}) {
  return <Route {...rest} component={connect(component)} />
}

export {default as MatchAsMember} from './match-as-member'
export {default as MatchAsGuest} from './match-as-guest'
export {Switch} from 'react-router-dom'
export {Match}
