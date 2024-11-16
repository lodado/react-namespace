import EventPublisher from './EventPublisher'

describe('EventPublisher', () => {
  let eventPublisher: EventPublisher<{ count: number }>

  beforeEach(() => {
    eventPublisher = new EventPublisher()
  })

  it('should subscribe and publish events correctly', () => {
    const listener = jest.fn()
    const unsubscribe = eventPublisher.subscribe('count', listener)

    eventPublisher.publish('count', 10)
    eventPublisher.publish('count', 20)

    expect(listener).toHaveBeenCalledTimes(2)
    expect(listener).toHaveBeenCalledWith(10)
    expect(listener).toHaveBeenCalledWith(20)

    unsubscribe()

    eventPublisher.publish('count', 30)

    expect(listener).toHaveBeenCalledTimes(2)
  })

  it('should not call listeners for non-subscribed keys', () => {
    const listener = jest.fn()
    eventPublisher.subscribe('count', listener)

    // @ts-ignore
    eventPublisher.publish('otherKey', 'value')

    expect(listener).not.toHaveBeenCalled()
  })
})
