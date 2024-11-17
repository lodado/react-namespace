import { ProxyWrapper } from '../../utils'
import EventPublisher from '../EventPublisher'

export function createStateProxy<State extends Record<string | symbol, any>>(
  initialState: State,
  publisher: EventPublisher<State>,
) {
  const state = new ProxyWrapper(initialState, {
    get: (target, key) => {
      return target[key as keyof State]
    },
    set: (target, key, value) => {
      if (key in target) {
        const typedKey = key as keyof State

        if (target[typedKey] !== value) {
          target[typedKey] = value
          publisher.publish(typedKey, value)
        }

        return true
      }

      return false
    },
  })

  return state.getProxy()
}
