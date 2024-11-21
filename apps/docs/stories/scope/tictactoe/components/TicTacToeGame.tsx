import useTicTacToeAdapter from './useTicTacToeAdapter'

const TicTacToeGame = () => {
  const { board, icon, winner, handleMove, resetGame } = useTicTacToeAdapter()

  return (
    <div>
      <h2>Tic Tac Toe</h2>
      <span>current Player : {icon}</span>

      {winner && <p>Winner: {winner}</p>}
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
              disabled={!!cell || !!winner}
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
