import { Scope } from '@lodado/react-namespace'
import { useCallback, useMemo, useState } from 'react'

import TicTacToe from '../models/TicTacToe'
import { TicTacToeUseCase } from '../models/TicTacToeUsecase'
import { useBoardContext, useRepositoryContext } from './Provider'

const TicTacToeGame = ({ player1Scope, player2Scope }: { player1Scope: Scope<any>; player2Scope: Scope<any> }) => {
  const [turn, setTurn] = useState(0)

  // you can swap scope whatever you want
  const currentUserScope = turn % 2 === 0 ? player1Scope : player2Scope

  const game = useBoardContext()!
  const repository = useRepositoryContext(currentUserScope)!
  const useCase = new TicTacToeUseCase(game, repository)

  const handleMove = async (row: number, col: number) => {
    await useCase.play({ row, col })
    setTurn(turn + 1)
  }

  const resetGame = async () => {
    await useCase.resetGame()
    setTurn(turn + 1)
  }

  return (
    <div>
      <h2>Tic Tac Toe</h2>
      <span>current Player : {repository?.getIcon()}</span>

      {game.getWinner() && <p>Winner: {game.getWinner()}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 100px)' }}>
        {game.getBoard().map((row, rowIndex) =>
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
