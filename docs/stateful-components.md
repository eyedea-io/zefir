## Stateful components

**State**

State is object that represents your component data model. 

```jsx
import {connect} from 'zefir/utils'

const Toggle = ({state}) => 
  <div>Toggle is {state.active} active</div>

Toggle.state = {
  active: 'not'
}

export default connect(Toggle)
```

State doesn't have access to global stores, services or router.

**Actions**

Use actions to update component state. To be able to update the state, an action must return a new state or a part of it.

```jsx
import {connect} from 'zefir/utils'

const Counter = ({state, actions}) => 
  <div>
    <div>Count: {state.count}</div>

    <button onClick={actions.inc}>Increment</button>
    <button onClick={actions.dec}>Decrement</button>
  </div>

Counter.state = {
  count: 0
}

Counter.actions = {
  inc: ({state}) => ({count: state.count + 1}),
  dec: ({state}) => ({count: state.count - 1})
}

export default connect(Counter)
```

You can pass data to actions as well.

```jsx
import {connect} from 'zefir/utils'

const Counter = ({state, actions}) => 
  <div>
    <div>Count: {state.count}</div>

    <button onClick={() => actions.inc(3)}>Increment</button>
    <button onClick={() => actions.dec(2)}>Decrement</button>
  </div>

Counter.state = {
  count: 0
}

Counter.actions = {
  inc: ({state}, payload = 1) => ({count: state.count + payload}),
  dec: ({state}, payload = 1) => ({count: state.count - payload})
}

export default connect(Counter)
```

Actions also have access to global stores, services, router and event emmiter.

```jsx
Counter.actions = () => ({
  inc: ({state, actions, stores, services, router, emit}, payload = 0) => 
    ({count: state.count + data}),
  dec: ({state, actions, stores, services, router, emit}, payload = 0) => 
    ({count: state.count - data})
})
```

**Events**

Use events to get notified when your app is initialized, an action is called, before a view is rendered, etc.

```jsx
import {connect} from 'zefir/utils'

const Counter = ({state, actions}) => 
  <div>Hello world</div>

Counter.events = {
  render: () => console.log('component was rendered')
}

export default connect(Counter)
```

Events also have access to global stores, services and router.

```jsx
Counter.events = ({state, actions, stores, services, router, emit}) => ({
  render: () => console.log('component was rendered')
})
```

Available events:

`create` 

(state, actions)

The create event is fired when component is initialized but not yet inserted into DOM. This is a good place to call actions, access localStorage, etc.

`insert` 

(state, actions)

The insert event is fired when component is inserted into DOM.

`action` 

(state, actions, payload): data

* payload
  * name: the name of the action
  * data: the date pased to the action

The action event is fired before an action is called.

`update` 

(state, actions): data

The update event is fired before the state is updated.

`remove` 

(state, actions): data

The remove event is fired before component is umounted from DOM.

`render` 

(state, actions, view): view

The render event is fired before the view is render. You can use this to change the rendered view.
