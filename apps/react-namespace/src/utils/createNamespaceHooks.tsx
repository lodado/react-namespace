'use client'

import { NamespaceStore } from '@lodado/namespace-core'

import { useNamespaceExternalStores } from '../hooks/useNamespaceExternalStores'
import { StateOf, StoreActions } from '../type'

export const createNamespaceHooks = <
  State extends Record<string | symbol, any>,
  StoreType extends NamespaceStore<State>,
  PARAMS extends any = never,
>(
  getContext: (params: PARAMS) => StoreType | undefined,
) => {
  const useNamespaceAction = (params?: PARAMS): StoreActions<StoreType, State> => {
    const context = getContext(params!)

    if (context === undefined) {
      throw new Error('useStore must be used within a Provider')
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

  const useNamespaceStores = (
    selector: (state: StoreType['state']) => Partial<StoreType['state']>,
    params?: PARAMS,
  ) => {
    const context = getContext(params!)

    if (context === undefined) {
      throw new Error('useStores must be used within a Provider')
    }

    const value = useNamespaceExternalStores(context, selector) as StateOf<StoreType['state']>

    return { ...value, ...useNamespaceAction(params) }
  }

  return { useNamespaceStores, useNamespaceAction }
}
