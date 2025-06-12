import axios from 'axios';

// Create axios instance with base configuration
const API = axios.create({
  baseURL: 'http://localhost:8080', // backend
  timeout: 10000,
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
    
    console.log(config.headers);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - 处理错误
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);

    // // handle network error
    // if (!error.response){
    //     console.error('Network Error: failed to connect Server');
    //     return Promise.reject({
    //         message: 'Failed to connect internet, pleasae double check',
    //         code: 'NETWORK_ERROR' 
    //     });
    // }

    const { status, data } = error.response;

    // switch (status) {
    //   case 401:
    //     // 未授权 - 清除token并重定向
    //     localStorage.removeItem('token');
    //     localStorage.removeItem('userId');
    //     localStorage.removeItem('userRole');
    //     window.location.href = '/login';
    //     break;
    //   case 403:
    //     console.error('权限不足');
    //     break;
    //   case 404:
    //     console.error('资源未找到');
    //     break;
    //   case 500:
    //     console.error('服务器内部错误');
    //     break;
    //   default:
    //     console.error(`HTTP Error ${status}:`, data?.message || error.message);
    // }

    if (error.response?.status === 401) {
      // Token 过期，跳转到登录页
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;