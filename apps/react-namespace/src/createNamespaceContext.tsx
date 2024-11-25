'use client'

import { NamespaceStore } from '@lodado/namespace-core'
import { isNil } from 'lodash-es'
import { createContext, FC, ReactNode, useContext, useMemo } from 'react'

import { StoreOption } from './type'
import { createNamespaceHooks } from './utils/createNamespaceHooks'

export function createNamespaceContext<StoreType extends NamespaceStore<Record<string | symbol, any>>>({
  globalStore: globalStoreDIP,
  localStore,
  option = {
    contextThrowNeed: true,
  },
}: StoreOption<StoreType['state'], StoreType>) {
  const Context = createContext<StoreType | undefined>(undefined)
  const globalStore = globalStoreDIP && typeof globalStoreDIP === 'function' ? globalStoreDIP() : globalStoreDIP

  const { useNamespaceStores, useNamespaceAction, useNamespaceContext } = createNamespaceHooks<
    StoreType['state'],
    StoreType,
    undefined
  >(() => {
    const context = useContext(Context)

    if (option.contextThrowNeed && isNil(context)) {
      throw new Error('useNamespaceStoreHooks must be used within a NamespaceContext.Provider')
    }

    return context
  })

  const Provider: FC<{ overwriteStore?: (() => StoreType) | StoreType; children?: ReactNode }> = ({
    overwriteStore,
    children,
  }) => {
    const localStoreInstance = typeof localStore === 'function' ? localStore() : localStore

    const namespaceInstance = useMemo(
      () =>
        typeof overwriteStore === 'function' ? overwriteStore() : overwriteStore ?? localStoreInstance ?? globalStore,
      [overwriteStore],
    )

    if (isNil(namespaceInstance)) throw new Error('namespaceNamespaceStore is null')

    return <Context.Provider value={namespaceInstance}>{children}</Context.Provider>
  }

  return { Context, Provider, store: globalStore, useNamespaceStores, useNamespaceAction, useNamespaceContext } as const
}
