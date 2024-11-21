import { TicTacToeUseCase } from '../models/TicTacToeUsecase'
import { useBoardNamespaceContext, useBoardNamespaceStores, useRepositoryContext, useScopeContainer } from './Provider'

const TicTacToeGame = () => {
  const { user1: player1Scope, user2: player2Scope } = useScopeContainer()

  const { turn, board } = useBoardNamespaceStores((state) => {
    return { turn: state.turn, board: state.board }
  })

  // you can swap scope whatever you want
  const currentUserScope = turn % 2 === 0 ? player1Scope : player2Scope

  const game = useBoardNamespaceContext()!
  const repository = useRepositoryContext(currentUserScope.__scopeTicTacToeRepository)!
  const useCase = new TicTacToeUseCase(game, repository)

  const handleMove = async (row: number, col: number) => {
    await useCase.play({ row, col })
  }

  const resetGame = async () => {
    await useCase.resetGame()
  }

  return (
    <div>
      <h2>Tic Tac Toe</h2>
      <span>current Player : {repository?.getIcon()}</span>

      {game.getWinner() && <p>Winner: {game.getWinner()}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 100px)' }}>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <button
              type="button"
              // this is just simple example, so i just ignore the key warning
              // eslint-disable-next-line react/no-array-index-key
              key={`${rowIndex}-${colIndex}`}
              style={{ width: '100px', height: '100px', fontSize: '24px' }}
              onClick={() => handleMove(rowIndex, colIndex)}
              disabled={!!cell || !!game.getWinner()}
            >
              {cell}
            </button>
          )),
        )}
      </div>
      <button type="button" onClick={resetGame}>
        Reset
      </button>
    </div>
  )
}

export default TicTacToeGame
