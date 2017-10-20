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
