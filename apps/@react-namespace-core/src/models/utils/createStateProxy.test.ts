import EventPublisher from '../EventPublisher'
import { createStateProxy } from './createStateProxy'

describe('StateProxy', () => {
  let eventPublisher: EventPublisher<{ count: number }>
  let stateProxy: ReturnType<typeof createStateProxy<{ count: number }>>

  beforeEach(() => {
    eventPublisher = new EventPublisher()
    stateProxy = createStateProxy({ count: 0 }, eventPublisher)
  })

  describe('as is: State with event subscription', () => {
    describe('when updating state', () => {
      it('should update the state and publish events correctly', () => {
        const listener = jest.fn()
        const unsubscribe = eventPublisher.subscribe('count', listener)

        // Initial state
        expect(stateProxy.count).toBe(0)

        // Update state
        stateProxy.count = 10
        expect(stateProxy.count).toBe(10)
        expect(listener).toHaveBeenCalledWith(10)

        // Update state again
        stateProxy.count = 20
        expect(stateProxy.count).toBe(20)
        expect(listener).toHaveBeenCalledWith(20)

        // Unsubscribe listener
        unsubscribe()

        // Update state after unsubscribe
        stateProxy.count = 30
        expect(stateProxy.count).toBe(30)
        expect(listener).toHaveBeenCalledTimes(2) // Listener should not be called again
      })
    })
  })

  describe('as is: State with invalid key update attempts', () => {
    describe('when updating a non-existing key', () => {
      it('should not update the state and not publish events', () => {
        const listener = jest.fn()
        eventPublisher.subscribe('count', listener)

        // Try to update non-existing key
        try {
          // @ts-ignore
          stateProxy.state?.otherKey = 'value'
        } catch (error) {
          // Handle the error here or make assertions about the error
        }

        // @ts-ignore
        expect(stateProxy.state?.otherKey).toBeUndefined()
        expect(listener).not.toHaveBeenCalled()
      })
    })
  })
})
