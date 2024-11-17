'use client'

import { NamespaceStore } from '@lodado/namespace-core'
import { isEqual } from 'lodash-es'
import { useCallback, useEffect, useLayoutEffect, useRef, useSyncExternalStore } from 'react'

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
  selector: (state: State) => Partial<State>,
) {
  // Use a proxy or tracking mechanism to track accessed keys
  const { state } = store
  const selectedState = selector(state)
  const previousSnapshotRef = useRef<Partial<State> | null>(null)

  let isRender = true

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

  const getSnapshot =
    ({ isServerSide }: { isServerSide: boolean }) =>
    () => {
      const snapshot = {} as Partial<State> // Cast State to Partial<State>
      keys.forEach((key) => {
        ;(snapshot as any)[key] = store.getState(key)
      })

      if (!isServerSide && !isRender && previousSnapshotRef.current && isEqual(snapshot, previousSnapshotRef.current)) {
        // Return the previous snapshot to maintain reference equality
        return previousSnapshotRef.current
      }

      // Update the reference and return the new snapshot
      previousSnapshotRef.current = snapshot

      isRender = false
      return snapshot
    }

  const lastSnapshot = useSyncExternalStore(
    subscribe,
    getSnapshot({ isServerSide: false }),
    getSnapshot({ isServerSide: true }),
  )

  return lastSnapshot
}
