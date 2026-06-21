import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403 || error.response?.status === 401) {
      const message = error.response?.data?.message;
      if (message?.includes('banned') || error.response?.status === 401) {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('currentUser');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;