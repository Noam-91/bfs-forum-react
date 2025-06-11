import axios from 'axios';

// Create axios instance with base configuration
const API = axios.create({
  baseURL: 'http://localhost:8080', // backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token or userId
API.interceptors.request.use(
  (config) => {
    // TODO: retrieve token from localStorage or Redux
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // X-User_Id header
    const userId = localStorage.getItem('userId');
    if (userId) {
      config.headers['X-User-Id'] = userId;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, navigate to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;