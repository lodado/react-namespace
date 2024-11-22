import { NamespaceStore } from '@lodado/namespace-core'

export interface Todo {
  id: number
  title: string
  completed: boolean
}

export interface TodoState {
  todos: Todo[]
  user: string
}

let index = 0

export default class TodoStore extends NamespaceStore<TodoState> {
  constructor() {
    index += 1
    super({ user: `user${index}}`, todos: [] })
  }

  addTodo(title: string) {
    const newTodo: Todo = {
      id: Date.now(),
      title,
      completed: false,
    }
    this.state.todos = [...this.state.todos, newTodo]
  }

  toggleTodo(id: number) {
    this.state.todos = this.state.todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
  }

  removeTodo(id: number) {
    this.state.todos = this.state.todos.filter((todo) => todo.id !== id)
  }
}
