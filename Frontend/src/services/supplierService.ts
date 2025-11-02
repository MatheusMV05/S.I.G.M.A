import { apiRequest } from './api';

export interface Fornecedor {
  id_fornecedor: number;
  id_pessoa?: number;
  nome_fantasia: string;
  razao_social?: string;
  cnpj: string;
  email?: string;
  telefone?: string;
  rua?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  contato_principal?: string;
  condicoes_pagamento?: string;
  prazo_entrega_dias?: number;
  avaliacao?: number;
  status: 'ATIVO' | 'INATIVO';
  data_cadastro?: string;
  total_produtos?: number;
  valor_total_compras?: number;
}

export interface CreateFornecedorRequest {
  nome_fantasia: string;
  razao_social?: string;
  cnpj: string;
  email?: string;
  telefone?: string;
  rua?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  contato_principal?: string;
  condicoes_pagamento?: string;
  prazo_entrega_dias?: number;
  avaliacao?: number;
}

class SupplierService {
  private static instance: SupplierService;
  
  public static getInstance(): SupplierService {
    if (!SupplierService.instance) {
      SupplierService.instance = new SupplierService();
    }
    return SupplierService.instance;
  }

  /**
   * Busca todos os fornecedores com filtros opcionais
   */
  async getSuppliers(params?: {
    search?: string;
    status?: string;
  }): Promise<Fornecedor[]> {
    const queryParams = new URLSearchParams();
    
    if (params?.search) queryParams.set('search', params.search);
    if (params?.status) queryParams.set('status', params.status);

    const queryString = queryParams.toString();
    const endpoint = `/fornecedores${queryString ? `?${queryString}` : ''}`;

    return await apiRequest<Fornecedor[]>(endpoint);
  }

  /**
   * Busca todos os fornecedores ativos (para dropdowns)
   */
  async getActiveSuppliers(): Promise<Fornecedor[]> {
    return await apiRequest<Fornecedor[]>('/fornecedores/ativos');
  }

  /**
   * Busca fornecedor por ID
   */
  async getSupplierById(id: number): Promise<Fornecedor> {
    return await apiRequest<Fornecedor>(`/fornecedores/${id}`);
  }

  /**
   * Busca fornecedor por CNPJ
   */
  async getSupplierByCnpj(cnpj: string): Promise<Fornecedor> {
    return await apiRequest<Fornecedor>(`/fornecedores/cnpj/${cnpj}`);
  }

  /**
   * Cria um novo fornecedor
   */
  async createSupplier(supplierData: CreateFornecedorRequest): Promise<Fornecedor> {
    return await apiRequest<Fornecedor>('/fornecedores', {
      method: 'POST',
      body: JSON.stringify(supplierData),
    });
  }

  /**
   * Atualiza um fornecedor existente
   */
  async updateSupplier(id: number, supplierData: Partial<CreateFornecedorRequest>): Promise<Fornecedor> {
    return await apiRequest<Fornecedor>(`/fornecedores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(supplierData),
    });
  }

  /**
   * Exclui um fornecedor
   */
  async deleteSupplier(id: number): Promise<void> {
    await apiRequest<void>(`/fornecedores/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Ativa/desativa um fornecedor
   */
  async toggleSupplierStatus(id: number, ativo: boolean): Promise<Fornecedor> {
    return await apiRequest<Fornecedor>(`/fornecedores/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ ativo }),
    });
  }
}

export const supplierService = SupplierService.getInstance();