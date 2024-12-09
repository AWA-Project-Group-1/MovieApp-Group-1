import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3001/api',
});

// Intercept requests to add the Authorization token if it exists
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default instance;