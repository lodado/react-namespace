
# @lodado/react-namespace Summary

`@lodado/react-namespace` is a React library that builds upon `@lodado/namespace-core` to provide a structured way to manage scoped state using React contexts. It offers a set of tools for creating and managing state scopes and namespaces in React applications, enabling modular and reusable component development.

more information >>

<https://github.com/lodado/react-namespace/tree/publish>

## Key Features

- **Scoped State Management**: Isolates state within specific React contexts or namespaces.
- **Composable Scopes**: Allows combining multiple state scopes for more complex scenarios.
- **Efficient Re-renders**: Reduces unnecessary re-renders by utilizing scoped contexts.
- **TypeScript Support**: Fully typed for better developer experience.
- **Inspired by Radix UI**: Leverages concepts from Radix UI's scope-based context system.

## Usage

### Creating a Namespace Context

You can create a namespaced context using the `createNamespaceContext` function. This context manages state and actions within a specific namespace.

```typescript
import { createNamespaceContext } from "@lodado/react-namespace";

const { 
  Provider: AppProvider, 
  useNamespaceStores, 
  useNamespaceAction 
} = createNamespaceContext({
  globalStore, // Provide a global store
  // localStore, // Optional local store for specific components
});
```

### Providing the Store

Wrap your application or specific components with the `AppProvider` to make the store available within the component tree.

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

Use hooks like `useNamespaceStores` and `useNamespaceAction` to access state and actions within your components.

```tsx
import React from 'react';
import { useNamespaceStores, useNamespaceAction } from './path-to-your-provider';

function YourComponent() {
  const { user } = useNamespaceStores((state) => ({ user: state.user }));
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

## Scope

The concept of **scope** in this library ensures isolated and modular state management for React applications. Inspired by Radix UI's `scopeContext`, it overcomes React Context's limitations, such as difficulties with nested context management and the overhead of re-rendering entire trees. By utilizing scoped contexts, this approach provides a more efficient, reusable, and scalable way to handle state in complex components.

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
const { Provider: AlertDialogProvider, useNamespaceStores: useAlertDialogNamespaceStore } = createAlertDialogProvider('AlertDialog', {
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

## Installation

Install the package using npm or yarn:

```bash
npm install @lodado/react-namespace
# or
yarn add @lodado/react-namespace
```

## License

MIT License

---

`@lodado/react-namespace` simplifies state management in React applications by offering scoped state contexts and composable scopes. It is an excellent choice for building modular and reusable React components while maintaining clean and maintainable code.
