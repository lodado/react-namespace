import NamespaceStore from './NamespaceStore'

describe('NamespaceStore', () => {
  let namespaceStore: NamespaceStore<{ count: number }>

  beforeEach(() => {
    namespaceStore = new NamespaceStore({ count: 0 })
  })

  describe('as is: State management', () => {
    describe('when setting and getting state', () => {
      it('should return the correct state value', () => {
        const count = 10
        namespaceStore.setState('count', count)
        const result = namespaceStore.getState('count')

        expect(result).toBe(count)
      })
    })

    describe('when subscribing to a key and updating state', () => {
      it('should notify listeners with the updated state', () => {
        const listener = jest.fn()
        const unsubscribe = namespaceStore.subscribe('count', listener)

        namespaceStore.setState('count', 10)
        namespaceStore.setState('count', 20)

        expect(listener).toHaveBeenCalledTimes(2)
        expect(listener).toHaveBeenCalledWith(10)
        expect(listener).toHaveBeenCalledWith(20)

        unsubscribe()

        namespaceStore.setState('count', 30)

        expect(listener).toHaveBeenCalledTimes(2) // Listener should not be called after unsubscribe
      })
    })

    describe('when attempting to update a non-existent key', () => {
      it('should throw an error and not call listeners', () => {
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

describe('(inherited) Counter class', () => {
  let counter: Counter

  beforeEach(() => {
    counter = new Counter(0)
  })

  describe('as is: Counter behavior', () => {
    describe('when initialized', () => {
      it('should set the initial count', () => {
        expect(counter.state.count).toBe(0)
      })
    })

    describe('when incrementing count', () => {
      it('should increase the count and notify listeners', () => {
        const listener = jest.fn()
        counter.subscribe('count', listener)

        counter.increment()
        expect(counter.state.count).toBe(1)
        expect(listener).toHaveBeenCalledWith(1)
        expect(listener).toHaveBeenCalledTimes(1)
      })
    })

    describe('when decrementing count', () => {
      it('should decrease the count and notify listeners', () => {
        const listener = jest.fn()
        counter.subscribe('count', listener)

        counter.decrement()
        expect(counter.state.count).toBe(-1)
        expect(listener).toHaveBeenCalledWith(-1)
        expect(listener).toHaveBeenCalledTimes(1)
      })
    })

    describe('when unsubscribing from events', () => {
      it('should stop notifying listeners after unsubscribe', () => {
        const listener = jest.fn()
        const unsubscribe = counter.subscribe('count', listener)

        expect(counter.state.count).toBe(0)

        unsubscribe()

        counter.increment()
        expect(counter.state.count).toBe(1)
        expect(listener).toHaveBeenCalledTimes(0)
      })
    })
  })
})
