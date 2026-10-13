import axios from 'axios';

// Helper to determine normalized API baseURL
const getBaseURL = () => {
  let url = process.env.REACT_APP_API_URL;
  if (!url || !url.trim()) {
    return '/api';
  }
  // Trim trailing slashes
  url = url.trim().replace(/\/+$/, '');
  // If the URL does not already end with /api, append /api
  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }
  return url;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
