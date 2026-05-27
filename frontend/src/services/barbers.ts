import api from './api';
import type { Barber, CreateBarberDto, UpdateBarberDto } from '../types';

export const barbersService = {
  getAll: () => api.get<Barber[]>('/barbers'),
  
  getById: (id: number) => api.get<Barber>(`/barbers/${id}`),
  
  create: (data: CreateBarberDto) => api.post<Barber>('/barbers', data),
  
  update: (id: number, data: UpdateBarberDto) => api.put<Barber>(`/barbers/${id}`, data),
  
  delete: (id: number) => api.delete(`/barbers/${id}`),
};
