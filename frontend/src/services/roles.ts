import api from './api';
import type { Role, CreateRoleDto, UpdateRoleDto } from '../types';

export const rolesService = {
  getAll: () => api.get<Role[]>('/roles'),
  
  create: (data: CreateRoleDto) => api.post<Role>('/roles', data),
  
  update: (id: number, data: UpdateRoleDto) => api.put<Role>(`/roles/${id}`, data),
  
  delete: (id: number) => api.delete(`/roles/${id}`),
};
