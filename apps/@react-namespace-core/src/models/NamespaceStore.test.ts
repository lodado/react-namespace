import NamespaceStore from './NamespaceStore'

describe('NamespaceStore', () => {
  let namespaceStore: NamespaceStore<{ count: number }>

  beforeEach(() => {
    namespaceStore = new NamespaceStore({ count: 0 })
  })

  it('should set and get state correctly', () => {
    const count = 10
    namespaceStore.setState('count', count)
    const result = namespaceStore.getState('count')

    expect(result).toBe(count)
  })

  it('should subscribe and publish events correctly', () => {
    const listener = jest.fn()
    const unsubscribe = namespaceStore.subscribe('count', listener)
    namespaceStore.setState('count', 10)
    namespaceStore.setState('count', 20)

    expect(listener).toHaveBeenCalledTimes(2)
    expect(listener).toHaveBeenCalledWith(10)
    expect(listener).toHaveBeenCalledWith(20)

    unsubscribe()

    namespaceStore.setState('count', 30)

    expect(listener).toHaveBeenCalledTimes(2)
  })

  it('should not call listeners for non-subscribed keys', () => {
    const listener = jest.fn()
    namespaceStore.subscribe('count', listener)
    let errorFlag = false

    try {
      // @ts-ignore
      namespaceStore.setState('otherKey', 'value')
    } catch (error) {
      expect(error).toBeDefined()
      errorFlag = true
    }

    expect(listener).not.toHaveBeenCalled()
    expect(errorFlag).toBe(true)
  })
})

class Counter extends NamespaceStore<{ count: number }> {
  constructor(initialCount: number) {
    super({ count: initialCount })
  }

  increment() {
    this.state.count += 1
  }

  decrement() {
    this.state.count -= 1
  }

  getCount() {
    return this.state.count
  }
}

describe('(inherited) Counter class example', () => {
  let counter: Counter

  beforeEach(() => {
    counter = new Counter(0)
  })

  it('should initialize with initial count', () => {
    expect(counter.state.count).toBe(0)
  })

  it('should increment count correctly', () => {
    const listener = jest.fn()
    counter.subscribe('count', listener)

    counter.increment()
    expect(counter.state.count).toBe(1)

    expect(listener).toHaveBeenCalledWith(1)
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('should decrement count correctly', () => {
    const listener = jest.fn()
    counter.subscribe('count', listener)

    counter.decrement()
    expect(counter.state.count).toBe(-1)

    expect(listener).toHaveBeenCalledWith(-1)
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('should unsubscribe and stop receiving events', () => {
    const listener = jest.fn()
    const unsubscribe = counter.subscribe('count', listener)

    expect(counter.state.count).toBe(0)

    unsubscribe()

    counter.increment()
    expect(counter.state.count).toBe(1)
    expect(listener).toHaveBeenCalledTimes(0)
  })
})
