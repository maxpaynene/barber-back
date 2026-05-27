import { useState, useEffect } from 'react';
import { usersService } from '../services/api';
import type { User } from '../types';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersService.getAll();
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar usuarios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const createUser = async (data: { email: string; name: string; password?: string }) => {
    try {
      const response = await usersService.create(data);
      setUsers((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error('Error creating user:', err);
      throw err;
    }
  };

  const updateUser = async (id: number, data: Partial<User>) => {
    try {
      const response = await usersService.update(id, data);
      setUsers((prev) => prev.map((u) => (u.id === id ? response.data : u)));
      return response.data;
    } catch (err) {
      console.error('Error updating user:', err);
      throw err;
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await usersService.delete(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
      throw err;
    }
  };

  return { users, loading, error, fetchUsers, createUser, updateUser, deleteUser };
}
