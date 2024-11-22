import { createNamespaceScope } from '@lodado/react-namespace'

import TodoStore from './toDoStore'

export const [createTodoContext, createTodoScope] = createNamespaceScope('TodoList')

export const { Provider: TodoProvider, useNamespaceStores: useTodoNamespaceStore } = createTodoContext<TodoStore>(
  'TodoList',
  {
    localStore: () => new TodoStore(),
  },
)
