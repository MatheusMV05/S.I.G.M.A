import { useState, useEffect } from 'react';
import { apiRequest } from '@/services/api';

export interface DocumentoFuncionario {
  idDocumento?: number;
  idFuncionario: number;
  tipoDocumento: 'RG' | 'CPF' | 'CTPS' | 'CNH' | 'TITULO_ELEITOR' | 'RESERVISTA' | 'PIS_PASEP' | 'CERTIDAO_NASCIMENTO' | 'CERTIDAO_CASAMENTO' | 'COMPROVANTE_RESIDENCIA' | 'OUTRO';
  numeroDocumento: string;
  arquivoUrl?: string;
  dataEmissao?: string;
  dataValidade?: string;
  observacoes?: string;
  dataCadastro?: string;
  nomeFuncionario?: string;
  matriculaFuncionario?: string;
}

export interface StatusDocumentos {
  total: number;
  validos: number;
  vencidos: number;
  aVencer: number;
}

export const useDocumentosFuncionario = () => {
  const [documentos, setDocumentos] = useState<DocumentoFuncionario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocumentos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<DocumentoFuncionario[]>('/documentos-funcionario');
      setDocumentos(response || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar documentos');
      console.error('Erro ao carregar documentos:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchByFuncionario = async (funcionarioId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<DocumentoFuncionario[]>(`/documentos-funcionario/funcionario/${funcionarioId}`);
      setDocumentos(response || []);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar documentos');
      console.error('Erro ao carregar documentos:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchByTipo = async (tipo: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<DocumentoFuncionario[]>(`/documentos-funcionario/tipo/${tipo}`);
      setDocumentos(response || []);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar documentos');
      console.error('Erro ao carregar documentos:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchVencidos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<DocumentoFuncionario[]>('/documentos-funcionario/vencidos');
      return response || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar documentos vencidos');
      console.error('Erro ao carregar documentos vencidos:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchVencendoEm = async (dias: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<DocumentoFuncionario[]>(`/documentos-funcionario/a-vencer?dias=${dias}`);
      return response || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar documentos a vencer');
      console.error('Erro ao carregar documentos a vencer:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchStatusDocumentos = async () => {
    setLoading(true);
    setError(null);
    try {
      // Como não temos endpoint /status, vamos calcular manualmente
      // Buscar todos os documentos diretamente sem usar os outros métodos
      const todos = await apiRequest<DocumentoFuncionario[]>('/documentos-funcionario');
      const vencidos = await apiRequest<DocumentoFuncionario[]>('/documentos-funcionario/vencidos');
      const aVencer = await apiRequest<DocumentoFuncionario[]>('/documentos-funcionario/a-vencer?dias=30');
      
      const status: StatusDocumentos = {
        total: todos?.length || 0,
        vencidos: vencidos?.length || 0,
        aVencer: aVencer?.length || 0,
        validos: (todos?.length || 0) - (vencidos?.length || 0) - (aVencer?.length || 0)
      };
      
      return status;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar status dos documentos');
      console.error('Erro ao carregar status dos documentos:', err);
      // Retorna valores padrão em caso de erro
      return { total: 0, validos: 0, vencidos: 0, aVencer: 0 };
    } finally {
      setLoading(false);
    }
  };

  const createDocumento = async (documento: Omit<DocumentoFuncionario, 'idDocumento'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<DocumentoFuncionario>('/documentos-funcionario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(documento),
      });
      await fetchDocumentos();
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar documento');
      console.error('Erro ao criar documento:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateDocumento = async (id: number, documento: Partial<DocumentoFuncionario>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<DocumentoFuncionario>(`/documentos-funcionario/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(documento),
      });
      await fetchDocumentos();
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar documento');
      console.error('Erro ao atualizar documento:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteDocumento = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await apiRequest(`/documentos-funcionario/${id}`, { method: 'DELETE' });
      await fetchDocumentos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir documento');
      console.error('Erro ao excluir documento:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentos();
  }, []);

  return {
    documentos,
    loading,
    error,
    fetchDocumentos,
    fetchByFuncionario,
    fetchByTipo,
    fetchVencidos,
    fetchVencendoEm,
    fetchStatusDocumentos,
    createDocumento,
    updateDocumento,
    deleteDocumento,
  };
};
