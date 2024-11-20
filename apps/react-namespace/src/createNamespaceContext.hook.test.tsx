import { NamespaceStore } from '@lodado/namespace-core'
import { act, renderHook } from '@testing-library/react'
import React, { ReactNode } from 'react'

import { createNamespaceContext } from './createNamespaceContext'

// Define a test-specific NamespaceStore class
class TestStore extends NamespaceStore<{ count: number }> {
  constructor({ count = 0 }: { count?: number }) {
    super({ count })
  }

  increment() {
    this.state.count += 1
  }

  decrement() {
    this.state.count -= 1
  }
}

// Test the context created by `createNamespaceContext`
describe('createNamespaceContext', () => {
  const { Provider, useNamespaceStores, useNamespaceAction } = createNamespaceContext({
    globalStore: () => new TestStore({}),
  })

  describe('with global NamespaceStore', () => {
    describe('when using Provider and hooks', () => {
      it('should provide the initial state', () => {
        const wrapper = ({ children }: { children: ReactNode }) => <Provider>{children}</Provider>

        const { result } = renderHook(() => useNamespaceStores((state) => ({ count: state.count })), { wrapper })

        expect(result.current.count).toBe(0)
      })

      it('should increment the state using the increment action', () => {
        const wrapper = ({ children }: { children: ReactNode }) => <Provider>{children}</Provider>

        const { result } = renderHook(
          () => ({
            state: useNamespaceStores((state) => ({ count: state.count })),
            actions: useNamespaceAction(),
          }),
          { wrapper },
        )

        act(() => {
          result.current.actions.increment()
        })

        expect(result.current.state.count).toBe(1)
      })

      it('should decrement the state using the decrement action', () => {
        const wrapper = ({ children }: { children: ReactNode }) => <Provider>{children}</Provider>

        const { result } = renderHook(
          () => ({
            state: useNamespaceStores((state) => ({ count: state.count })),
            actions: useNamespaceAction(),
          }),
          { wrapper },
        )

        act(() => {
          result.current.actions.decrement()
        })

        expect(result.current.state.count).toBe(0)
      })
    })
  })

  describe('when using Provider and hooks', () => {
    it('should increment 4 times the state using the increment action', () => {
      const wrapper = ({ children }: { children: ReactNode }) => <Provider>{children}</Provider>

      const { result } = renderHook(
        () => ({
          state: useNamespaceStores((state) => ({ count: state.count })),
          actions: useNamespaceAction(),
        }),
        { wrapper },
      )

      act(() => {
        result.current.actions.increment()
        result.current.actions.increment()
        result.current.actions.increment()
        result.current.actions.increment()
      })

      expect(result.current.state.count).toBe(4)
    })
  })
})

describe('with local NamespaceStore', () => {
  const { Provider, useNamespaceStores, useNamespaceAction } = createNamespaceContext({
    localStore: () => new TestStore({}),
  })

  describe('when using Provider and hooks', () => {
    it('should provide the initial state', () => {
      const wrapper = ({ children }: { children: ReactNode }) => <Provider>{children}</Provider>

      const { result } = renderHook(() => useNamespaceStores((state) => ({ count: state.count })), { wrapper })

      expect(result.current.count).toBe(0)
    })

    it('should increment the state using the increment action', () => {
      const wrapper = ({ children }: { children: ReactNode }) => <Provider>{children}</Provider>
      const { result } = renderHook(
        () => ({
          state: useNamespaceStores((state) => ({ count: state.count })),
          actions: useNamespaceAction(),
        }),
        { wrapper },
      )

      act(() => {
        result.current.actions.increment()
      })

      expect(result.current.state.count).toBe(1)
    })

    it('should decrement the state using the decrement action', () => {
      const wrapper = ({ children }: { children: ReactNode }) => <Provider>{children}</Provider>

      const { result } = renderHook(
        () => ({
          state: useNamespaceStores((state) => ({ count: state.count })),
          actions: useNamespaceAction(),
        }),
        { wrapper },
      )

      act(() => {
        result.current.actions.decrement()
      })

      expect(result.current.state.count).toBe(-1)
    })
  })
})

describe('with overwrite NamespaceStore', () => {
  const { Provider, useNamespaceStores, useNamespaceAction, useNamespaceContext } = createNamespaceContext({
    localStore: () => new TestStore({ count: 10 }),
  })

  describe('when using Provider and hooks', () => {
    it('should provide the initial state', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <Provider overwriteStore={() => new TestStore({ count: 0 })}>{children}</Provider>
      )

      const { result } = renderHook(() => useNamespaceStores((state) => ({ count: state.count })), { wrapper })

      expect(result.current.count).toBe(0)
    })

    it('should increment the state using the increment action', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <Provider overwriteStore={() => new TestStore({ count: 0 })}>{children}</Provider>
      )
      const { result } = renderHook(
        () => ({
          state: useNamespaceStores((state) => ({ count: state.count })),
          actions: useNamespaceAction(),
        }),
        { wrapper },
      )

      act(() => {
        result.current.actions.increment()
      })

      expect(result.current.state.count).toBe(1)
    })

    it('should decrement the state using the decrement action', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <Provider overwriteStore={() => new TestStore({ count: 0 })}> {children}</Provider>
      )

      const { result } = renderHook(
        () => ({
          state: useNamespaceStores((state) => ({ count: state.count })),
          actions: useNamespaceAction(),
        }),
        { wrapper },
      )

      act(() => {
        result.current.actions.decrement()
      })

      expect(result.current.state.count).toBe(-1)
    })
  })

  describe('when using useNamespaceContext', () => {
    it('should provide the correct context instance', () => {
      const testStoreInstance = new TestStore({ count: 0 })

      const wrapper = ({ children }: { children: ReactNode }) => (
        <Provider overwriteStore={() => testStoreInstance}>{children}</Provider>
      )

      const { result } = renderHook(
        () => ({
          context: useNamespaceContext(),
        }),
        { wrapper },
      )

      expect(result.current.context).toBe(testStoreInstance)
    })
  })
})
