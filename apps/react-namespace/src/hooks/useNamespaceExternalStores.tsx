/* eslint-disable no-param-reassign */

'use client'

import { NamespaceStore } from '@lodado/namespace-core'
import { isEqual } from 'lodash-es'
import { useCallback, useDebugValue, useEffect, useLayoutEffect, useMemo, useRef, useSyncExternalStore } from 'react'

import { createContinuablePromise, isPromiseLike, use } from './utils'

/**
 * Custom hook that allows accessing and subscribing to selected state values from a NamespaceStore.
 *
 * @template State - The type of the state object in the NamespaceStore.
 * @param store - The NamespaceStore instance.
 * @param selector - A function that selects the desired state values from the store's state object.
 * @returns - The selected state values.
 */
export function useNamespaceExternalStores<State extends Record<string, any>>(
  store: NamespaceStore<State>,
  selector?: (state: State) => Partial<State>,
) {
  // Use a proxy or tracking mechanism to track accessed keys
  const { state } = store

  const selectedState = selector?.(state) ?? []
  const previousSnapshotRef = useRef<Partial<State> | null>(null)

  let isRender = false

  /**
   *  Allow zero keys
   * example - const { increment, decrement } = useNamespaceExternalStores((state) => ({}))
   */
  const keys = Object.keys(selectedState)

  const subscribe = useCallback(
    (listener: () => void) => {
      const unsubscribes = keys.map((key) => store.subscribe(key, listener))
      return () => unsubscribes.forEach((unsubscribe) => unsubscribe())
    },
    [store],
  )

  const getSnapshot = useCallback(() => {
    const snapshot = {} as Partial<State>
    keys.forEach((key) => {
      let value = store.getState(key)

      if (isPromiseLike(value)) {
        value = use(createContinuablePromise(value)) as Awaited<ReturnType<State[typeof key]>>
      }

      ;(snapshot as any)[key] = value
    })

    if (isRender && previousSnapshotRef.current && isEqual(snapshot, previousSnapshotRef.current)) {
      // Return the previous snapshot to maintain reference equality
      return previousSnapshotRef.current
    }

    // Update the reference and return the new snapshot
    previousSnapshotRef.current = snapshot
    isRender = true

    return snapshot
  }, [...keys, store])

  const getServerSnapshot = useMemo(() => {
    const snapshot = {} as Partial<State>
    keys.forEach((key) => {
      ;(snapshot as any)[key] = store.getState(key)
    })

    return snapshot
  }, [])

  const lastSnapshot = useSyncExternalStore(subscribe, getSnapshot, () => getServerSnapshot)

  useDebugValue(lastSnapshot, (snapshot) => {
    return `useNamespaceStores-${keys.join(', ')}}`
  })

  return lastSnapshot
}
