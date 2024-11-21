import { ComposeProviders } from '@lodado/react-namespace'
import { useCallback } from 'react'

import PlayerRepository from './components/models/PlayerRepository'
import TicTacToe from './components/models/TicTacToe'
import {
  BoardProvider,
  createUser1Scope,
  createUser2Scope,
  RepositoryProvider,
  ScopeContainerProvider,
} from './components/Provider'
import TicTacToeGame from './components/TicTacToeGame'

export const TicTacToeExample = () => {
  const game = useCallback(() => new TicTacToe(), [])
  const player1Repo = useCallback(() => new PlayerRepository('🔵'), [])
  const player2Repo = useCallback(() => new PlayerRepository('❌'), [])

  const user1 = createUser1Scope({})
  const user2 = createUser2Scope({})

  return (
    <ComposeProviders
      providers={[
        <BoardProvider overwriteStore={game} />,
        <ScopeContainerProvider value={{ user1, user2 }} />,

        <RepositoryProvider scope={user1.__scopeTicTacToeRepository} overwriteStore={player1Repo} />,
        <RepositoryProvider scope={user2.__scopeTicTacToeRepository} overwriteStore={player2Repo} />,
      ]}
    >
      <div className="App">
        <h1>TicTacToe example</h1>
        <TicTacToeGame />
      </div>
    </ComposeProviders>
  )
}
