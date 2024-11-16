import { Listener } from './type'

export default class EventPublisher<State> {
  private listeners: Record<keyof State, Listener<State[keyof State]>[]> = {} as Record<
    keyof State,
    Listener<State[keyof State]>[]
  >

  subscribe<K extends keyof State>(key: K, listener: Listener<State[keyof State]>): () => void {
    if (!this.listeners[key]) {
      this.listeners[key] = []
    }
    this.listeners[key].push(listener)

    return () => {
      this.listeners[key] = this.listeners[key].filter((l) => l !== listener)
    }
  }

  publish<K extends keyof State>(key: K, value: State[K]): void {
    if (this.listeners[key]) {
      this.listeners[key].forEach((listener) => listener(value))
    }
  }
}
