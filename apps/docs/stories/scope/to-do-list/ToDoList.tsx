import { Scope } from '@lodado/react-namespace'
import React, { useState } from 'react'

import { useTodoNamespaceStore } from './scope'

interface UserTodoListProps {
  scope: Scope<any>
}

const TodoList: React.FC<UserTodoListProps> = ({ scope }) => {
  const { user, todos, addTodo, toggleTodo, removeTodo } = useTodoNamespaceStore(
    (state) => ({ user: state.user, todos: state.todos }),
    scope,
  )
  const [newTodo, setNewTodo] = useState('')

  const handleAddTodo = () => {
    if (newTodo.trim() !== '') {
      addTodo(newTodo.trim())
      setNewTodo('')
    }
  }

  return (
    <div>
      <h2>{user} To-Do List</h2>
      <input type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} placeholder="Add a new task..." />
      <button type="button" onClick={handleAddTodo}>
        Add
      </button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} style={{ display: 'flex', alignItems: 'center' }}>
            <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id)} />
            <span
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                marginLeft: '8px',
              }}
            >
              {todo.title}
            </span>
            <button type="button" onClick={() => removeTodo(todo.id)} style={{ marginLeft: 'auto', color: 'red' }}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TodoList
