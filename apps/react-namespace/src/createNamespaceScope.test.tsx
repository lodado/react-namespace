import { NamespaceStore } from '@lodado/namespace-core'
import { fireEvent, render, screen } from '@testing-library/react'
import React, { PropsWithChildren } from 'react'

import { createNamespaceScope } from './createNamespaceScope'

// Mocked Store for Testing
class Counter extends NamespaceStore<{ count: number }> {
  constructor(count = 0) {
    super({ count })
  }

  increment() {
    this.state.count += 1
  }

  decrement() {
    this.state.count -= 1
  }
}

describe('createNamespaceScope', () => {
  const [createTestContext, createTestScope] = createNamespaceScope('TestScope')

  const { Provider: TestProvider, useNamespaceStores: useTestNamespaceStore } = createTestContext('TestScope', {
    localStore: () => new Counter(0),
  })

  const TestComponent = ({ scope }: { scope: any }) => {
    const { count, increment } = useTestNamespaceStore((state) => ({ count: state.count }), scope)

    return (
      <div>
        <span data-testid="count">{count}</span>
        <button type="button" onClick={increment} data-testid="increment-button">
          Increment
        </button>
      </div>
    )
  }

  describe('when creating a namespace scope', () => {
    describe('as-is: initial state of the store', () => {
      const App = () => {
        const scope = createTestScope()({})

        return (
          <TestProvider scope={scope.__scopeTestScope}>
            <TestComponent scope={scope.__scopeTestScope} />
          </TestProvider>
        )
      }

      it('to-be: should provide the initial state and allow updates', () => {
        render(<App />)

        // Verify initial state
        expect(screen.getByTestId('count').textContent).toBe('0')

        // Increment and verify updated state
        fireEvent.click(screen.getByTestId('increment-button'))
        expect(screen.getByTestId('count').textContent).toBe('1')
      })
    })
  })

  describe('when overwriting the store instance', () => {
    describe('as-is: store initialized with a custom value', () => {
      const OverwrittenApp = () => {
        const scope = createTestScope()({})
        return (
          <TestProvider overwriteStore={() => new Counter(100)} scope={scope.__scopeTestScope}>
            <TestComponent scope={scope.__scopeTestScope} />
          </TestProvider>
        )
      }

      it('to-be: should use the overwritten store instance', () => {
        render(<OverwrittenApp />)

        // Verify overwritten initial state
        expect(screen.getByTestId('count').textContent).toBe('100')

        // Increment and verify updated state
        fireEvent.click(screen.getByTestId('increment-button'))
        expect(screen.getByTestId('count').textContent).toBe('101')
      })
    })
  })

  describe('when using multiple scopes **important!**', () => {
    describe('as-is: isolated scopes initialized separately', () => {
      const MultiScopeApp = () => {
        const scope1 = createTestScope()({})
        const scope2 = createTestScope()({})

        return (
          <>
            <TestProvider scope={scope1.__scopeTestScope}>
              <TestProvider scope={scope2.__scopeTestScope}>
                <TestComponent scope={scope1.__scopeTestScope} />
                <TestComponent scope={scope2.__scopeTestScope} />
              </TestProvider>
            </TestProvider>
          </>
        )
      }

      it('to-be: should isolate states between scopes', () => {
        render(<MultiScopeApp />)

        const buttons = screen.getAllByTestId('increment-button')
        const counts = screen.getAllByTestId('count')

        // Verify initial states
        expect(counts[0].textContent).toBe('0')
        expect(counts[1].textContent).toBe('0')

        // Increment only the first scope
        fireEvent.click(buttons[0])
        expect(counts[0].textContent).toBe('1')
        expect(counts[1].textContent).toBe('0')
      })
    })
  })
})
