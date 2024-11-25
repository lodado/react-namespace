'use client'

import { NamespaceStore } from '@lodado/namespace-core'
import { createNamespaceScope } from '@lodado/react-namespace'
import React from 'react'

class TestStore extends NamespaceStore<{ count: number }> {
  constructor({ count }: { count: number }) {
    super({ count })
  }

  increment() {
    this.state.count += 1
  }

  decrement() {
    this.state.count -= 1
  }
}

const [createTestContext, createTestScope] = createNamespaceScope('TestScope')

const { Provider: TestProvider, useNamespaceStores: useTestNamespaceStore } = createTestContext('TestScope', {})

const TestComponent = ({ name, scope }: { name: string; scope: any }) => {
  const { count, increment } = useTestNamespaceStore((state) => ({ count: state.count }), scope)

  return (
    <div>
      <span data-testid={name}>
        {name}:{count}
      </span>
      <button type="button" onClick={increment} data-testid="increment-button">
        Increment
      </button>
    </div>
  )
}

const TestComponentWithProvider = () => {
  const scope1 = createTestScope()({})
  const scope2 = createTestScope()({})

  return (
    <TestProvider scope={scope1.__scopeTestScope} overwriteStore={() => new TestStore({ count: 2 })}>
      <TestProvider scope={scope2.__scopeTestScope} overwriteStore={() => new TestStore({ count: 200 })}>
        <TestComponent name="scope1" scope={scope1.__scopeTestScope} />
        <TestComponent name="scope2" scope={scope2.__scopeTestScope} />
      </TestProvider>
    </TestProvider>
  )
}

export default TestComponentWithProvider
