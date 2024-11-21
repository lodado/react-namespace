import { NamespaceStore } from '@lodado/namespace-core'

/**
 * Represents the state of a Tic Tac Toe game.
 */
export default class TicTacToe extends NamespaceStore<{
  board: (string | null)[][]
  winner: string | 'Draw' | null
}> {
  constructor() {
    super({
      board: Array(3)
        .fill(null)
        .map(() => Array(3).fill(null)),
      winner: null,
    })
  }

  /**
   * Get the game board.
   */
  getBoard(): (string | null)[][] {
    return this.state.board
  }

  /**
   * Get the winner.
   */
  getWinner(): string | 'Draw' | null {
    return this.state.winner
  }

  /**
   * Make a move at the specified row and column for the given player's icon.
   */
  makeMove(row: number, col: number, icon: string): void {
    if (this.state.winner) {
      alert('game is already over!')
      return
    }
    if (this.state.board[row][col]) {
      alert('Cell is already occupied!')
      return
    }

    this.state.board[row][col] = icon
    this.checkWinner(icon)
  }

  /**
   * Reset the game to its initial state.
   */
  reset(): void {
    this.state.board = Array(3)
      .fill(null)
      .map(() => Array(3).fill(null))
    this.state.winner = null
  }

  /**
   * Check if there's a winner or if the game is a draw.
   */
  private checkWinner(icon: string): void {
    const { board } = this.state

    // Check rows, columns, and diagonals for a winner.
    const lines = [
      ...board,
      ...board[0].map((_, col) => board.map((row) => row[col])),
      [board[0][0], board[1][1], board[2][2]],
      [board[0][2], board[1][1], board[2][0]],
    ]

    if (
      lines.some((line) => {
        if (line.every((cell) => cell === icon)) {
          this.state.winner = icon
          return true
        }

        return false
      })
    )
      return

    // Check for draw.
    if (board.flatMap((ele) => ele).every((cell) => cell)) {
      this.state.winner = 'Draw'
    }
  }
}
