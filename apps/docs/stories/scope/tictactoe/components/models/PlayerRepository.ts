import { NamespaceStore } from '@lodado/namespace-core'

/**
 * TicTacToe Player Repository handles player-specific data.
 */
export default class PlayerRepository extends NamespaceStore<{ icon: string }> {
  constructor(icon: string) {
    super({ icon })
  }

  /**
   * Get the player's icon.
   */
  getIcon(): string {
    return this.state.icon
  }

  /**
   * Perform additional player-specific actions if needed (e.g., logging moves).
   */
  logMove(row: number, col: number): void {
    // console.log(`Player ${this.state.icon} moved to (${row}, ${col})`)
  }
}
