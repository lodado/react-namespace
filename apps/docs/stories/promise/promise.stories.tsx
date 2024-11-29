import { NamespaceStore } from '@lodado/namespace-core'
import { createNamespaceContext } from '@lodado/react-namespace'
import { Meta } from '@storybook/react'
import { Suspense } from 'react'

const meta: Meta = {
  title: 'promise/suspenseTest',

  tags: ['autodocs'],
}

export default meta

class TestStore extends NamespaceStore<{ asyncCount: Promise<number> }> {
  constructor() {
    super({
      asyncCount: new Promise((resolve) => {
        setTimeout(() => resolve(5), 1100)
      }),
    })
  }

  async updateCount() {
    this.state.asyncCount = new Promise((resolve) => {
      setTimeout(() => resolve(10), 1100)
    })
  }
}

const { Provider, useNamespaceStores } = createNamespaceContext({
  localStore: () => new TestStore(),
})

const TestComponent = () => {
  const { asyncCount, updateCount } = useNamespaceStores((state) => ({
    asyncCount: state.asyncCount,
  }))

  return (
    <div data-testid="count-value">
      Count: {asyncCount}
      <button type="button" onClick={updateCount}>
        button
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
