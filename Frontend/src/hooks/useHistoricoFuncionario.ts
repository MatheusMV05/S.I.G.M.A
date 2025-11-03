import { useState, useEffect } from 'react';
import { apiRequest } from '@/services/api';

export interface HistoricoFuncionario {
  idHistorico?: number;
  idFuncionario: number;
  tipoEvento: 'ADMISSAO' | 'PROMOCAO' | 'AUMENTO_SALARIAL' | 'MUDANCA_CARGO' | 'MUDANCA_SETOR' | 'DESLIGAMENTO' | 'FERIAS' | 'AFASTAMENTO';
  dataEvento: string;
  cargoAnterior?: string;
  cargoNovo?: string;
  setorAnterior?: string;
  setorNovo?: string;
  salarioAnterior?: number;
  salarioNovo?: number;
  descricao?: string;
  realizadoPor?: number;
  dataRegistro?: string;
  nomeFuncionario?: string;
  nomeRealizador?: string;
}

export const useHistoricoFuncionario = () => {
  const [historicos, setHistoricos] = useState<HistoricoFuncionario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistoricos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<HistoricoFuncionario[]>('/historico-funcionario');
      setHistoricos(response);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar históricos');
    } finally {
      setLoading(false);
    }
  };

  const fetchByFuncionario = async (idFuncionario: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<HistoricoFuncionario[]>(`/historico-funcionario/funcionario/${idFuncionario}`);
      setHistoricos(response);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar históricos');
    } finally {
      setLoading(false);
    }
  };

  const fetchByPeriodo = async (dataInicio: string, dataFim: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<HistoricoFuncionario[]>(`/historico-funcionario/periodo?dataInicio=${dataInicio}&dataFim=${dataFim}`);
      setHistoricos(response);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar históricos');
    } finally {
      setLoading(false);
    }
  };

  const createHistorico = async (historico: HistoricoFuncionario) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<HistoricoFuncionario>('/historico-funcionario', {
        method: 'POST',
        body: JSON.stringify(historico),
      });
      setHistoricos([response, ...historicos]);
      return response;
    } catch (err: any) {
      setError(err.message || 'Erro ao criar histórico');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registrarAdmissao = async (data: {
    idFuncionario: number;
    cargo: string;
    setor: string;
    salario: number;
    realizadoPor: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<HistoricoFuncionario>('/historico-funcionario/admissao', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      setHistoricos([response, ...historicos]);
      return response;
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar admissão');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registrarPromocao = async (data: {
    idFuncionario: number;
    cargoAnterior: string;
    cargoNovo: string;
    salarioAnterior: number;
    salarioNovo: number;
    realizadoPor: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<HistoricoFuncionario>('/historico-funcionario/promocao', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      setHistoricos([response, ...historicos]);
      return response;
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar promoção');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteHistorico = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await apiRequest(`/historico-funcionario/${id}`, {
        method: 'DELETE',
      });
      setHistoricos(historicos.filter(h => h.idHistorico !== id));
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar histórico');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoricos();
  }, []);

  return {
    historicos,
    loading,
    error,
    fetchHistoricos,
    fetchByFuncionario,
    fetchByPeriodo,
    createHistorico,
    registrarAdmissao,
    registrarPromocao,
    deleteHistorico,
  };
};
