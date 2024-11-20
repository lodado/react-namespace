/* eslint-disable max-classes-per-file */

import { NamespaceStore } from '@lodado/namespace-core'
import { createNamespaceScope, Scope } from '@lodado/react-namespace'

const meta = {
  title: 'scope/ScopeExample',

  parameters: {},
  argTypes: {},
}

export default meta

class Counter extends NamespaceStore<{ count: number }> {
  constructor(count = 0) {
    super({ count })
  }

  increment() {
    this.state.count += 1
  }

  decrement() {
    this.state.count -= 1
  }
}

class Text extends NamespaceStore<{ text: string }> {
  constructor() {
    super({ text: 'test' })
  }

  updateText() {
    this.state.text = 'updated'
  }
}

const [createDialogContext, createDialogScope] = createNamespaceScope('Dialog')

const { Provider: DialogProvider, useNamespaceStores: useDialogNamespaceStore } = createDialogContext('Dialog', {
  localStore: () => new Counter(),
})



const [createAlertDialogProvider, createAlertDialogScope] = createNamespaceScope('AlertDialog', [createDialogScope])

const { Provider: AlertDialogProvider, useNamespaceStores: useAlertDialogNamespaceStore } = createAlertDialogProvider(
  'AlertDialog',
  {
    localStore: () => new Text(),
  },
)

const alertDialogScope = createAlertDialogScope()
const alertDialogScope2 = createAlertDialogScope()

const DialogContent = (props: { scope: Scope<any>; scope2: Scope<any> }) => {
  const { scope, scope2 } = props

  const { count } = useDialogNamespaceStore((state) => {
    return { count: state.count }
  }, scope)

  const { text } = useAlertDialogNamespaceStore((state) => {
    return { text: state.text }
  }, scope)

  const { increment } = useDialogNamespaceStore((state) => {
    return { count: state.count }
  }, scope2)

  return (
    <div>
      <button type="button" onClick={() => increment()}>
        click!
      </button>
      content {count} {text}
    </div>
  )
}

export const ScopeExample = () => {
  const scope = alertDialogScope({})
  const scope2 = alertDialogScope2({})

  return (
    <>
      <AlertDialogProvider scope={scope.__scopeAlertDialog}>
        <AlertDialogProvider scope={scope2.__scopeAlertDialog}>
          <DialogProvider scope={scope2.__scopeAlertDialog}>
            <DialogProvider scope={scope.__scopeAlertDialog}>
              <DialogContent scope={scope.__scopeAlertDialog} scope2={scope2.__scopeAlertDialog} />
              <DialogContent scope={scope2.__scopeAlertDialog} scope2={scope.__scopeAlertDialog} />
            </DialogProvider>
          </DialogProvider>

          <DialogProvider overwriteStore={() => new Counter(10)} scope={scope2.__scopeAlertDialog}>
            <DialogProvider scope={scope.__scopeAlertDialog}>
              <DialogContent scope={scope.__scopeAlertDialog} scope2={scope2.__scopeAlertDialog} />
              <DialogContent scope={scope2.__scopeAlertDialog} scope2={scope.__scopeAlertDialog} />
            </DialogProvider>
          </DialogProvider>
        </AlertDialogProvider>
      </AlertDialogProvider>
    </>
  )
}
