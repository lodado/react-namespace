import { NamespaceStore } from '@lodado/namespace-core'
import { act, render, screen } from '@testing-library/react'
import React, { Suspense } from 'react'

import { createNamespaceContext } from './createNamespaceContext'

jest.useFakeTimers()

class TestStore extends NamespaceStore<{ asyncCount: number | Promise<number> }> {
  constructor() {
    super({
      asyncCount: new Promise((resolve) => {
        setTimeout(() => resolve(5), 400)
      }),
    })
  }

  async updateCount() {
    this.state.asyncCount = new Promise((resolve) => {
      setTimeout(() => resolve(10), 400)
    })
  }
}

describe('Suspense with NamespaceContext', () => {
  const { Provider, useNamespaceStores } = createNamespaceContext({
    localStore: () => new TestStore(),
  })

  const TestComponent = () => {
    const { asyncCount } = useNamespaceStores((state) => ({
      asyncCount: state.asyncCount,
    }))

    return <div data-testid="count-value">Count: {asyncCount}</div>
  }

  it('should show fallback while loading and render resolved value', async () => {
    render(
      <Provider>
        <Suspense fallback={<div data-testid="loading">Loading...</div>}>
          <TestComponent />
        </Suspense>
      </Provider>,
    )

    // Fallback should be displayed initially
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading...')

    act(() => {
      jest.advanceTimersByTime(500)
    })

    // Wait for the Promise to resolve and check the rendered value
    const countValue = await screen.findByTestId('count-value')
    expect(countValue).toHaveTextContent('Count: 5')
  })
})
