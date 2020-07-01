import React, { useEffect, useState } from 'react'
import { API, Auth, graphqlOperation } from 'aws-amplify'
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import { createTodo, deleteTodo } from './graphql/mutations'
import { listTodos } from './graphql/queries'
import { onCreateTodo, onDeleteTodo } from './graphql/subscriptions'

const initialState = { name: '', description: '' }

const App = () => {
  const [formState, setFormState] = useState(initialState)
  const [todos, setTodos] = useState([])
  const [currentUser, setCurrentUser] = useState('')

  useEffect(() => {
    fetchTodos()
  }, [])

  useEffect(() => {
    const subscription = API.graphql(graphqlOperation(onCreateTodo)).subscribe({
      next: (todoData) => {
        setTodos([...todos, todoData.value.data.onCreateTodo])
      },
    })

    return () => {
      subscription.unsubscribe()
    }
  })

  useEffect(() => {
    const subscription = API.graphql(graphqlOperation(onDeleteTodo)).subscribe({
      next: (todoData) => {
        setTodos(
          todos.filter(
            (todo) => todo.id !== todoData.value.data.onDeleteTodo.id,
          ),
        )
      },
    })

    return () => {
      subscription.unsubscribe()
    }
  })

  useEffect(() => {
    Auth.currentAuthenticatedUser().then((data) => {
      setCurrentUser(data.username)
    })
  }, [])

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  async function fetchTodos() {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos))
      const todos = todoData.data.listTodos.items
      setTodos(todos)
    } catch (err) {
      console.log('error fetching todos')
    }
  }

  async function addTodo() {
    try {
      if (!formState.name || !formState.description) return
      const todo = { ...formState }
      setFormState(initialState)
      await API.graphql(graphqlOperation(createTodo, { input: todo }))
    } catch (err) {
      console.log('error creating todo:', err)
    }
  }

  async function removeTodo(id) {
    try {
      await API.graphql(graphqlOperation(deleteTodo, { input: { id } }))
    } catch (err) {
      console.log('error deleting todo:', err)
    }
  }

  return (
    <div style={styles.container}>
      <h2>Amplify Todos</h2>
      <p>Logged in as: {currentUser}</p>
      <input
        onChange={(event) => setInput('name', event.target.value)}
        style={styles.input}
        value={formState.name}
        placeholder="Name"
      />
      <input
        onChange={(event) => setInput('description', event.target.value)}
        style={styles.input}
        value={formState.description}
        placeholder="Description"
      />
      <button style={styles.button} onClick={addTodo}>
        Create Todo
      </button>
      {todos.map((todo, index) => (
        <div key={todo.id ? todo.id : index} style={styles.todo}>
          <div style={styles.left}>
            <p style={styles.todoName}>{todo.name}</p>
            <p style={styles.todoDescription}>{todo.description}</p>
            <span style={styles.author}>Created by: {todo.owner}</span>
          </div>
          <div style={styles.right}>
            {todo.owner === currentUser && (
              <button
                style={styles.deleteButton}
                onClick={() => removeTodo(todo.id)}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
      <p style={styles.signOut}>
        <AmplifySignOut />
      </p>
    </div>
  )
}

const styles = {
  container: {
    width: 400,
    margin: '0 auto',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 20,
  },
  todo: { marginBottom: 15, display: 'inline-flex', alignItems: 'center' },
  input: {
    border: 'none',
    backgroundColor: '#ddd',
    marginBottom: 10,
    padding: 8,
    fontSize: 18,
  },
  todoName: { fontSize: 20, fontWeight: 'bold', marginBottom: 0 },
  todoDescription: { marginBottom: 3, marginTop: 5 },
  button: {
    backgroundColor: '#ff9900',
    color: 'white',
    outline: 'none',
    fontSize: 12,
    padding: 14,
    fontWeight: 400,
    textTransform: 'uppercase',
    border: 0,
    lineHeight: '17px',
  },
  author: {
    fontSize: 12,
  },
  deleteButton: {
    float: 'right',
  },
  left: {
    width: '50%',
  },
  right: {
    width: '50%',
    textAlign: 'right',
  },
  signOut: {
    marginTop: 45,
  },
}

export default withAuthenticator(App)
