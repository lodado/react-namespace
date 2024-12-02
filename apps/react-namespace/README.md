
# @lodado/react-namespace Summary

`@lodado/react-namespace` is a React library that builds upon `@lodado/namespace-core` to provide a structured way to manage scoped state using React contexts. It offers a set of tools for creating and managing state scopes and namespaces in React applications, enabling modular and reusable component development.

more information >>

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

### Composing Scopes

You can create and compose multiple namespace scopes to manage isolated contexts efficiently.

```typescript
import { createNamespaceScope, composeContextScopes } from "@lodado/react-namespace";

const [createScopeContextA, createScopeA] = createNamespaceScope('ScopeA');
const [createScopeContextB, createScopeB] = createNamespaceScope('ScopeB');

const composedScope = composeContextScopes(createScopeA, createScopeB);

const [createComposedContext, createComposedScope] = createNamespaceScope('ComposedScope', [composedScope]);

const {
  Provider: ComposedProvider,
  useNamespaceStores,
} = createComposedContext('ComposedScope', { globalStore });
```

### Reset State

You can reset state using the `reset` method available in `useNamespaceAction` or `useNamespaceStores`.

```tsx
const TestComponent = () => {
  const { count } = useNamespaceStores((state) => ({ count: state.count }));
  const { reset } = useNamespaceAction();

  return (
    <button type="button" onClick={reset}>
      Reset
    </button>
  );
};
```

### Using the Context Directly

Access the underlying context instance using `useNamespaceContext`.

```tsx
const TestComponent = () => {
  const context = useNamespaceContext();
  // Use the context as needed
};
```

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
