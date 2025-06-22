import axios from 'axios';

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const API_BASE_URL = isLocalhost
  ? 'http://localhost:3000/api'
  : 'http://3.110.121.186:3000/api'; // your EC2 backend

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to ${API_BASE_URL}${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network Error: Backend unreachable');
    } else if (error.response) {
      console.error('Response Error:', error.response.data);
    } else if (error.request) {
      console.error('No response from server');
    } else {
      console.error('Axios Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Your todo service stays the same...
export const TodoService = {
  getAllTodos: async () => {
    try {
      const response = await api.get('/todos');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createTodo: async (text) => {
    try {
      const response = await api.post('/todos', { text });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateTodoStatus: async (id, completed) => {
    try {
      const response = await api.put(`/todos/${id}`, { completed });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteTodo: async (id) => {
    try {
      const response = await api.delete(`/todos/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default TodoService;
