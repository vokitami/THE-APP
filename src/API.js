import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// 👇 Interceptor que agrega el token a cada petición automáticamente
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;