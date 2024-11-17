import { NamespaceStore } from '@lodado/namespace-core'
import { createNamespaceContext } from '@lodado/react-namespace'
import { Meta } from '@storybook/react'

const meta: Meta = {
  title: 'provider/OneNamespace',

  tags: ['autodocs'],
}

export default meta

// 스토어 초기화
class Counter extends NamespaceStore<{ count: number; text: string }> {
  constructor() {
    super({ count: 0, text: 'teest' })
  }

  increment() {
    this.state.count += 1
  }

  decrement() {
    this.state.count -= 1
  }

  updateText() {
    this.state.text = 'updated'
  }
}
let cnt = 0

const { Provider: ExampleProvider, useNamespaceStores } = createNamespaceContext({
  globalStore: new Counter(),
})

const CountComponent = () => {
  // 키를 명시적으로 전달하지 않아도 selector에서 추출
  const { count, increment, decrement } = useNamespaceStores((state) => {
    return { count: state.count }
  })

  return (
    <div>
      <h1>Count: {count}</h1>
      <button type="button" onClick={() => increment()}>
        Increment
      </button>
      <button type="button" onClick={() => decrement()}>
        Decrement
      </button>
    </div>
  )
}

export const App = () => (
  <>
    <ExampleProvider>
      {/* eslint-disable-next-line no-plusplus */}
      provider rerender count: {cnt++}
      <CountComponent />
    </ExampleProvider>
  </>
)
