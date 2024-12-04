'use client'

import { Context, createContext, FC, ReactNode, useContext, useMemo } from 'react'

import { JSON_KEY_TYPE, Scope } from '../../type'

export type ScopeContainer<KEY_TYPE extends JSON_KEY_TYPE> = { [key in KEY_TYPE]: Scope }

export function createScopeContainer<KEY_TYPE extends JSON_KEY_TYPE>() {
  const ScopeContext = createContext<ScopeContainer<KEY_TYPE> | null>(null)

  const ScopeContainerProvider: FC<{
    value: ScopeContainer<KEY_TYPE>
    children?: ReactNode
  }> = ({ value, children }) => {
    return <ScopeContext.Provider value={useMemo(() => value, Object.keys(value))}>{children}</ScopeContext.Provider>
  }

  const useScopeContainer = () => {
    const context = useContext(ScopeContext)
    if (context === null) {
      throw new Error('useScope must be used within a ScopeProvider')
    }
    return context
  }

  return { ScopeContainerProvider, useScopeContainer }
}
