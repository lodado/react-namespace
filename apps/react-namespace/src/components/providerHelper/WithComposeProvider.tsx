import React, { ComponentType, FC, ReactElement } from 'react'

import ComposeProviders from './ComposeProviders'

export type WithComposedProviderProps<C> = {
  Component: ComponentType<C>
  providers: ReactElement[]
}

const WithComposedProviders = <C extends object>({ Component, providers }: WithComposedProviderProps<C>): FC<C> => {
  const WrappedComponent: FC<C> = (props: C) => (
    <ComposeProviders providers={providers}>
      <Component {...props} />
    </ComposeProviders>
  )
  return WrappedComponent
}

export default WithComposedProviders
