/* eslint-disable no-redeclare */

'use client'

import { NamespaceStore } from '@lodado/namespace-core'

import { useNamespaceExternalStores } from '../hooks/useNamespaceExternalStores'
import { StateOf, StoreActions, UnwrapPromiseState } from '../type'

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

    const methods: Partial<StoreActions<StoreType, State>> = {}

    // Get prototype of the context to access directly defined methods
    const subclassProto = Object.getPrototypeOf(context)
    const subclassMethods = Object.getOwnPropertyNames(subclassProto)

    // Filter out the constructor
    const methodsToBind = subclassMethods.filter(
      (method) => method !== 'constructor' && typeof (context as any)[method] === 'function',
    )

    // Bind each method to the context
    methodsToBind.forEach((key) => {
      methods[key as keyof StoreActions<StoreType, State>] = (context as any)[key].bind(context)
    })

    // Traverse the prototype chain to find 'reset' specifically if not already bound
    if (!methods.reset) {
      let proto = subclassProto
      while (proto && proto !== Object.prototype) {
        // Use Object.prototype.hasOwnProperty.call to avoid ESLint warning
        if (Object.prototype.hasOwnProperty.call(proto, 'reset') && typeof proto.reset === 'function') {
          methods.reset = proto.reset.bind(context)
          break // Stop once we find 'reset'
        }
        proto = Object.getPrototypeOf(proto)
      }
    }

    return methods as StoreActions<StoreType, State>
  }

  function useNamespaceSelector(selector: (state: State) => Partial<State>): UnwrapPromiseState<StateOf<State>>
  function useNamespaceSelector(
    selector: (state: State) => Partial<State>,
    params: PARAMS,
  ): UnwrapPromiseState<StateOf<State>>
  function useNamespaceSelector(selector: (state: State) => Partial<State>, params?: PARAMS) {
    const context = getContext(params as PARAMS)

    const value = useNamespaceExternalStores(context!, selector) as UnwrapPromiseState<StateOf<State>>

    return { ...value }
  }

  function useNamespaceStores(
    selector: (state: State) => Partial<State>,
  ): UnwrapPromiseState<StateOf<State>> & StoreActions<StoreType, State>
  function useNamespaceStores(
    selector: (state: State) => Partial<State>,
    params: PARAMS,
  ): UnwrapPromiseState<StateOf<State>> & StoreActions<StoreType, State>
  function useNamespaceStores(selector: (state: State) => Partial<State>, params?: PARAMS) {
    return { ...useNamespaceSelector(selector, params as PARAMS), ...useNamespaceAction(params as PARAMS) }
  }

  function useNamespaceContext(): StoreType | undefined
  function useNamespaceContext(params: PARAMS): StoreType | undefined
  function useNamespaceContext(params?: PARAMS): StoreType | undefined {
    const context = getContext(params as PARAMS)

    return context
  }

  return { useNamespaceSelector, useNamespaceStores, useNamespaceAction, useNamespaceContext }
}
