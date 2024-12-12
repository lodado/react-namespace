import { ComposeProviders } from '@lodado/react-namespace'
import { useCallback } from 'react'

import {
  BoardProvider,
  createUser1Scope,
  createUser2Scope,
  PlayerProvider,
  ScopeContainerProvider,
} from './components/Provider'
import TicTacToeGame from './components/TicTacToeGame'
import PlayerPresenter from './models/PlayerPresenter'
import TicTacToePresenter from './models/TicTacToePresenter'

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

        <PlayerProvider scope={user1.__scopeTicTacToe} overwriteStore={player1Repo} />,
        <PlayerProvider scope={user2.__scopeTicTacToe} overwriteStore={player2Repo} />,
      ]}
    >
      <div className="App">
        <h1>TicTacToe example</h1>
        <TicTacToeGame />
      </div>
    </ComposeProviders>
  )
}
