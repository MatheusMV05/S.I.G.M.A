import { useState, useEffect, useCallback } from 'react';
import { 
  employeeService, 
  type Funcionario, 
  type CreateFuncionarioRequest,
  type EstatisticasSetor,
  StatusFuncionario 
} from '@/services/employeeService';
import { useNotifications } from '@/contexts/NotificationContext';

interface UseEmployeesFilters {
  cargo?: string;
  setor?: string;
  status?: StatusFuncionario;
}

export function useEmployees(initialFilters?: UseEmployeesFilters) {
  const [employees, setEmployees] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<UseEmployeesFilters>(initialFilters || {});
  const { addNotification } = useNotifications();

  // Carrega funcionários
  const loadEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await employeeService.getEmployees(filters);
      setEmployees(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar funcionários';
      setError(errorMessage);
      addNotification({
        type: 'error',
        title: 'Erro ao Carregar',
        message: errorMessage,
        priority: 'high'
      });
    } finally {
      setLoading(false);
    }
  }, [filters, addNotification]);

  // Carrega ao montar e quando filtros mudam
  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  // Criar funcionário
  const createEmployee = async (data: CreateFuncionarioRequest): Promise<boolean> => {
    try {
      setLoading(true);
      await employeeService.createEmployee(data);
      addNotification({
        type: 'success',
        title: 'Funcionário Criado',
        message: `${data.nome} foi cadastrado com sucesso!`,
        priority: 'medium'
      });
      await loadEmployees();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar funcionário';
      addNotification({
        type: 'error',
        title: 'Erro ao Criar',
        message: errorMessage,
        priority: 'high'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar funcionário
  const updateEmployee = async (id: number, data: Partial<CreateFuncionarioRequest>): Promise<boolean> => {
    try {
      setLoading(true);
      await employeeService.updateEmployee(id, data);
      addNotification({
        type: 'success',
        title: 'Funcionário Atualizado',
        message: 'Dados atualizados com sucesso!',
        priority: 'medium'
      });
      await loadEmployees();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar funcionário';
      addNotification({
        type: 'error',
        title: 'Erro ao Atualizar',
        message: errorMessage,
        priority: 'high'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Deletar funcionário
  const deleteEmployee = async (id: number, nome: string): Promise<boolean> => {
    try {
      setLoading(true);
      await employeeService.deleteEmployee(id);
      addNotification({
        type: 'success',
        title: 'Funcionário Removido',
        message: `${nome} foi removido do sistema.`,
        priority: 'medium'
      });
      await loadEmployees();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar funcionário';
      addNotification({
        type: 'error',
        title: 'Erro ao Deletar',
        message: errorMessage,
        priority: 'high'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Toggle status (ativa/inativa)
  const toggleEmployeeStatus = async (id: number, currentStatus: StatusFuncionario): Promise<boolean> => {
    try {
      setLoading(true);
      await employeeService.toggleEmployeeStatus(id);
      const newStatus = currentStatus === StatusFuncionario.ATIVO ? 'inativado' : 'ativado';
      addNotification({
        type: 'success',
        title: 'Status Alterado',
        message: `Funcionário ${newStatus} com sucesso!`,
        priority: 'medium'
      });
      await loadEmployees();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao alterar status';
      addNotification({
        type: 'error',
        title: 'Erro',
        message: errorMessage,
        priority: 'high'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Buscar funcionário por ID
  const getEmployeeById = async (id: number): Promise<Funcionario | null> => {
    try {
      return await employeeService.getEmployeeById(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar funcionário';
      addNotification({
        type: 'error',
        title: 'Erro',
        message: errorMessage,
        priority: 'medium'
      });
      return null;
    }
  };

  // Buscar funcionário por matrícula
  const getEmployeeByMatricula = async (matricula: string): Promise<Funcionario | null> => {
    try {
      return await employeeService.getEmployeeByMatricula(matricula);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Funcionário não encontrado';
      addNotification({
        type: 'error',
        title: 'Não Encontrado',
        message: errorMessage,
        priority: 'low'
      });
      return null;
    }
  };

  // Atualizar filtros
  const updateFilters = (newFilters: UseEmployeesFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Limpar filtros
  const clearFilters = () => {
    setFilters({});
  };

  return {
    employees,
    loading,
    error,
    filters,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    toggleEmployeeStatus,
    getEmployeeById,
    getEmployeeByMatricula,
    updateFilters,
    clearFilters,
    refresh: loadEmployees
  };
}

// Hook para estatísticas
export function useEmployeeStats() {
  const [stats, setStats] = useState<EstatisticasSetor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotifications();

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await employeeService.getStatsByDepartment();
      setStats(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar estatísticas';
      setError(errorMessage);
      addNotification({
        type: 'error',
        title: 'Erro',
        message: errorMessage,
        priority: 'medium'
      });
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    stats,
    loading,
    error,
    refresh: loadStats
  };
}

// Hook para opções de dropdown (departamentos, cargos, supervisores)
export function useEmployeeOptions() {
  const [departments, setDepartments] = useState<string[]>([]);
  const [positions, setPositions] = useState<string[]>([]);
  const [supervisors, setSupervisors] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoading(true);
        const [depts, pos, sups] = await Promise.all([
          employeeService.getDepartments(),
          employeeService.getPositions(),
          employeeService.getActiveEmployees()
        ]);
        
        setDepartments(depts);
        setPositions(pos);
        // Apenas gerentes e supervisores podem ser supervisores
        setSupervisors(sups.filter(emp => 
          emp.cargo.toLowerCase().includes('gerente') || 
          emp.cargo.toLowerCase().includes('supervisor')
        ));
      } catch (err) {
        console.error('Error loading employee options:', err);
      } finally {
        setLoading(false);
      }
    };

    loadOptions();
  }, []);

  return {
    departments,
    positions,
    supervisors,
    loading
  };
}
