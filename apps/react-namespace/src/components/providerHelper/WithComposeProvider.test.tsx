import { render, screen } from '@testing-library/react'
import React, { createContext, useContext } from 'react'

import WithComposedProviders from './WithComposeProvider'

// Context 테스트용 Provider 생성
const ContextA = createContext<string | null>(null)
const ContextB = createContext<string | null>(null)

const TestComponent: React.FC = () => {
  const valueA = useContext(ContextA)
  const valueB = useContext(ContextB)
  return (
    <div>
      <div data-testid="context-a">{valueA}</div>
      <div data-testid="context-b">{valueB}</div>
    </div>
  )
}

describe('WithComposedProviders', () => {
  it('wraps the component with provided contexts', () => {
    const EnhancedComponent = WithComposedProviders({
      Component: TestComponent,
      providers: [<ContextA.Provider key="a" value="ValueA" />, <ContextB.Provider key="b" value="ValueB" />],
    })

    render(<EnhancedComponent />)

    expect(screen.getByTestId('context-a')).toHaveTextContent('ValueA')
    expect(screen.getByTestId('context-b')).toHaveTextContent('ValueB')
  })

  it('renders correctly with no providers', () => {
    const EnhancedComponent = WithComposedProviders({
      Component: TestComponent,
      providers: [],
    })

    render(<EnhancedComponent />)

    // Context values should be null since no providers are supplied
    expect(screen.getByTestId('context-a')).toBeEmptyDOMElement()
    expect(screen.getByTestId('context-b')).toBeEmptyDOMElement()
  })

  it('passes props to the wrapped component', () => {
    const PropsComponent: React.FC<{ message: string }> = ({ message }) => (
      <div data-testid="props-message">{message}</div>
    )

    const EnhancedComponent = WithComposedProviders({
      Component: PropsComponent,
      providers: [],
    })

    render(<EnhancedComponent message="Hello, Props!" />)

    expect(screen.getByTestId('props-message')).toHaveTextContent('Hello, Props!')
  })
})
