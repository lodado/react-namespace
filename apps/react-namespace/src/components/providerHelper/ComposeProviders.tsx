'use client'

import React, { cloneElement, isValidElement, ReactElement, ReactNode } from 'react'

export type ComposeProvidersProps = {
  providers: ReactElement[]
  children: ReactNode
}

const ComposeProviders: React.FC<ComposeProvidersProps> = ({ providers, children }) => {
  return providers.reduceRight((acc, provider) => {
    if (!isValidElement(provider)) {
      throw new Error('Each provider must be a valid React element.')
    }

    // provider에 children 추가
    return cloneElement(provider, {}, acc)
  }, children)
}

export default ComposeProviders