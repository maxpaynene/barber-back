import axios from 'axios';
import type { User, CreateUserDto, UpdateUserDto } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const usersService = {
  getAll: () => api.get<User[]>('/users'),
  
  create: (data: CreateUserDto) => api.post<User>('/users', data),
  
  update: (id: number, data: UpdateUserDto) => api.put<User>(`/users/${id}`, data),
  
  delete: (id: number) => api.delete(`/users/${id}`),
};

export default api;
