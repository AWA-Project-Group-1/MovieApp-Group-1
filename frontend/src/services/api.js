import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

const instance = axios.create({
  baseURL: `${baseUrl}/api`,
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
