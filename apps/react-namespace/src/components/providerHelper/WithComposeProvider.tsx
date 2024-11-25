import React, { ComponentType, FC, ReactElement } from 'react'

import ComposeProviders from './ComposeProviders'

export type WithComposedProviderProps<C> = {
  Components: ComponentType<C>
  Providers: ReactElement[]
}

const WithComposedProviders = <C extends object>({ Components, Providers }: WithComposedProviderProps<C>): FC<C> => {
  const WrappedComponent: FC<C> = (props: C) => (
    <ComposeProviders providers={Providers}>
      <Components {...props} />
    </ComposeProviders>
  )
  return WrappedComponent
}

export default WithComposedProviders
