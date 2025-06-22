import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api' | 'http://3.110.121.186:3000/api';

// Create axios instance with timeout and error handling
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000, // 5 second timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor for debugging
api.interceptors.request.use(
    (config) => {
        console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`);
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add a response interceptor for debugging
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.code === 'ERR_NETWORK') {
            console.error('Network Error: Please check if the backend server is running on port 5000');
        } else if (error.response) {
            console.error('Response Error:', error.response.data);
        } else if (error.request) {
            console.error('Request Error:', error.request);
        } else {
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export const TodoService = {
    // Get all todos
    getAllTodos: async () => {
        try {
            const response = await api.get('/todos');
            return response.data;
        } catch (error) {
            console.error('Error fetching todos:', error);
            throw error;
        }
    },

    // Create a new todo
    createTodo: async (text) => {
        try {
            const response = await api.post('/todos', { text });
            return response.data;
        } catch (error) {
            console.error('Error creating todo:', error);
            throw error;
        }
    },

    // Update todo status
    updateTodoStatus: async (id, completed) => {
        try {
            const response = await api.put(`/todos/${id}`, { completed });
            return response.data;
        } catch (error) {
            console.error('Error updating todo:', error);
            throw error;
        }
    },

    // Delete a todo
    deleteTodo: async (id) => {
        try {
            const response = await api.delete(`/todos/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting todo:', error);
            throw error;
        }
    },
};

export default TodoService; 
