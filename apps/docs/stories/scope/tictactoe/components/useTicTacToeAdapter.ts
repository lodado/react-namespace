import { TicTacToeUseCase } from './models/TicTacToeUsecase'
import { useBoardNamespaceContext, useBoardNamespaceStores, useRepositoryContext, useScopeContainer } from './Provider'

const useTicTacToeAdapter = () => {
  const { user1: player1Scope, user2: player2Scope } = useScopeContainer()

  const { turn, board, winner } = useBoardNamespaceStores((state) => {
    return { turn: state.turn, board: state.board, winner: state.winner }
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

  return {
    board,
    turn,
    winner,
    icon: repository.getIcon(),
    handleMove,
    resetGame,
  }
}

export default useTicTacToeAdapter
