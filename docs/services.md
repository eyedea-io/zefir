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
