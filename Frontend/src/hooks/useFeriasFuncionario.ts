import { useState, useEffect } from 'react';
import { apiRequest } from '@/services/api';

export interface FeriasFuncionario {
  idFerias?: number;
  idFuncionario: number;
  periodoAquisitivoInicio?: string;
  periodoAquisitivoFim?: string;
  dataInicioFerias: string;
  dataFimFerias: string;
  diasGozados: number;
  abonoPecuniario?: boolean;
  statusFerias?: 'PROGRAMADAS' | 'EM_ANDAMENTO' | 'CONCLUIDAS' | 'CANCELADAS';
  observacoes?: string;
  dataCadastro?: string;
  nomeFuncionario?: string;
  matriculaFuncionario?: string;
  cargoFuncionario?: string;
  setorFuncionario?: string;
}

export interface StatusFerias {
  total: number;
  programadas: number;
  emAndamento: number;
  concluidas: number;
  canceladas: number;
}

export const useFeriasFuncionario = () => {
  const [ferias, setFerias] = useState<FeriasFuncionario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFerias = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<FeriasFuncionario[]>('/ferias-funcionario');
      setFerias(response || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar férias');
      console.error('Erro ao carregar férias:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchByFuncionario = async (funcionarioId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<FeriasFuncionario[]>(`/ferias-funcionario/funcionario/${funcionarioId}`);
      setFerias(response || []);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar férias');
      console.error('Erro ao carregar férias:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchByStatus = async (status: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<FeriasFuncionario[]>(`/ferias-funcionario/status/${status}`);
      setFerias(response || []);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar férias');
      console.error('Erro ao carregar férias:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchByPeriodo = async (dataInicio: string, dataFim: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<FeriasFuncionario[]>(`/ferias-funcionario/periodo?dataInicio=${dataInicio}&dataFim=${dataFim}`);
      setFerias(response || []);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar férias');
      console.error('Erro ao carregar férias:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchProgramadasProximos = async (dias: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<FeriasFuncionario[]>(`/ferias-funcionario/proximas?dias=${dias}`);
      return response || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar férias programadas');
      console.error('Erro ao carregar férias programadas:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchStatusFerias = async () => {
    setLoading(true);
    setError(null);
    try {
      // Como não temos endpoint /status-resumo, vamos calcular manualmente
      const todas = await apiRequest<FeriasFuncionario[]>('/ferias-funcionario');
      
      const status: StatusFerias = {
        total: todas?.length || 0,
        programadas: todas?.filter(f => f.statusFerias === 'PROGRAMADAS').length || 0,
        emAndamento: todas?.filter(f => f.statusFerias === 'EM_ANDAMENTO').length || 0,
        concluidas: todas?.filter(f => f.statusFerias === 'CONCLUIDAS').length || 0,
        canceladas: todas?.filter(f => f.statusFerias === 'CANCELADAS').length || 0,
      };
      
      return status;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar status das férias');
      console.error('Erro ao carregar status das férias:', err);
      // Retorna valores padrão em caso de erro
      return { total: 0, programadas: 0, emAndamento: 0, concluidas: 0, canceladas: 0 };
    } finally {
      setLoading(false);
    }
  };

  const createFerias = async (feriaData: Omit<FeriasFuncionario, 'idFerias'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<FeriasFuncionario>('/ferias-funcionario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feriaData),
      });
      await fetchFerias();
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar férias');
      console.error('Erro ao criar férias:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateFerias = async (id: number, feriaData: Partial<FeriasFuncionario>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<FeriasFuncionario>(`/ferias-funcionario/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feriaData),
      });
      await fetchFerias();
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar férias');
      console.error('Erro ao atualizar férias:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelarFerias = async (id: number, motivo?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<FeriasFuncionario>(`/ferias-funcionario/${id}/cancelar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: motivo ? JSON.stringify({ motivo }) : undefined,
      });
      await fetchFerias();
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cancelar férias');
      console.error('Erro ao cancelar férias:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteFerias = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await apiRequest(`/ferias-funcionario/${id}`, { method: 'DELETE' });
      await fetchFerias();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir férias');
      console.error('Erro ao excluir férias:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFerias();
  }, []);

  return {
    ferias,
    loading,
    error,
    fetchFerias,
    fetchByFuncionario,
    fetchByStatus,
    fetchByPeriodo,
    fetchProgramadasProximos,
    fetchStatusFerias,
    createFerias,
    updateFerias,
    cancelarFerias,
    deleteFerias,
  };
};
