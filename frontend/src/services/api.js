import axios from 'axios';

// const API = axios.create({
//   baseURL: 'http://localhost:5000/api',
//   headers: { 'Content-Type': 'application/json' }
// });

const API = axios.create({
  baseURL:
    window.location.hostname === 'localhost'
      ? 'http://localhost:5000/api'
      : 'https://multi-vendor-ecommerce-a0hw.onrender.com/api'
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;