import { deepClone } from '../utils'
import EventPublisher from './EventPublisher'
import { Listener } from './type'
import { createContinuablePromise, createStateProxy, isPromiseLike, use } from './utils'

export default class NamespaceStore<State extends Record<string | symbol, any>> {
  /**
   * Open access permission, but must be used with awareness of how to use it
   */
  public state: ReturnType<typeof createStateProxy<State>>

  protected initState: State

  private publisher: EventPublisher<State>

  constructor(initialState: State) {
    this.initState = deepClone(initialState)

    this.publisher = new EventPublisher<State>()
    this.state = createStateProxy(initialState, this.publisher)
  }

  reset() {
    const deepCopiedState = deepClone(this.initState)

    Object.keys(deepCopiedState).forEach((key) => {
      this.state[key as keyof State] = deepCopiedState[key]
    })
  }

  setState<K extends keyof State>(key: K, value: State[K]) {
    // eslint-disable-next-line eqeqeq
    if (this.state[key] == undefined) {
      throw new Error(`Key does not exist in state`)
    }

    if (this.state?.[key] !== value) {
      this.state[key] = value
    }
  }

  getState<K extends keyof State>(key: K) {
    const value = this.state[key]

    if (isPromiseLike(value)) {
      return use(createContinuablePromise(value))
    }

    return value
  }

  subscribe<K extends keyof State>(key: K, listener: Listener<State[keyof State]>): () => void {
    return this.publisher.subscribe(key, listener)
  }

  publish(key: keyof State, value: State[keyof State]): void {
    this.publisher.publish(key, value)
  }
}
