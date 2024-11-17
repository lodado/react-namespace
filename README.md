
# Namespace Store for React

(i am writing code and docs..!)

A simple and powerful state manager for React applications that uses the Proxy API to manage the state of your application. Inspired by Radix UI's `scopeContext` and `createContext` wrapper, this library provides a flexible way to handle both global and local state within your React components.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Getting Started](#getting-started)
  - [Creating a Namespace Store](#creating-a-namespace-store)
  - [Creating a Namespace Context](#creating-a-namespace-context)
  - [Providing the Store](#providing-the-store)
  - [Consuming the Store](#consuming-the-store)
- [API Reference](#api-reference)
  - [`createNamespaceContext`](#createnamespacecontext)
  - [`createNamespaceScope`](#createnamespacescope)
  - [`composeContextScopes`](#composecontextscopes)
- [Examples](#examples)
  - [Using Local Stores](#using-local-stores)
  - [Namespaced Scopes](#namespaced-scopes)
  - [Composing Scopes](#composing-scopes)
- [License](#license)

## Features

- **Lightweight**: Minimal overhead added to your application.
- **Namespaced State Management**: Isolate state within specific contexts or scopes.
- **Flexible Store Options**: Supports both global and local stores.
- **TypeScript Support**: Fully typed for better developer experience.
- **Inspired by Radix UI**: Leverages concepts from Radix UI's `scopeContext` for modular component development.

## Motivation

```
useContext() always looks for the closest provider above the component that calls it. It searches upwards and does not consider providers in the component from which you’re calling useContext().
```

<https://react.dev/reference/react/useContext#passing-data-deeply-into-the-tree>

During development, I encountered situations where:

1. Tabs nested within tabs needed to manipulate the state of the top-level tab.
2. Tables nested within tables required control over the outermost table.

3. While building a design system, I wanted to address the issue of re-renders caused by state changes when using the Context API. However, other libraries felt too cumbersome to use.

Inspired by Radix UI's concept of scopes ([Radix Context](https://github.com/radix-ui/primitives/tree/main/packages/react/context)), I aimed to create a global state library that:

- Provides a more flexible and scalable approach to state management.
- Reduces unnecessary re-renders.
- Simplifies implementation for deeply nested components.

These use cases caused significant challenges and motivated me to create this library.

## Installation

```
npm install @lodado/namespace-core @lodado/react-namespace

# or 

yarn add @lodado/namespace-core @lodado/react-namespace
...etc
```

(TO-DO)

## Getting Started

### Creating a Namespace Store

First, you need to create a store that will hold your application's state. This store should extend the `NamespaceStore` provided by the library.

```typescript
import { NamespaceStore } from '@lodado/namespace-core';

interface AppState {
  user: {
    name: string;
    email: string;
  };
  theme: 'light' | 'dark';
}

class AppStore extends NamespaceStore<AppState> {
  constructor(initialState: AppState) {
    super(initialState);
  }

  // Define actions to modify the state
  setUser(user: AppState['user']) {
    this.state.user = user;
  }

  toggleTheme() {
    this.state.theme = this.state.theme === 'light' ? 'dark' : 'light';
  }
}

// Create a global store instance
const globalStore = new AppStore({
  user: {
    name: 'John Doe',
    email: '<john.doe@example.com>',
  },
  theme: 'light',
});
```

### Creating a Namespace Context

Use the `createNamespaceContext` function to create a context for your namespace store.

```typescript
import { createNamespaceContext } from "@lodado/react-namespace";

const {
  Provider: AppProvider,
  useNamespaceStores,
  useNamespaceAction,
} = createNamespaceContext<AppState, AppStore>({
  globalStore, // global store
  // localStore, // store per provider
});
```

### Providing the Store

Wrap your application or specific components with the `AppProvider` to provide the store context.

```tsx
import React from 'react';
import { AppProvider } from './path-to-your-provider';

function App() {
  return (
    <AppProvider>
      <YourComponent />
    </AppProvider>
  );
}

export default App;
```

### Consuming the Store

Use the `useNamespaceStores` and `useNamespaceAction` hooks to access the state and actions within your components.

```tsx
import React from 'react';
import { useNamespaceStores, useNamespaceAction } from './path-to-your-provider';

function YourComponent() {
  const { user } = useNamespaceStores((state) => {
    return { user: state.user }
  }});
  const { setUser, toggleTheme } = useNamespaceAction();

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <button onClick={() => toggleTheme()}>
        Switch to {state.theme === 'light' ? 'dark' : 'light'} mode
      </button>
    </div>
  );
}

export default YourComponent;
```

or you can just use useNamespaceStores

```tsx
import React from 'react';
import { useNamespaceStores, useNamespaceAction } from './path-to-your-provider';

function YourComponent() {
  const { user, setUser, toggleTheme  } = useNamespaceStores((state) => {
    return { user: state.user }
  }}) 
  
  return (
    <div>
      <h1>Welcome, {state.user.name}</h1>
      <button onClick={() => toggleTheme()}>
        Switch to {state.theme === 'light' ? 'dark' : 'light'} mode
      </button>
    </div>
  );
}

export default YourComponent;
```

## API Reference

### `createNamespaceContext`

Creates a namespace context for managing state and actions within a specific namespace.

#### Type Definitions

```typescript
function createNamespaceContext<
  State extends Record<string | symbol, any>,
  StoreType extends NamespaceStore<State>,
>(options: StoreOption<State, StoreType>): {
  readonly Context: React.Context<StoreType | undefined>;
  readonly Provider: React.FC<{
    overwriteStore?: (() => StoreType) | StoreType;
    children: React.ReactNode;
  }>;
  readonly store: StoreType | undefined;
  readonly useNamespaceStores: () => { state: State };
  readonly useNamespaceAction: () => StoreType;
};
```

#### Parameters

- `options`: An object containing the following properties:
  - `globalStore`: An optional global store instance or a function that returns one.
  - `localStore`: An optional local store instance or a function that returns one.

#### Returns

An object containing:

- `Context`: The React context for the namespace.
- `Provider`: A provider component to wrap your application or components.
- `store`: The global store instance.
- `useNamespaceStores`: A hook to access the state.
- `useNamespaceAction`: A hook to access the actions.

#### example code

```jsx

import { NamespaceStore } from '@lodado/namespace-core'
import { createNamespaceContext } from '@lodado/react-namespace'

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

```

### `createNamespaceScope`

Creates a namespace scope for managing state and actions within a specific namespace.

#### Type Definitions

```typescript
function createNamespaceScope(
  scopeName: string,
  createContextScopeDeps: CreateScope[] = [],
): readonly [
  typeof createScopeContext,
  ReturnType<typeof composeContextScopes>,
];
```

#### Parameters

- `scopeName`: The name of the namespace scope.
- `createContextScopeDeps`: An array of dependencies for creating the context scope.

#### Returns

A tuple containing:

- `createScopeContext`: Function to create a context for a namespace store.
- `composeContextScopes`: Function to compose multiple context scopes.

#### example code

```jsx

import { NamespaceStore } from '@lodado/namespace-core'
import { createNamespaceScope, Scope } from '@lodado/react-namespace'

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
const [DialogProvider, useDialogNamespaceStore] = createDialogContext('Dialog', {
  localStore: () => new Counter(),
})

const [createAlertDialogProvider, createAlertDialogScope] = createNamespaceScope('AlertDialog', [createDialogScope])

const [AlertDialogProvider, useAlertDialogNamespaceStore] = createAlertDialogProvider('AlertDialog', {
  localStore: () => new Text(),
})

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
      {/*"Does this seem crazy? The requirements at my workplace are quite similar to this!"*/}
      <AlertDialogProvider scope={scope.__scopeAlertDialog}>
        <AlertDialogProvider scope={scope2.__scopeAlertDialog}>
          <DialogProvider scope={scope2.__scopeAlertDialog}>
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

```

### `composeContextScopes`

Composes multiple context scopes into a single scope.

#### Type Definitions

```typescript
function composeContextScopes(...scopes: CreateScope[]): CreateScope;
```

#### Parameters

- `scopes`: A list of `CreateScope` functions to compose.

#### Returns

- `createScope`: A function that creates a composed scope.

## Examples

### Using Local Stores

You can also provide a local store specific to a component or a subtree.

```typescript
const localStore = new AppStore({
  user: {
    name: 'Jane Doe',
    email: '<jane.doe@example.com>',
  },
  theme: 'dark',
});

// In your component
<AppProvider overwriteStore={localStore}>
  <YourComponent />
</AppProvider>;
```

### Namespaced Scopes

If you're building a library of components and want to avoid conflicts, you can create a namespaced scope.

```typescript
import { createNamespaceScope } from "@lodado/react-namespace";

const [createScopeContext, createScope] = createNamespaceScope('MyComponent');

const {
  Provider: MyComponentProvider,
  useNamespaceStores,
} = createScopeContext<AppStore>('MyComponent', { globalStore });

// Use in your component
<MyComponentProvider>
  <YourComponent />
</MyComponentProvider>;
```

### Composing Scopes

Compose multiple scopes to create isolated contexts.

```typescript
const [createScopeContextA, createScopeA] = createNamespaceScope('ScopeA');
const [createScopeContextB, createScopeB] = createNamespaceScope('ScopeB');

const composedScope = composeContextScopes(createScopeA, createScopeB);

// Now you can use the composed scope in your providers and hooks
const [createScopeContext, createScope] = createNamespaceScope('ComposedScope', [composedScope]);

const {
  Provider: ComposedProvider,
  useNamespaceStores,
  useNamespaceAction,
} = createScopeContext<AppStore>('ComposedScope', { globalStore });

// Use in your component
<ComposedProvider>
  <YourComponent />
</ComposedProvider>;
```

## License

MIT License

---

This library simplifies state management in React applications by providing a structured and scalable way to handle state across different components and scopes. Whether you're building a small application or a large-scale project, this namespace store can help you maintain clean and maintainable code.

Feel free to contribute to the project by submitting issues or pull requests on the GitHub repository.
