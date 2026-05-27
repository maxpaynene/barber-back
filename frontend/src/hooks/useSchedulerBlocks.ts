import { useState, useEffect } from 'react';
import { schedulerBlocksService } from '../services/schedulerBlocks';
import type { SchedulerBlock } from '../types';

export function useSchedulerBlocks() {
  const [blocks, setBlocks] = useState<SchedulerBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlocksByBarber = async (barberId: number) => {
    try {
      setLoading(true);
      const response = await schedulerBlocksService.getByBarber(barberId);
      setBlocks(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar bloqueos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createBlock = async (data: { barber_id: number; date_start: Date; date_end: Date; reason?: string }) => {
    try {
      const response = await schedulerBlocksService.create(data);
      setBlocks((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error('Error creating block:', err);
      throw err;
    }
  };

  const updateBlock = async (id: number, data: Partial<SchedulerBlock>) => {
    try {
      const response = await schedulerBlocksService.update(id, data);
      setBlocks((prev) => prev.map((b) => (b.id === id ? response.data : b)));
      return response.data;
    } catch (err) {
      console.error('Error updating block:', err);
      throw err;
    }
  };

  const deleteBlock = async (id: number) => {
    try {
      await schedulerBlocksService.delete(id);
      setBlocks((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error('Error deleting block:', err);
      throw err;
    }
  };

  return { blocks, loading, error, fetchBlocksByBarber, createBlock, updateBlock, deleteBlock };
}
