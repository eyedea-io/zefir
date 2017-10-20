# Documentation

- Getting Started
  - [Installation](#installation)
  - [Commands](#commands)
  - [Connected Components](#connected-components)
- Concepts
  - [Stores](/docs/stores.md)
  - [Actions](/docs/actions.md)
  - [Events](/docs/events.md)
  - [Routing](/docs/routing.md)
  - [Stateful Components](/docs/stateful-components.md)
  - [Manage document head](/docs/manage-document-head.md)
  - [Forms](/docs/forms.md)
  
## Installation

```sh
yarn add zefir react react-dom mobx mobx-react
```

```sh
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
* it can become stateful component with `actions`, `events` and `state` properties

To connect component, use `connect` function:

```js
import {connect} from 'zefir/utils'

const Hello = ({router}) => (
  <div>World. Location: {router.route.match.href}</div>
)

export default connect(Hello)
```


