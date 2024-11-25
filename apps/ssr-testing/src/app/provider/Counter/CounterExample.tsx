'use client'

import { NamespaceStore } from '@lodado/namespace-core'
import { createNamespaceContext } from '@lodado/react-namespace'
import React from 'react'

class TestStore extends NamespaceStore<{ count: number }> {
  constructor() {
    super({ count: 0 })
  }

  increment() {
    this.state.count += 1
  }

  decrement() {
    this.state.count -= 1
  }
}

const { Provider, useNamespaceStores, useNamespaceAction } = createNamespaceContext({
  localStore: () => new TestStore(),
})

export const TestComponent = () => {
  const { count } = useNamespaceStores((state) => ({ count: state.count }))
  const { increment, decrement, reset } = useNamespaceAction()

  return (
    <div>
      <p data-testid="count-value">Count: {count}</p>
      <button type="button" data-testid="reset-button" onClick={reset}>
        Reset
      </button>
      <button type="button" data-testid="increment-button" onClick={increment}>
        Increment
      </button>
      <button type="button" data-testid="decrement-button" onClick={decrement}>
        Decrement
      </button>
    </div>
  )
}

export const TestComponentWithProvider = () => (
  <Provider overwriteStore={() => new TestStore()}>
    <TestComponent />
  </Provider>
)
