import axios from 'axios';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const userService = {
  // Get all users
  async getUsers() {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch users',error);
    }
  },

  // Get single user
  async getUser(id) {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch user',error);
    }
  },

  // Create user
  async createUser(userData) {
    try {
      const response = await api.post('/users', userData);
      // JSONPlaceholder returns id 11, but we'll generate a unique one
      return { ...response.data, id: Date.now() };
    } catch (error) {
      throw new Error('Failed to create user',error);
    }
  },

  // Update user
  async updateUser(id, userData) {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update user',error);
    }
  },

  // Delete user
  async deleteUser(id) {
    try {
      await api.delete(`/users/${id}`);
      return id;
    } catch (error) {
      throw new Error('Failed to delete user',error);
    }
  },
};
