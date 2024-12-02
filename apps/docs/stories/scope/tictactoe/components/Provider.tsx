import { createNamespaceContext, createNamespaceScope, createScopeContainer, Scope } from '@lodado/react-namespace'

import PlayerRepository from './models/PlayerRepository'
import TicTacToe from './models/TicTacToe'

export const [createRepositoryProvider, createRepositoryScope] = createNamespaceScope('TicTacToeRepository')

export const {
  Provider: RepositoryProvider,
  useNamespaceStores: useRepositoryStores,
  useNamespaceContext: useRepositoryContext,
} = createRepositoryProvider<PlayerRepository>('repository', {})

export const createUser1Scope = createRepositoryScope()
export const createUser2Scope = createRepositoryScope()

export const {
  Provider: BoardProvider,
  useNamespaceStores: useBoardNamespaceStores,
  useNamespaceContext: useBoardNamespaceContext,
} = createNamespaceContext({
  globalStore: () => new TicTacToe(),
})

export const { ScopeContainerProvider, useScopeContainer } = createScopeContainer<'user1' | 'user2'>()
