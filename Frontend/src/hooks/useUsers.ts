import { useState, useEffect, useCallback } from 'react';
import userService, { UsuarioData, UsuarioStats } from '@/services/userService';

interface UseUsersOptions {
  autoLoad?: boolean;
  filters?: {
    role?: string;
    status?: string;
  };
}

export function useUsers(options: UseUsersOptions = {}) {
  const { autoLoad = true, filters } = options;

  const [users, setUsers] = useState<UsuarioData[]>([]);
  const [stats, setStats] = useState<UsuarioStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carrega todos os usuários
   */
  const loadUsers = useCallback(async (customFilters?: { role?: string; status?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getAll(customFilters || filters);
      setUsers(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar usuários';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /**
   * Carrega estatísticas
   */
  const loadStats = useCallback(async () => {
    try {
      const data = await userService.getStats();
      setStats(data);
      return data;
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
      return null;
    }
  }, []);

  /**
   * Busca um usuário por ID
   */
  const getUserById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getById(id);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar usuário';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cria um novo usuário
   */
  const createUser = useCallback(async (usuario: UsuarioData) => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await userService.create(usuario);
      setUsers(prev => [...prev, newUser]);
      await loadStats(); // Atualizar estatísticas
      return newUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar usuário';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadStats]);

  /**
   * Atualiza um usuário
   */
  const updateUser = useCallback(async (id: number, usuario: Partial<UsuarioData>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await userService.update(id, usuario);
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
      await loadStats(); // Atualizar estatísticas
      return updatedUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar usuário';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadStats]);

  /**
   * Atualiza apenas o status de um usuário
   */
  const updateUserStatus = useCallback(async (id: number, status: string) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await userService.updateStatus(id, status);
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
      await loadStats(); // Atualizar estatísticas
      return updatedUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadStats]);

  /**
   * Deleta um usuário
   */
  const deleteUser = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await userService.delete(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      await loadStats(); // Atualizar estatísticas
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar usuário';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadStats]);

  /**
   * Recarrega todos os dados
   */
  const refresh = useCallback(async () => {
    await Promise.all([loadUsers(), loadStats()]);
  }, [loadUsers, loadStats]);

  // Carregamento inicial
  useEffect(() => {
    if (autoLoad) {
      loadUsers();
      loadStats();
    }
  }, [autoLoad]); // Removido loadUsers e loadStats das dependências para evitar loops

  return {
    users,
    stats,
    loading,
    error,
    loadUsers,
    loadStats,
    getUserById,
    createUser,
    updateUser,
    updateUserStatus,
    deleteUser,
    refresh,
  };
}
