import { useState, useEffect } from 'react';
import TodoService from './services/api';
import './App.css';

function App() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const data = await TodoService.getAllTodos();
            setTodos(data);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    const addTodo = async (e) => {
        e.preventDefault();
        if (!newTodo.trim()) return;

        try {
            const newTodoData = await TodoService.createTodo(newTodo);
            setTodos([...todos, newTodoData]);
            setNewTodo('');
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    };

    const toggleTodo = async (id, completed) => {
        try {
            await TodoService.updateTodoStatus(id, !completed);
            setTodos(todos.map(todo =>
                todo._id === id ? { ...todo, completed: !todo.completed } : todo
            ));
        } catch (error) {
            console.error('Error toggling todo:', error);
        }
    };

    const deleteTodo = async (id) => {
        try {
            await TodoService.deleteTodo(id);
            setTodos(todos.filter(todo => todo._id !== id));
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    return (
        <div className="container">
            <h1>Todo App</h1>

            <form onSubmit={addTodo} className="todo-form">
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add a new todo..."
                    className="todo-input"
                />
                <button type="submit" className="add-button">Add Todo</button>
            </form>

            <div className="todos-list">
                {todos.map((todo) => (
                    <div key={todo._id} className="todo-item">
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => toggleTodo(todo._id, todo.completed)}
                            className="todo-checkbox"
                        />
                        <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                            {todo.text}
                        </span>
                        <button
                            onClick={() => deleteTodo(todo._id)}
                            className="delete-button"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App; 