'use client'

import { NamespaceStore } from '@lodado/namespace-core'
import { createNamespaceContext } from '@lodado/react-namespace'
import React, { Suspense } from 'react'

class TestStore extends NamespaceStore<{ asyncCount: number | Promise<number> }> {
  constructor() {
    super({
      asyncCount: new Promise((resolve) => {
        setTimeout(() => resolve(1), 1100)
      }),
    })
  }

  async increment() {
    this.state.asyncCount = (await this.state.asyncCount) + 1
  }

  async decrement() {
    this.state.asyncCount = (await this.state.asyncCount) - 1
  }
}

const { Provider, useNamespaceStores } = createNamespaceContext({
  localStore: () => new TestStore(),
})

const TestComponent = () => {
  const { asyncCount, increment, decrement, reset } = useNamespaceStores((state) => ({
    asyncCount: state.asyncCount,
  }))

  const [a, setA] = React.useState(0)

  return (
    <div>
      {a}
      <p data-testid="count-value">Count: {asyncCount}</p>
      <button type="button" data-testid="reset-button" onClick={reset}>
        Reset
      </button>
      <button
        type="button"
        data-testid="increment-button"
        onClick={() => {
          increment()
          setA(a + 1)
        }}
      >
        Increment
      </button>
      <button type="button" data-testid="decrement-button" onClick={decrement}>
        Decrement
      </button>
    </div>
  )
}

export const SuspenseWithNamespaceContext = () => {
  return (
    <Provider>
      <Suspense fallback={<div data-testid="loading">Loading...</div>}>
        <TestComponent />
      </Suspense>
    </Provider>
  )
}
