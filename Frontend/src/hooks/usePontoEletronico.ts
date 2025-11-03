import { useState, useEffect } from 'react';
import { apiRequest } from '@/services/api';

export interface PontoEletronico {
  idPonto?: number;
  idFuncionario: number;
  dataPonto: string;
  horaEntrada?: string;
  horaSaidaAlmoco?: string;
  horaRetornoAlmoco?: string;
  horaSaida?: string;
  horasTrabalhadas?: number;
  horasExtras?: number;
  observacoes?: string;
  statusPonto?: 'NORMAL' | 'FALTA' | 'ATESTADO' | 'FERIAS' | 'FOLGA';
  dataRegistro?: string;
  nomeFuncionario?: string;
  matriculaFuncionario?: string;
  cargoFuncionario?: string;
  setorFuncionario?: string;
}

export interface EstatisticasPonto {
  totalHorasTrabalhadas: number;
  totalHorasExtras: number;
  totalFaltas: number;
  mediaDiaria: number;
}

export const usePontoEletronico = () => {
  const [pontos, setPontos] = useState<PontoEletronico[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPontos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<PontoEletronico[]>('/ponto-eletronico');
      setPontos(response || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar registros de ponto');
      console.error('Erro ao carregar registros de ponto:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchByFuncionario = async (funcionarioId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<PontoEletronico[]>(`/ponto-eletronico/funcionario/${funcionarioId}`);
      setPontos(response || []);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pontos');
      console.error('Erro ao carregar pontos:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchByData = async (data: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<PontoEletronico[]>(`/ponto-eletronico/data/${data}`);
      setPontos(response || []);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pontos');
      console.error('Erro ao carregar pontos:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchByPeriodo = async (dataInicio: string, dataFim: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<PontoEletronico[]>(`/ponto-eletronico/periodo?dataInicio=${dataInicio}&dataFim=${dataFim}`);
      setPontos(response || []);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pontos');
      console.error('Erro ao carregar pontos:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchByFuncionarioPeriodo = async (funcionarioId: number, dataInicio: string, dataFim: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<PontoEletronico[]>(`/ponto-eletronico/funcionario/${funcionarioId}/periodo?dataInicio=${dataInicio}&dataFim=${dataFim}`);
      return response || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pontos');
      console.error('Erro ao carregar pontos:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchComHorasExtras = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<PontoEletronico[]>('/ponto-eletronico/horas-extras');
      return response || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pontos com horas extras');
      console.error('Erro ao carregar pontos com horas extras:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchEstatisticasMes = async (funcionarioId: number, ano: number, mes: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<EstatisticasPonto>(`/ponto-eletronico/funcionario/${funcionarioId}/estatisticas?ano=${ano}&mes=${mes}`);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas');
      console.error('Erro ao carregar estatísticas:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registrarEntrada = async (funcionarioId: number, data: string, hora: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<PontoEletronico>('/ponto-eletronico/registrar-entrada', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idFuncionario: funcionarioId, dataPonto: data, horaEntrada: hora }),
      });
      await fetchPontos();
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar entrada');
      console.error('Erro ao registrar entrada:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registrarSaidaAlmoco = async (id: number, hora: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<PontoEletronico>(`/ponto-eletronico/${id}/saida-almoco`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ horaSaidaAlmoco: hora }),
      });
      await fetchPontos();
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar saída para almoço');
      console.error('Erro ao registrar saída para almoço:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registrarRetornoAlmoco = async (id: number, hora: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<PontoEletronico>(`/ponto-eletronico/${id}/retorno-almoco`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ horaRetornoAlmoco: hora }),
      });
      await fetchPontos();
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar retorno do almoço');
      console.error('Erro ao registrar retorno do almoço:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registrarSaida = async (id: number, hora: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<PontoEletronico>(`/ponto-eletronico/${id}/saida`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ horaSaida: hora }),
      });
      await fetchPontos();
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar saída');
      console.error('Erro ao registrar saída:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createPonto = async (ponto: Omit<PontoEletronico, 'idPonto'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<PontoEletronico>('/ponto-eletronico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ponto),
      });
      await fetchPontos();
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar registro de ponto');
      console.error('Erro ao criar registro de ponto:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePonto = async (id: number, ponto: Partial<PontoEletronico>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<PontoEletronico>(`/ponto-eletronico/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ponto),
      });
      await fetchPontos();
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar registro de ponto');
      console.error('Erro ao atualizar registro de ponto:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePonto = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await apiRequest(`/ponto-eletronico/${id}`, { method: 'DELETE' });
      await fetchPontos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir registro de ponto');
      console.error('Erro ao excluir registro de ponto:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPontos();
  }, []);

  return {
    pontos,
    loading,
    error,
    fetchPontos,
    fetchByFuncionario,
    fetchByData,
    fetchByPeriodo,
    fetchByFuncionarioPeriodo,
    fetchComHorasExtras,
    fetchEstatisticasMes,
    registrarEntrada,
    registrarSaidaAlmoco,
    registrarRetornoAlmoco,
    registrarSaida,
    createPonto,
    updatePonto,
    deletePonto,
  };
};
