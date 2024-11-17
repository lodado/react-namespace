'use client'

import { NamespaceStore } from '@lodado/namespace-core'
import { createContext, FC, ReactNode, useContext, useMemo } from 'react'

import { StoreOption } from './type'
import { createNamespaceHooks } from './utils/createNamespaceHooks'

export function createNamespaceContext<
  State extends Record<string | symbol, any>,
  StoreType extends NamespaceStore<State>,
>({ globalStore: globalStoreDIP, localStore }: StoreOption<State, StoreType>) {
  const Context = createContext<StoreType | undefined>(undefined)
  const globalStore = globalStoreDIP && typeof globalStoreDIP === 'function' ? globalStoreDIP() : globalStoreDIP

  const { useNamespaceStores, useNamespaceAction } = createNamespaceHooks<State, StoreType>(() => useContext(Context))

  const Provider: FC<{ overwriteStore?: (() => StoreType) | StoreType; children: ReactNode }> = ({
    overwriteStore,
    children,
  }) => {
    const localStoreInstance = typeof localStore === 'function' ? localStore() : localStore

    const namespaceInstance = useMemo(
      () =>
        typeof overwriteStore === 'function' ? overwriteStore() : overwriteStore ?? localStoreInstance ?? globalStore,
      [overwriteStore],
    )

    return <Context.Provider value={namespaceInstance}>{children}</Context.Provider>
  }

  return { Context, Provider, store: globalStore, useNamespaceStores, useNamespaceAction } as const
}
