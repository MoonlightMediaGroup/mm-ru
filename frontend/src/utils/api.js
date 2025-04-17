// src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (data) => api.post('/auth/users/', data);
export const login = (data) => api.post('/auth/jwt/create/', data);
export const telegramLogin = (data) => api.post('/auth/telegram/callback/', data);
export const resetPassword = (data) => api.post('/auth/users/reset_password/', data);
export const resetPasswordConfirm = (data) => api.post('/auth/users/reset_password_confirm/', data);
export const activateAccount = (data) => api.post('/auth/users/activation/', data);
export const getUserProfile = () => api.get('/auth/users/me/');
export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export default api;