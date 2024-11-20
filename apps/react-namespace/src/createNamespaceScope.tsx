/* eslint-disable no-shadow */
import { NamespaceStore } from '@lodado/namespace-core'
import React, { Context, createContext, FC, ReactNode, useContext, useMemo } from 'react'

import { createNamespaceContext } from './createNamespaceContext'
import { StoreOption } from './type'
import { createNamespaceHooks } from './utils/createNamespaceHooks'

export type Scope<C = any> = { [scopeName: string]: Context<C>[] } | undefined
export type ScopeHook = (scope: Scope) => { [__scopeProp: string]: Scope }
export interface CreateScope {
  scopeName: string
  (): ScopeHook
}

export function composeContextScopes(...scopes: CreateScope[]) {
  const baseScope = scopes[0]
  if (scopes.length === 1) return baseScope

  const createScope: CreateScope = () => {
    const scopeHooks = scopes.map((createScope) => ({
      useScope: createScope(),
      scopeName: createScope.scopeName,
    }))

    return function useComposedScopes(overrideScopes) {
      const nextScopes = scopeHooks.reduce((nextScopes, { useScope, scopeName }) => {
        // We are calling a hook inside a callback which React warns against to avoid inconsistent
        // renders, however, scoping doesn't have render side effects so we ignore the rule.
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const scopeProps = useScope(overrideScopes)
        const currentScope = scopeProps[`__scope${scopeName}`]
        return { ...nextScopes, ...currentScope }
      }, {})

      return useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes])
    }
  }

  createScope.scopeName = baseScope.scopeName
  return createScope
}

/**
 * Creates a namespace scope for managing state and actions within a specific namespace.
 *
 * @param scopeName - The name of the namespace scope.
 * @param createContextScopeDeps - An array of dependencies for creating the context scope.
 * @returns A tuple containing the Provider component and the useNamespaceStore hook.
 */
export function createNamespaceScope(scopeName: string, createContextScopeDeps: CreateScope[] = []) {
  let defaultContexts: any[] = []

  /**
   * Creates a context for a namespace store.
   *
   * @template StoreType - The type of the namespace store.
   * @param {string} rootComponentName - The name of the root component.
   * @param store - A function that returns the store or the store itself.  If it's not a function, it's shared globally.
   * @returns {[Provider, useNamespaceStore]} - A tuple containing the Provider component and the useNamespaceStore hook.
   */
  function createScopeContext<StoreType extends NamespaceStore<Record<string | symbol, any>>>(
    rootComponentName: string,
    { globalStore, localStore }: StoreOption<StoreType['state'], StoreType>,
  ) {
    const { Context: BaseContext } = createNamespaceContext({
      globalStore,
      localStore,
    } as StoreOption<StoreType['state'], StoreType>)

    const index = defaultContexts.length
    defaultContexts = [...defaultContexts, BaseContext]

    const Provider: FC<{
      scope: Scope<StoreType>
      overwriteStore?: () => StoreType | StoreType
      children: ReactNode
    }> = (props) => {
      const { scope, overwriteStore, children } = props
      const Context = scope?.[scopeName]?.[index] || BaseContext

      const localStoreInstance = typeof localStore === 'function' ? localStore() : localStore

      const namespaceInstance = useMemo(
        () =>
          typeof overwriteStore === 'function' ? overwriteStore() : overwriteStore ?? localStoreInstance ?? globalStore,
        [overwriteStore],
      )

      return <Context.Provider value={namespaceInstance as StoreType}>{children}</Context.Provider>
    }

    Provider.displayName = `${rootComponentName}Provider`

    const { useNamespaceStores, useNamespaceContext } = createNamespaceHooks<
      StoreType['state'],
      StoreType,
      Scope<StoreType | undefined>
    >((scope: Scope<StoreType | undefined>) => {
      const Context = scope?.[scopeName]?.[index] || BaseContext
      const context = useContext(Context)

      return context
    })

    return [Provider, useNamespaceStores, useNamespaceContext] as const
  }

  const createScope: CreateScope = () => {
    const scopeContexts = defaultContexts.map((defaultContext) => {
      return createContext(defaultContext)
    })
    return function useScope(scope: Scope) {

      const contexts = scope?.[scopeName] || scopeContexts
      return useMemo(() => ({ [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts } }), [scope, contexts])
    }
  }

  createScope.scopeName = scopeName
  return [createScopeContext, composeContextScopes(createScope, ...createContextScopeDeps)] as const
}
