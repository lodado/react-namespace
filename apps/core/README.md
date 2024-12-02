
# @lodado/namespace-core Summary

`@lodado/namespace-core` is a lightweight and flexible library designed for state management in React applications. It provides the `NamespaceStore` class, which serves as a foundational tool for creating custom state stores using JavaScript's Proxy API. By extending `NamespaceStore`, developers can define application state and actions in a structured and scalable manner.

more information >>

<https://github.com/lodado/react-namespace/tree/publish>

## Key Features

- **Lightweight**: Adds minimal overhead to your application.
- **Flexible State Management**: Supports both global and local stores for versatile state handling.
- **Proxy API Utilization**: Leverages the Proxy API for efficient and reactive state management.
- **TypeScript Support**: Fully typed to enhance the developer experience with better tooling and error checking.

## Usage

### Creating a Namespace Store

To utilize `@lodado/namespace-core`, you start by creating a store class that extends `NamespaceStore`. This custom store will hold your application's state and provide methods to modify it.

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

  // Actions to modify the state
  setUser(user: AppState['user']) {
    this.state.user = user;
  }

  toggleTheme() {
    this.state.theme = this.state.theme === 'light' ? 'dark' : 'light';
  }
}

// Instantiate the global store
const globalStore = new AppStore({
  user: {
    name: 'John Doe',
    email: 'john.doe@example.com',
  },
  theme: 'light',
});
```

### Defining Actions

Within your extended `NamespaceStore`, you can define methods that act upon the state. These actions encapsulate the logic for updating state properties.

```typescript
class CounterStore extends NamespaceStore<{ count: number }> {
  constructor() {
    super({ count: 0 });
  }

  increment() {
    this.state.count += 1;
  }

  decrement() {
    this.state.count -= 1;
  }
}
```

## When to Use

`@lodado/namespace-core` is particularly beneficial in the following scenarios:

- **Design System Components**: Ideal for developing reusable components within a design system.
- **Complex Components**: Manages state efficiently in large components like features, widgets, or pages.
- **Recursive Structures**: Handles nested components or tabs where mutual manipulation is necessary.
- **External State Manipulation**: Allows external components to interact with and manipulate internal state.

## Installation

Install the package using npm or yarn:

```bash
npm install @lodado/namespace-core
# or
yarn add @lodado/namespace-core
```

## License

MIT License

---

By focusing on the core functionalities provided by `@lodado/namespace-core`, developers can create efficient and maintainable state management solutions tailored to their application's needs.
