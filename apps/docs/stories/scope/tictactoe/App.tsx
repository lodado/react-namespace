import { ComposeProviders } from '@lodado/react-namespace'
import { useCallback } from 'react'

import { BoardProvider, createUser1Scope, createUser2Scope, RepositoryProvider } from './components/Provider'
import TicTacToeGame from './components/TicTacToeGame'
import PlayerRepository from './models/PlayerRepository'
import TicTacToe from './models/TicTacToe'

export const App = () => {
  const game = useCallback(() => new TicTacToe(), [])
  const player1Repo = useCallback(() => new PlayerRepository('🔵'), [])
  const player2Repo = useCallback(() => new PlayerRepository('❌'), [])

  const user1 = createUser1Scope({})
  const user2 = createUser2Scope({})

  return (
    <ComposeProviders
      providers={[
        <BoardProvider overwriteStore={game} />,
        <RepositoryProvider scope={user1.__scopeTicTacToeRepository} overwriteStore={player1Repo} />,
        <RepositoryProvider scope={user2.__scopeTicTacToeRepository} overwriteStore={player2Repo} />,
      ]}
    >
      <div className="App">
        <h1>TicTacToe example</h1>
        <TicTacToeGame
          player1Scope={user1.__scopeTicTacToeRepository}
          player2Scope={user2.__scopeTicTacToeRepository}
        />
      </div>
    </ComposeProviders>
  )
}
