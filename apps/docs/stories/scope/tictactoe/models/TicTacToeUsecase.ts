import PlayerRepository from './PlayerRepository'
import TicTacToe from './TicTacToe'

/**
 * TicTacToe UseCase orchestrates game logic and player interactions.
 *
 * use case should be 3 usecases, but i am too lazy to make 3 example usecases for now..
 */
export class TicTacToeUseCase {
  private game: TicTacToe
  private playerRepo: PlayerRepository

  constructor(game: TicTacToe, playerRepo: PlayerRepository) {
    this.game = game
    this.playerRepo = playerRepo
  }

  /**
   * Make a move in the game for the given player.
   */
  async play({ row, col }: { row: number; col: number }): Promise<void> {
    const repo = this.playerRepo

    const icon = repo.getIcon()

    this.game.makeMove(row, col, icon)
    repo.logMove(row, col)
  }

  /**
   * Reset the game.
   */
  async resetGame(): Promise<void> {
    this.game.reset()
  }

  /**
   * Get the current game state.
   */
  async getGameState(): Promise<TicTacToe> {
    return this.game
  }
}
