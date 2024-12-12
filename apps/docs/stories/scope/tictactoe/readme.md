
# TicTacToe Example

This project is a simple implementation of a TicTacToe game using React and TypeScript. It demonstrates the use of custom providers and hooks to manage the state and scope of the game and its players.

---

## Project Structure

- **`App.tsx`**: The main component that sets up the game and its providers.
- **`Provider.tsx`**: Contains the definitions for custom providers and hooks.
- **`models/PlayerPresenter.ts`**: Defines the `PlayerPresenter` class.
- **`models/TicTacToePresenter.ts`**: Defines the `TicTacToePresenter` class.
- **`components/TicTacToeGame.tsx`**: The component that renders the TicTacToe game.

---

## Code Explanation

### **`App.tsx`**

The `TicTacToeExample` component sets up the game and its players using custom providers.

### **`Provider.tsx`**

Defines the custom providers and hooks used in the application.

### **Components**

- **`PlayerPresenter`**  
  Defines the `PlayerPresenter` class, which manages the state and behavior of a player.

- **`TicTacToePresenter`**  
  Defines the `TicTacToePresenter` class, which manages the state and behavior of the TicTacToe game.

- **`TicTacToeGame`**  
  The component that renders the TicTacToe game.

---

## code example

import { ComposeProviders } from '@lodado/react-namespace'
import { useCallback } from 'react'

import PlayerPresenter from './components/models/PlayerPresenter'
import TicTacToePresenter from './components/models/TicTacToePresenter'
import {
  BoardProvider,
  createUser1Scope,
  createUser2Scope,
  RepositoryProvider,
  ScopeContainerProvider,
} from './components/Provider'
import TicTacToeGame from './components/TicTacToeGame'

export const TicTacToeExample = () => {
  const game = useCallback(() => new TicTacToePresenter(), [])
  const player1Repo = useCallback(() => new PlayerPresenter('🔵'), [])
  const player2Repo = useCallback(() => new PlayerPresenter('❌'), [])

  const user1 = createUser1Scope({})
  const user2 = createUser2Scope({})

  return (
    <ComposeProviders
      providers={[
        <BoardProvider overwriteStore={game} />,
        <ScopeContainerProvider value={{ user1: user1.__scopeTicTacToe!, user2: user2.__scopeTicTacToe! }} />,

        <RepositoryProvider scope={user1.__scopeTicTacToe} overwriteStore={player1Repo} />,
        <RepositoryProvider scope={user2.__scopeTicTacToe} overwriteStore={player2Repo} />,
      ]}
    >
      <div className="App">
        <h1>TicTacToe example</h1>
        <TicTacToeGame />
      </div>
    </ComposeProviders>
  )
}
