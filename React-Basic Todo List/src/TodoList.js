import React from 'react'
import Todo from './Todo'

export default function TodoList({ todos, toggleTodo }) {
  return (
    todos.map(todo => {
      // pass todo as para, make todo.name, todo.id available
      return <Todo key={todo.id} toggleTodo={toggleTodo} todo={todo} />
    })
  )
}
