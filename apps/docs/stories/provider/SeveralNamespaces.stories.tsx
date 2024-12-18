import { NamespaceStore } from '@lodado/namespace-core'
import { createNamespaceContext } from '@lodado/react-namespace'
import { Meta } from '@storybook/react'

const meta: Meta = {
  title: 'provider/ServelNamespaces',

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

const { Provider: ExampleProvider2, useNamespaceStores: useNamespaceStores2 } = createNamespaceContext({
  globalStore: new Counter(),
})

const CountComponent = () => {
  // 키를 명시적으로 전달하지 않아도 selector에서 추출
  const { count, increment, decrement, reset } = useNamespaceStores((state) => {
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
      <button type="button" onClick={() => reset()}>
        reset{' '}
      </button>
    </div>
  )
}

const CountComponent2 = () => {
  // 키를 명시적으로 전달하지 않아도 selector에서 추출
  const { count, increment, decrement } = useNamespaceStores2((state) => {
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

const TextComponent = () => {
  // 키를 명시적으로 전달하지 않아도 selector에서 추출
  const { text, updateText } = useNamespaceStores((state) => {
    return { text: state.text }
  })

  return (
    <div>
      <h1>Text: {text}</h1>
      <button type="button" onClick={() => updateText()}>
        Update Text
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
      <TextComponent />
    </ExampleProvider>

    <ExampleProvider2>
      <CountComponent2 />
    </ExampleProvider2>
  </>
)
