/* eslint-disable no-redeclare */

'use client'

import { NamespaceStore } from '@lodado/namespace-core'

import { useNamespaceExternalStores } from '../hooks/useNamespaceExternalStores'
import { StateOf, StoreActions } from '../type'

export const createNamespaceHooks = <
  State extends Record<string | symbol, any>,
  StoreType extends NamespaceStore<State>,
  PARAMS = never,
>(
  getContext: PARAMS extends never ? () => StoreType | undefined : (params: PARAMS) => StoreType | undefined,
) => {
  // Overload for useNamespaceAction
  function useNamespaceAction(): StoreActions<StoreType, State>
  function useNamespaceAction(params: PARAMS): StoreActions<StoreType, State>
  function useNamespaceAction(params?: PARAMS): StoreActions<StoreType, State> {
    const context = getContext(params as PARAMS)

    if (context === undefined) {
      throw new Error('useNamespaceAction must be used within a Provider')
    }

    const methods: Partial<StoreActions<StoreType, State>> = {}

    const subclassProto = Object.getPrototypeOf(context)
    const subclassMethods = Object.getOwnPropertyNames(subclassProto)

    const methodsToBind = subclassMethods.filter((method) => method !== 'constructor')

    methodsToBind.forEach((key) => {
      const value = (context as any)[key]
      if (typeof value === 'function') {
        methods[key as keyof StoreActions<StoreType, State>] = value.bind(context)
      }
    })

    return methods as StoreActions<StoreType, State>
  }

  // Overload for useNamespaceStores
  function useNamespaceStores(
    selector: (state: State) => Partial<State>,
  ): StateOf<State> & StoreActions<StoreType, State>
  function useNamespaceStores(
    selector: (state: State) => Partial<State>,
    params: PARAMS,
  ): StateOf<State> & StoreActions<StoreType, State>
  function useNamespaceStores(selector: (state: State) => Partial<State>, params?: PARAMS) {
    const context = getContext(params as PARAMS)

    if (context === undefined) {
      throw new Error('useNamespaceStores must be used within a Provider')
    }

    const value = useNamespaceExternalStores(context, selector) as StateOf<State>

    return { ...value, ...useNamespaceAction(params as PARAMS) }
  }

  return { useNamespaceStores, useNamespaceAction }
}
