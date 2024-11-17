'use client'

import { NamespaceStore } from '@lodado/namespace-core'
import { createContext, FC, ReactNode, useContext, useMemo } from 'react'

import { useNamespaceExternalStores } from './hooks/useNamespaceExternalStores'
import { StateOf } from './type'

export function createNamespaceContext<
  State extends Record<string | symbol, any>,
  StoreType extends NamespaceStore<State>,
>({ store }: { store: (() => StoreType) | StoreType }) {
  const Context = createContext<StoreType | undefined>(undefined)
  const storeBean = typeof store === 'function' ? store() : store

  // 서브클래스의 메서드 타입만 추출하는 유틸리티 타입
  type StoreMethodKeys = {
    [K in keyof StoreType]: StoreType[K] extends (...args: any[]) => any ? K : never
  }[keyof StoreType]

  type SuperMethodKeys = {
    [K in keyof NamespaceStore<State>]: NamespaceStore<State>[K] extends (...args: any[]) => any ? K : never
  }[keyof NamespaceStore<State>]

  type SubclassMethodKeys = Exclude<StoreMethodKeys, SuperMethodKeys>
  type StoreActions = Pick<StoreType, SubclassMethodKeys>

  const useNamespaceAction = (): StoreActions => {
    const context = useContext(Context)

    if (context === undefined) {
      throw new Error('useStore must be used within a Provider')
    }

    const methods: Partial<StoreActions> = {}

    const subclassProto = Object.getPrototypeOf(context)
    const subclassMethods = Object.getOwnPropertyNames(subclassProto)

    const methodsToBind = subclassMethods.filter((method) => method !== 'constructor')

    methodsToBind.forEach((key) => {
      const value = (context as any)[key]
      if (typeof value === 'function') {
        methods[key as keyof StoreActions] = value.bind(context)
      }
    })

    return methods as StoreActions
  }

  const useNamespaceStores = (selector: (state: StoreType['state']) => Partial<StoreType['state']>) => {
    const context = useContext(Context)

    if (context === undefined) {
      throw new Error('useStores must be used within a Provider')
    }

    const value = useNamespaceExternalStores(context, selector) as StateOf<StoreType['state']>

    return { ...value, ...useNamespaceAction() }
  }

  const Provider: FC<{ store?: (() => StoreType) | StoreType; children: ReactNode }> = ({
    store: overwriteStore,
    children,
  }) => {
    const value = useMemo(
      () => (typeof overwriteStore === 'function' ? overwriteStore() : overwriteStore ?? storeBean),
      [overwriteStore],
    )

    return <Context.Provider value={value}>{children}</Context.Provider>
  }

  return { Context, Provider, store: storeBean, useNamespaceStores, useNamespaceAction } as const
}
