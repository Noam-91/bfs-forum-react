import axios from 'axios';

// Create axios instance with base configuration
const API = axios.create({
  baseURL: 'http://localhost:8080', // 您的后端地址
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - 添加 token 或 user-id
API.interceptors.request.use(
  (config) => {
    // TODO: 从 localStorage 或 Redux 获取 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 如果需要 User-Id header
    const userId = localStorage.getItem('userId');
    if (userId) {
      config.headers['X-User-Id'] = userId;
    }

    const userRole = localStorage.getItem('userRole');
    if(userRole){
        config.headers['X-User-Role'] = userRole;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - 处理错误
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token 过期，跳转到登录页
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;