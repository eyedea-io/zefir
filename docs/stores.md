## Stores

Store is source of data. Zefir uses [MobX](https://mobx.js.org/) to make that data reactive.

**Creating stores**

Every file in `src/**` directory ending with `.store.js` is accessible by every `connected component`. Go to [Connected Components](/docs/README.md#connected-components) to learn more.

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
