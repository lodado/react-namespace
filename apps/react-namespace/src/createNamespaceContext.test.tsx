import { NamespaceStore } from '@lodado/namespace-core'
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'

import { createNamespaceContext } from './createNamespaceContext'

// Define a test-specific NamespaceStore class
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

// Create a context with the TestStore
const { Provider, useNamespaceStores, useNamespaceAction } = createNamespaceContext({
  localStore: () => new TestStore(),
})

// Define a test component
const TestComponent = () => {
  const { count } = useNamespaceStores((state) => ({ count: state.count }))
  const { increment, decrement } = useNamespaceAction()

  return (
    <div>
      <p data-testid="count-value">Count: {count}</p>
      <button type="button" data-testid="increment-button" onClick={increment}>
        Increment
      </button>
      <button type="button" data-testid="decrement-button" onClick={decrement}>
        Decrement
      </button>
    </div>
  )
}

// Test the rendering and interaction of the component
describe('TestComponent with NamespaceContext', () => {
  describe('Rendering and initial state', () => {
    it('should render with the initial state', () => {
      render(
        <Provider>
          <TestComponent />
        </Provider>,
      )

      const countValue = screen.getByTestId('count-value')
      expect(countValue).toHaveTextContent('Count: 0')
    })
  })

  describe('Increment actions', () => {
    it('should increment the count once', () => {
      render(
        <Provider>
          <TestComponent />
        </Provider>,
      )

      const countValue = screen.getByTestId('count-value')
      const incrementButton = screen.getByTestId('increment-button')

      fireEvent.click(incrementButton)
      expect(countValue).toHaveTextContent('Count: 1')
    })

    it('should increment the count multiple times', () => {
      render(
        <Provider>
          <TestComponent />
        </Provider>,
      )

      const countValue = screen.getByTestId('count-value')
      const incrementButton = screen.getByTestId('increment-button')

      fireEvent.click(incrementButton)
      fireEvent.click(incrementButton)
      fireEvent.click(incrementButton)
      expect(countValue).toHaveTextContent('Count: 3')
    })
  })

  describe('Decrement actions', () => {
    it('should decrement the count once', () => {
      render(
        <Provider>
          <TestComponent />
        </Provider>,
      )

      const countValue = screen.getByTestId('count-value')
      const incrementButton = screen.getByTestId('increment-button')
      const decrementButton = screen.getByTestId('decrement-button')

      // Start from count 1
      fireEvent.click(incrementButton)
      fireEvent.click(decrementButton)
      expect(countValue).toHaveTextContent('Count: 0')
    })

    it('should decrement the count multiple times', () => {
      render(
        <Provider>
          <TestComponent />
        </Provider>,
      )

      const countValue = screen.getByTestId('count-value')
      const decrementButton = screen.getByTestId('decrement-button')

      fireEvent.click(decrementButton)
      fireEvent.click(decrementButton)
      expect(countValue).toHaveTextContent('Count: -2')
    })
  })

  describe('Combined actions', () => {
    it('should increment and decrement the count in sequence', () => {
      render(
        <Provider>
          <TestComponent />
        </Provider>,
      )

      const countValue = screen.getByTestId('count-value')
      const incrementButton = screen.getByTestId('increment-button')
      const decrementButton = screen.getByTestId('decrement-button')

      fireEvent.click(incrementButton)
      fireEvent.click(incrementButton)
      fireEvent.click(decrementButton)
      fireEvent.click(incrementButton)
      expect(countValue).toHaveTextContent('Count: 2')
    })
  })

  describe('Error handling (without Provider)', () => {
    it('should throw an error when used without a Provider', () => {
      const TestComponentWithoutProvider = () => {
        expect(() => {
          render(<TestComponent />)
        }).toThrow('useStores must be used within a Provider')
      }
    })
  })
})