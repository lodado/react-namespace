import EventPublisher from './EventPublisher'

describe('EventPublisher', () => {
  let eventPublisher: EventPublisher<{ count: number }>

  beforeEach(() => {
    eventPublisher = new EventPublisher()
  })

  describe('as is: Event subscription and publication', () => {
    describe('when subscribing to a key and publishing events', () => {
      it('should notify the listener with the published values', () => {
        const listener = jest.fn()
        const unsubscribe = eventPublisher.subscribe('count', listener)

        eventPublisher.publish('count', 10)
        eventPublisher.publish('count', 20)

        expect(listener).toHaveBeenCalledTimes(2)
        expect(listener).toHaveBeenCalledWith(10)
        expect(listener).toHaveBeenCalledWith(20)

        unsubscribe()

        eventPublisher.publish('count', 30)

        expect(listener).toHaveBeenCalledTimes(2) // Listener should not be called after unsubscribe
      })
    })

    describe('when publishing events to a non-subscribed key', () => {
      it('should not call listeners for the key', () => {
        const listener = jest.fn()
        eventPublisher.subscribe('count', listener)

        // Publishing to a different key
        // @ts-ignore
        eventPublisher.publish('otherKey', 'value')

        expect(listener).not.toHaveBeenCalled()
      })
    })
  })
})
