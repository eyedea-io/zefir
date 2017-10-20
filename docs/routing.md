## Routing 

Routing is based on [React Router](https://reacttraining.com/react-router/web/guides/quick-start). Entry point of your application is `src/index.js`. Router components can be imported from `zefir/router`.

```js
import {
  Match, Switch, Link, NavLink, Redirect, Prompt
} from 'zefir/router'

const Routes = () => (
  <Switch>
    <Match path='/' exact component={LandingView} />
    <Match path='/dashboard'>
      Dashboard view
      
      <Match path='/dashboard/settings' exact>
        Settings sub view.
        <Link to='/dashboard'>Back to dashboard</Link>
      </Match>
    </Match>
    <Match component={MissingView} />
  </Switch>
)

export default Routes
```

**Define custom match** 

```js
import {defineMatch} from 'zefir/router'

const isGuest = ({stores}) => !stores.auth.isLoggedIn
const MatchAsGuest = defineMatch(isGuest)

const isMember = ({stores}) => stores.auth.isLoggedIn
const MatchAsMember = defineMatch(isMember)

const Page = () => (
  <div>
    <MatchAsGuest>
      <a>Sign in</a>
    </MatchAsGuest>
    
    <MatchAsMember>
      <a>Sign out</a>
    </MatchAsMember>
  </div>
)
```
