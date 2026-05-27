import api from './api';
import type { SchedulerBlock, CreateSchedulerBlockDto, UpdateSchedulerBlockDto } from '../types';

export const schedulerBlocksService = {
  getByBarber: (barberId: number) => api.get<SchedulerBlock[]>(`/schedule-blocks/barber/${barberId}`),
  
  create: (data: CreateSchedulerBlockDto) => api.post<SchedulerBlock>('/schedule-blocks', data),
  
  update: (id: number, data: UpdateSchedulerBlockDto) => api.put<SchedulerBlock>(`/schedule-blocks/${id}`, data),
  
  delete: (id: number) => api.delete(`/schedule-blocks/${id}`),
};
