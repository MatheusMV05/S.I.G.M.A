import { useState, useEffect, useCallback } from 'react';
import { 
  employeeService, 
  type Funcionario, 
  type CreateFuncionarioRequest,
  type EstatisticasSetor,
  StatusFuncionario 
} from '@/services/employeeService';
import { toast } from 'sonner';

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
      toast.error(`Erro ao carregar: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Carrega ao montar e quando filtros mudam
  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  // Criar funcionário
  const createEmployee = async (data: CreateFuncionarioRequest): Promise<boolean> => {
    try {
      setLoading(true);
      await employeeService.createEmployee(data);
      toast.success(`${data.nome} foi cadastrado com sucesso!`);
      await loadEmployees();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar funcionário';
      toast.error(errorMessage);
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
      toast.success('Dados atualizados com sucesso!');
      await loadEmployees();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar funcionário';
      toast.error(errorMessage);
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
      toast.success(`${nome} foi removido do sistema`);
      await loadEmployees();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar funcionário';
      
      // Se for erro de constraint, não mostra toast (será tratado no componente)
      if (!errorMessage.includes('foreign key constraint') && 
          !errorMessage.includes('Cannot delete or update a parent row')) {
        toast.error(errorMessage);
      }
      
      // Re-lança o erro para ser tratado no componente
      throw err;
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
      toast.success(`Funcionário ${newStatus} com sucesso!`);
      await loadEmployees();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao alterar status';
      toast.error(errorMessage);
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
      toast.error(errorMessage);
      return null;
    }
  };

  // Buscar funcionário por matrícula
  const getEmployeeByMatricula = async (matricula: string): Promise<Funcionario | null> => {
    try {
      return await employeeService.getEmployeeByMatricula(matricula);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Funcionário não encontrado';
      toast.error(errorMessage);
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

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await employeeService.getStatsByDepartment();
      setStats(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar estatísticas';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

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
