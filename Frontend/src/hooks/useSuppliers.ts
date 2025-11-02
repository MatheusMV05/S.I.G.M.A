import { useState, useEffect } from 'react';
import { supplierService, type Fornecedor, type CreateFornecedorRequest, type SupplierProduct } from '@/services/supplierService';
import { useNotifications } from '@/contexts/NotificationContext';

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotifications();

  const fetchSuppliers = async (search?: string, status?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await supplierService.getSuppliers({ search, status });
      setSuppliers(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar fornecedores';
      setError(errorMessage);
      addNotification({
        type: 'error',
        title: 'Erro ao carregar fornecedores',
        message: errorMessage,
        priority: 'high',
      });
    } finally {
      setLoading(false);
    }
  };

  const createSupplier = async (supplierData: CreateFornecedorRequest): Promise<boolean> => {
    try {
      setLoading(true);
      await supplierService.createSupplier(supplierData);
      addNotification({
        type: 'success',
        title: 'Fornecedor criado',
        message: 'Fornecedor cadastrado com sucesso!',
        priority: 'medium',
      });
      await fetchSuppliers();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar fornecedor';
      addNotification({
        type: 'error',
        title: 'Erro ao criar fornecedor',
        message: errorMessage,
        priority: 'high',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateSupplier = async (id: number, supplierData: Partial<CreateFornecedorRequest>): Promise<boolean> => {
    try {
      setLoading(true);
      await supplierService.updateSupplier(id, supplierData);
      addNotification({
        type: 'success',
        title: 'Fornecedor atualizado',
        message: 'Fornecedor atualizado com sucesso!',
        priority: 'medium',
      });
      await fetchSuppliers();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar fornecedor';
      addNotification({
        type: 'error',
        title: 'Erro ao atualizar fornecedor',
        message: errorMessage,
        priority: 'high',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteSupplier = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      await supplierService.deleteSupplier(id);
      addNotification({
        type: 'success',
        title: 'Fornecedor excluído',
        message: 'Fornecedor excluído com sucesso!',
        priority: 'medium',
      });
      await fetchSuppliers();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir fornecedor';
      addNotification({
        type: 'error',
        title: 'Erro ao excluir fornecedor',
        message: errorMessage,
        priority: 'high',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getSupplierProducts = async (id: number): Promise<SupplierProduct[]> => {
    try {
      return await supplierService.getSupplierProducts(id);
    } catch (err) {
      console.error('Erro ao buscar produtos do fornecedor:', err);
      return [];
    }
  };

  const toggleStatus = async (id: number, ativo: boolean): Promise<boolean> => {
    try {
      setLoading(true);
      await supplierService.toggleSupplierStatus(id, ativo);
      addNotification({
        type: 'success',
        title: 'Status alterado',
        message: `Fornecedor ${ativo ? 'ativado' : 'desativado'} com sucesso!`,
        priority: 'medium',
      });
      await fetchSuppliers();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao alterar status';
      addNotification({
        type: 'error',
        title: 'Erro ao alterar status',
        message: errorMessage,
        priority: 'high',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return {
    suppliers,
    loading,
    error,
    fetchSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    getSupplierProducts,
    toggleStatus,
  };
}
