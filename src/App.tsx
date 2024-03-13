import React, { useState, useEffect } from 'react';
import './App.css';

interface Todo {
  id: number;
  text: string;
  priority: 'low' | 'medium' | 'high';
}

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    let existing: Todo[] = [];
    let storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      existing = JSON.parse(storedTodos);
    }
    return existing;
  });

  const [inputText, setInputText] = useState<string>(() => '');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [selectedTodos, setSelectedTodos] = useState<number[]>([]);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (inputText.trim() !== '') {
      if (todos.length >= 5) {
        setErrorMessage('You can only have 5 todos at a time.');
        return;
      }
      const newTodo: Todo = { id: Date.now(), text: inputText, priority };
      setTodos(prevTodos => [...prevTodos, newTodo]);
      setInputText('');
    }
  };

  const deleteTodo = (id: number) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    setSelectedTodos(prevSelected => prevSelected.filter(todoId => todoId !== id));
  };

  const deleteSelectedTodos = () => {
    setTodos(prevTodos => prevTodos.filter(todo => !selectedTodos.includes(todo.id)));
    setSelectedTodos([]);
  };

  const updateTodo = (id: number, newText: string) => {
    setTodos(prevTodos =>
      prevTodos.map(todo => (todo.id === id ? { ...todo, text: newText } : todo))
    );
    setEditingId(null);
  };

  const handleEdit = (id: number) => {
    const todoToEdit = todos.find(todo => todo.id === id);
    if (todoToEdit) {
      setInputText(todoToEdit.text);
      setPriority(todoToEdit.priority);
      setEditingId(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId !== null) {
      updateTodo(editingId, inputText);
    } else {
      addTodo();
    }
  };

  const handleCheckboxChange = (id: number) => {
    if (selectedTodos.includes(id)) {
      setSelectedTodos(prevSelected => prevSelected.filter(todoId => todoId !== id));
    } else {
      setSelectedTodos(prevSelected => [...prevSelected, id]);
    }
  };

  return (
    <div className="container">
      <div className="todo-list">
        <h1>To-Do List</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Enter a new task"
          />
          <select
            value={priority}
            onChange={e => setPriority(e.target.value as 'low' | 'medium' | 'high')}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button type="submit">{editingId !== null ? 'Update' : 'Add'}</button>
        </form>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <button
          className="delete-selected"
          onClick={deleteSelectedTodos}
          disabled={selectedTodos.length === 0}
        >
          Delete Selected
        </button>
        <ol>
          {todos.map((todo, index) => (
            <li key={todo.id}>
              <input
                type="checkbox"
                checked={selectedTodos.includes(todo.id)}
                onChange={() => handleCheckboxChange(todo.id)}
              />
              <span className={`priority-${todo.priority}`}>{todo.priority}</span>
              <span>{index + 1} </span>
              {editingId === todo.id ? (
                <form onSubmit={e => handleSubmit(e)}>
                  <input
                    type="text"
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                  />
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <button type="submit">Update</button>
                </form>
              ) : (
                todo.text
              )}
              <button onClick={() => handleEdit(todo.id)}>Edit</button>
              <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default App;
