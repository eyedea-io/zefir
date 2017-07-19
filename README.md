# Zefir

## Getting started 

```
yarn add zefir@beta react react-dom mobx mobx-react

./node_modules/zefir/dist/bin/zefir init
```

## Commands

* **zefir dev** - run your project in dev mode. Accessible via http://localhost:3000
* **zefir build** - create production ready build
* **zefir start** - serve your build 
* **zefir init** - bootstrap project structure

## Connected Components

Connected Component is component infused with zefir magic:

* has access to stores, services & router
* observe stores for changes and rerender only when needed
* handles `init` property as place for side-effects and actions
* with `form` property you can easily build your form fields

To connect component, use `connect` function:

```js
import {connect} from 'zefir/utils'

const Hello = ({router}) => (
  <div>World. Location: {router.route.match.href}</div>
)

export default connect(Hello)
```

## Stores

Store is source of data. Zefir uses [MobX](https://mobx.js.org/) to make that data reactive.

**Creating stores**

Every file in `src/**` directory ending with `.store.js` is accessible by every `connected component`. Go to [Connected Components](#connected-components) to learn more. 

```js
// tasks.store.js
import {observable} from 'mobx'

export default observable({
  items: []
})
```

**Accessing stores in Components**

```js
// task-list.js
import {connect} from 'zefir/utils'

const TaskList = ({
  stores: {
    tasks: {items, selectedTask},
    user: {isLoggedIn}
  }
}) => (
  <ul className='TaskList'>
    {items.map(item => (
      <div>{item.name}</div>
    ))}
  </ul>
)

export default connect(TaskList)
```


## Services
Service is a class containing actions that operate on stores.

**Creating services**

Every file in `src/**` directory ending with `.service.js` is accessible by every `connected` component. Go to [Connected Components](#connected-components) to learn more. 

```js
// tasks.service.js
import {action} from 'mobx'

export default class Tasks {
  @action.bound async getTasks () {
    const {data} = await axios.get('https://example.url/data')
    
    this.stores.tasks.items = data
  }
}
```

**Accessing services in components**

```js
// task-list.js
import {connect} from 'zefir/utils'

const TaskList = ({
  stores: {tasks: {items}}
  services: {tasks}
}) => (
  <ul className='TaskList'>
    {items.map(item => (
      <div onClick={() => tasks.select(item.id)}>
        {item.name}
      </div>
    ))}
  </ul>
)

TaskList.init = ({
  services: {tasks}
}) => {
  tasks.getTasks()
}

export default connect(TaskList)
```

**Accessing stores in service**

If you have store and service sharing name, for example `tasks.store.js` and `tasks.service.js` then in that service you can access `tasks.store.js` by `this.store`:

```js
// tasks.service.js
import {action} from 'mobx'
 
export default class Tasks {
  @action.bound select (item) {
    this.store.selected = item
  }
}
```

All stores are accessible by `this.stores`:

```js
// tasks.service.js
import {action} from 'mobx'
 
export default class Tasks {
  @action.bound select (item) {
    // This will give us the same result as previous example
    this.stores.tasks.selected = item
  }
}
```

**Accessing other services in service**

Other services can be accessed by `this.services`:

```js
// tasks.service.js
import {action} from 'mobx'
 
export default class Auth {
  @action.bound logout () {
    this.store.loggedIn = false
    this.services.analytics.trigger('logged out')
  }
}
```

## Manage document head

```js
import Head from 'zefir/head'

const Landing = () => (
  <div>
    <Head>
      <title>My awesome page title</title>
      <link href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700' rel='stylesheet' />
    </Head>
  </div>
)

export default Landing
```

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

## Events

Services can communicate between each other via `this.services` available in service class or events. Here's how to emit an event:

```js
// auth.service.js
export default class {
  @action.bound async login ({email}) {
    // method logic...
    this.emit('logged-in', {email})
  }
}
```

In other services you can setup listener

```js
// user.service.js
import {when} from 'zefir/utils'

export default class {
  @when('logged-in')
  @action.bound async fetchProfile ({email}) {
    // method logic...
  }
}
```
