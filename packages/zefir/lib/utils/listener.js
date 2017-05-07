import {action} from 'mobx'

export function emit (listeners, event, payload) {
  listeners.forEach(listener => {
    if (listener.event === event) {
      listener.handler(payload)
    }
  })
}

export function when (event, index = 1) {
  return function (object, name) {
    if (!Array.isArray(object._whenable)) {
      object._whenable = []
    }

    if (Array.isArray(event)) {
      event.forEach(event => {
        object._whenable.push({
          event,
          index,
          handler: action(object[name])
        })
      })
    } else {
      object._whenable.push({
        event,
        index,
        handler: action(object[name])
      })
    }
  }
}
