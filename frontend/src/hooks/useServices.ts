import { useState, useEffect } from 'react';
import { servicesService } from '../services/services';
import type { Service } from '../types';

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await servicesService.getAll();
      setServices(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar servicios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const createService = async (data: { name: string; price: number; description?: string; duration_minutes?: number }) => {
    try {
      const response = await servicesService.create(data);
      setServices((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error('Error creating service:', err);
      throw err;
    }
  };

  const updateService = async (id: number, data: Partial<Service>) => {
    try {
      const response = await servicesService.update(id, data);
      setServices((prev) => prev.map((s) => (s.id === id ? response.data : s)));
      return response.data;
    } catch (err) {
      console.error('Error updating service:', err);
      throw err;
    }
  };

  const deleteService = async (id: number) => {
    try {
      await servicesService.delete(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Error deleting service:', err);
      throw err;
    }
  };

  return { services, loading, error, fetchServices, createService, updateService, deleteService };
}
