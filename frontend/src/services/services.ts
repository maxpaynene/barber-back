import api from './api';
import type { Service, CreateServiceDto, UpdateServiceDto } from '../types';

export const servicesService = {
  getAll: () => api.get<Service[]>('/services'),
  
  create: (data: CreateServiceDto) => api.post<Service>('/services', data),
  
  update: (id: number, data: UpdateServiceDto) => api.put<Service>(`/services/${id}`, data),
  
  delete: (id: number) => api.delete(`/services/${id}`),
};
