import { createNamespaceContext, createNamespaceScope, createScopeContainer, Scope } from '@lodado/react-namespace'

import PlayerPresenter from '../models/PlayerPresenter'
import TicTacToePresenter from '../models/TicTacToePresenter'

export const [createRepositoryProvider, createRepositoryScope] = createNamespaceScope('TicTacToe')

export const {
  Provider: PlayerProvider,
  useNamespaceStores: usePlayerStores,
  useNamespaceContext: usePlayerContext,
} = createRepositoryProvider<PlayerPresenter>('Player', {})

export const createUser1Scope = createRepositoryScope()
export const createUser2Scope = createRepositoryScope()

export const {
  Provider: BoardProvider,
  useNamespaceStores: useBoardNamespaceStores,
  useNamespaceContext: useBoardNamespaceContext,
} = createNamespaceContext({
  globalStore: () => new TicTacToePresenter(),
})

export const { ScopeContainerProvider, useScopeContainer } = createScopeContainer<'user1' | 'user2'>()
