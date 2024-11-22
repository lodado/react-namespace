import React, { useState } from 'react'

import { createTodoScope, TodoProvider } from './scope'
import TodoList from './ToDoList'

const user1Scope = createTodoScope()
const user2Scope = createTodoScope()
const user3Scope = createTodoScope()

const App = () => {
  const [activeUserId, setActiveUserId] = useState<'user1' | 'user2' | 'user3'>('user1')
  const todoScopes = {
    user1: user1Scope({}),
    user2: user2Scope({}),
    user3: user3Scope({}),
  } as const

  const handleUserChange = (userId: 'user1' | 'user2' | 'user3') => {
    setActiveUserId(userId)
  }

  const scope = todoScopes?.[activeUserId]?.__scopeTodoList

  return (
    <div>
      <h1>Multi-User To-Do List</h1>
      <div>
        <button type="button" onClick={() => handleUserChange('user1')}>
          Switch to User 1
        </button>
        <button type="button" onClick={() => handleUserChange('user2')}>
          Switch to User 2
        </button>
        <button type="button" onClick={() => handleUserChange('user3')}>
          Switch to User 3
        </button>
      </div>
      <TodoProvider scope={todoScopes.user1?.__scopeTodoList}>
        <TodoProvider scope={todoScopes.user2?.__scopeTodoList}>
          <TodoProvider scope={todoScopes.user3?.__scopeTodoList}>
            <TodoList scope={scope} />
          </TodoProvider>
        </TodoProvider>
      </TodoProvider>
    </div>
  )
}

export default App
