
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
- [Scope](#scope)
- [API Reference](#api-reference)
  - [`createNamespaceContext`](#createnamespacecontext)
  - [`createNamespaceScope`](#createnamespacescope)
  - [`composeContextScopes`](#composecontextscopes)
- [Examples](#example-codes)
  - [Example codes](#example-codes)
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

When using React's Context API, the following issues can arise:

- The entire tree wrapped by the context gets re-rendered.
- Only the nearest parent context is accessible, making it difficult to manage when multiple contexts are nested.

Inspired by the concept of "scope" introduced by the Radix UI library ([Radix Context](https://github.com/radix-ui/primitives/tree/main/packages/react/context)), I developed this library to address these challenges.

- Provides a more flexible and scalable approach to state management.
- Reduces unnecessary re-renders.
- Simplifies implementation for deeply nested components.

### Main purpose

The main purpose of this library is not so much for global state management (although it can be used that way too!) but rather for managing state in a flexible, simple, and efficient manner when developing component-based applications, much like its name 'namespace' suggests.

It is recommended for use in the following cases:

- Developing design system components (I use it with radix-ui)
- Large and complex components such as features, widgets, and pages in the FSD architecture, or organisms in the atomic design pattern
- Recursive structures like nested tabs, especially when there is a need to manipulate them mutually
- When external components need to manipulate the state within a context

## Installation

```
npm install @lodado/namespace-core @lodado/react-namespace

# or 

yarn add @lodado/namespace-core @lodado/react-namespace
...etc
```

(TO-DO)

## Getting Started - Basic Usage

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

# Scope

 Inspired by Radix UI's `scopeContext`, it overcomes React Context's limitations, such as difficulties with nested context management and the overhead of re-rendering entire trees.

---

### Example Code

Below is an example that demonstrates how to create and use **scoped state** with `@lodado/react-namespace`.

#### 1. Define Stores for Scoped State

```tsx
import { NamespaceStore } from '@lodado/namespace-core';

// Counter store for managing count
class Counter extends NamespaceStore<{ count: number }> {
  constructor(initialCount = 0) {
    super({ count: initialCount });
  }

  increment() {
    this.state.count += 1;
  }

  decrement() {
    this.state.count -= 1;
  }
}

// Text store for managing text
class Text extends NamespaceStore<{ text: string }> {
  constructor() {
    super({ text: 'test' });
  }

  updateText() {
    this.state.text = 'updated';
  }
}
```

---

#### 2. Create Scopes and Providers

Scopes allow you to isolate state for different contexts. In this example, a `Dialog` scope and an `AlertDialog` scope are created.

```tsx
import { createNamespaceScope, Scope } from '@lodado/react-namespace';

// Create a Dialog scope
const [createDialogContext, createDialogScope] = createNamespaceScope('Dialog');

const { Provider: DialogProvider, useNamespaceStores: useDialogNamespaceStore } = createDialogContext('Dialog', {
  localStore: () => new Counter(),
});

// Create an AlertDialog scope, extending Dialog scope
const [createAlertDialogProvider, createAlertDialogScope] = createNamespaceScope('AlertDialog', [createDialogScope]);

const { Provider: AlertDialogProvider, useNamespaceStores: useAlertDialogNamespaceStore } = createAlertDialogProvider('AlertDialogContext', {
  localStore: () => new Text(),
});
```

---

#### 3. Use Scoped State in Components

Using `useNamespaceStores`, you can access state from specific scopes.

```tsx
const DialogContent = ({ scope, scope2 }: { scope: Scope<any>; scope2: Scope<any> }) => {

  const { count } = useDialogNamespaceStore((state) => ({ count: state.count }), scope);

  const { text } = useAlertDialogNamespaceStore((state) => ({ text: state.text }), scope);

  const { increment } = useDialogNamespaceStore(() => ({}), scope2);

  return (
    <div>
      <button onClick={increment}>Click!</button>
      <div>
        Content: {count} - {text}
      </div>
    </div>
  );
};
```

---

#### 4. Combine Scopes in Your Application

You can nest providers with different scopes to isolate and manage state efficiently.

```tsx
export const ScopeExample = () => {
  const scope1 = createAlertDialogScope()({});
  const scope2 = createAlertDialogScope()({});

  return (
    <AlertDialogProvider scope={scope1.__scopeAlertDialog}>
      <AlertDialogProvider scope={scope2.__scopeAlertDialog}>
        <DialogProvider scope={scope2.__scopeAlertDialog}>
          <DialogProvider scope={scope1.__scopeAlertDialog}>
            <DialogContent scope={scope1.__scopeAlertDialog} scope2={scope2.__scopeAlertDialog} />
            <DialogContent scope={scope2.__scopeAlertDialog} scope2={scope1.__scopeAlertDialog} />
          </DialogProvider>
        </DialogProvider>
      </AlertDialogProvider>
    </AlertDialogProvider>
  );
};
```

---

This example highlights how **scoped state** allows you to create isolated, modular, and reusable contexts for state management, particularly in scenarios with nested or complex components.

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
  readonly useNamespaceAction: () => StoreType; // context functions 
  readonly useNamespaceContext: () => StoreType // "context"
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

### Example codes 

---

#### Table Example codes 
[https://github.com/lodado/react-namespace/blob/main/apps/docs/stories/scope/table/App.tsx](https://github.com/lodado/react-namespace/tree/main/apps/docs/stories/scope/table)

#### TicTactoe
[https://github.com/lodado/react-namespace/tree/main/apps/docs/stories/scope/tictactoe 
](https://github.com/lodado/react-namespace/tree/main/apps/docs/stories/scope/tictactoe)

---


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

### reset State

you can reset states with reset function in useNamespaceAction or useNamespaceStores

```jsx
const TestComponent = () => {
  const { count } = useNamespaceStores((state) => ({ count: state.count }))
  const { increment, decrement, reset } = useNamespaceAction()

  return (
    <div>
      <button type="button" data-testid="reset-button" onClick={reset}>
        Reset
      </button>
      <button type="button" data-testid="increment-button" onClick={increment}>
        Increment
      </button>
      <button type="button" data-testid="decrement-button" onClick={decrement}>
        Decrement
      </button>
    </div>
  )
}
```

### use "Context" value

you can use literally "context" class instance via useNamespaceContext

```jsx

  const TestComponent = () => {
    const context = useNamespaceContext()
    ...
  }
```

## License

MIT License

---

This library simplifies state management in React applications by providing a structured and scalable way to handle state across different components and scopes. Whether you're building a small application or a large-scale project, this namespace store can help you maintain clean and maintainable code.

Feel free to contribute to the project by submitting issues or pull requests on the GitHub repository.
