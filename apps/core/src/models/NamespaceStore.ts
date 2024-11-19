import EventPublisher from './EventPublisher'
import { Listener } from './type'
import { createStateProxy } from './utils/createStateProxy'

export default class NamespaceStore<State extends Record<string | symbol, any>> {
  /**
   * Open access permission, but must be used with awareness of how to use it
   */
  public state: ReturnType<typeof createStateProxy<State>>

  protected initState: State

  private publisher: EventPublisher<State>

  constructor(initialState: State) {
    this.publisher = new EventPublisher<State>()
    this.state = createStateProxy(initialState, this.publisher)

    this.initState = { ...initialState }
  }

  reset() {
    Object.keys(this.initState).forEach((key) => {
      this.state[key as keyof State] = this.initState[key]
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

  getState<K extends keyof State>(key: K): State[K] {
    return this.state[key]
  }

  subscribe<K extends keyof State>(key: K, listener: Listener<State[keyof State]>): () => void {
    return this.publisher.subscribe(key, listener)
  }
}