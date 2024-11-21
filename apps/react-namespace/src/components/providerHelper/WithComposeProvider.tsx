'use client'

import { ComponentType, ReactElement } from 'react'

import ComposeProviders from './ComposeProviders'

export type WithComposedProviderProps<C> = {
  Component: ComponentType<C>
  providers: ReactElement[]
}

const WithComposedProviders = <C extends object>({
  Component,
  providers,
}: WithComposedProviderProps<C>): ComponentType<C> => {
  return (props: C) => (
    <ComposeProviders providers={providers}>
      <Component {...props} />
    </ComposeProviders>
  )
}

export default WithComposedProviders
