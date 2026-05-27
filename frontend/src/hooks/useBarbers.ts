import { useState, useEffect } from 'react';
import { barbersService } from '../services/barbers';
import type { Barber } from '../types';

export function useBarbers() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBarbers = async () => {
    try {
      setLoading(true);
      const response = await barbersService.getAll();
      setBarbers(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar barberos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarbers();
  }, []);

  const createBarber = async (data: { user_id: number; biography?: string }) => {
    try {
      const response = await barbersService.create(data);
      setBarbers((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error('Error creating barber:', err);
      throw err;
    }
  };

  const updateBarber = async (id: number, data: Partial<Barber>) => {
    try {
      const response = await barbersService.update(id, data);
      setBarbers((prev) => prev.map((b) => (b.id === id ? response.data : b)));
      return response.data;
    } catch (err) {
      console.error('Error updating barber:', err);
      throw err;
    }
  };

  const deleteBarber = async (id: number) => {
    try {
      await barbersService.delete(id);
      setBarbers((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error('Error deleting barber:', err);
      throw err;
    }
  };

  return { barbers, loading, error, fetchBarbers, createBarber, updateBarber, deleteBarber };
}
