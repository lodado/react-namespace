import { render, screen } from '@testing-library/react'
import React, { createContext, useContext } from 'react'

import ComposeProviders from './ComposeProviders'

// Context 테스트용 Provider 생성
const ContextA = createContext<string | null>(null)
const ContextB = createContext<string | null>(null)

const ConsumerA = () => {
  const value = useContext(ContextA)
  return <div data-testid="consumer-a">{value}</div>
}

const ConsumerB = () => {
  const value = useContext(ContextB)
  return <div data-testid="consumer-b">{value}</div>
}

describe('ComposeProviders with values', () => {
  it('passes values to the providers and verifies the context', () => {
    render(
      <ComposeProviders
        providers={[<ContextA.Provider key="a" value="ValueA" />, <ContextB.Provider key="b" value="ValueB" />]}
      >
        <>
          <ConsumerA />
          <ConsumerB />
        </>
      </ComposeProviders>,
    )

    expect(screen.getByTestId('consumer-a')).toHaveTextContent('ValueA')
    expect(screen.getByTestId('consumer-b')).toHaveTextContent('ValueB')
  })
})
