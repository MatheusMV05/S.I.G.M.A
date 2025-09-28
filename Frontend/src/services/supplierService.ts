import { apiRequest } from './api';
import type { 
  Supplier, 
  CreateSupplierRequest, 
  PaginatedResponse 
} from './types';

class SupplierService {
  private static instance: SupplierService;
  
  public static getInstance(): SupplierService {
    if (!SupplierService.instance) {
      SupplierService.instance = new SupplierService();
    }
    return SupplierService.instance;
  }

  /**
   * Busca fornecedores com paginação e filtros
   */
  async getSuppliers(params?: {
    page?: number;
    size?: number;
    search?: string;
    active?: boolean;
  }): Promise<PaginatedResponse<Supplier>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page !== undefined) queryParams.set('page', params.page.toString());
    if (params?.size !== undefined) queryParams.set('size', params.size.toString());
    if (params?.search) queryParams.set('search', params.search);
    if (params?.active !== undefined) queryParams.set('active', params.active.toString());

    const queryString = queryParams.toString();
    const endpoint = `/suppliers${queryString ? `?${queryString}` : ''}`;

    return await apiRequest<PaginatedResponse<Supplier>>(endpoint);
  }

  /**
   * Busca todos os fornecedores ativos (para dropdowns)
   */
  async getActiveSuppliers(): Promise<Supplier[]> {
    return await apiRequest<Supplier[]>('/suppliers/active');
  }

  /**
   * Busca fornecedor por ID
   */
  async getSupplierById(id: string): Promise<Supplier> {
    return await apiRequest<Supplier>(`/suppliers/${id}`);
  }

  /**
   * Busca fornecedor por CNPJ
   */
  async getSupplierByDocument(document: string): Promise<Supplier> {
    return await apiRequest<Supplier>(`/suppliers/document/${document}`);
  }

  /**
   * Cria um novo fornecedor
   */
  async createSupplier(supplierData: CreateSupplierRequest): Promise<Supplier> {
    return await apiRequest<Supplier>('/suppliers', {
      method: 'POST',
      body: JSON.stringify(supplierData),
    });
  }

  /**
   * Atualiza um fornecedor existente
   */
  async updateSupplier(id: string, supplierData: Partial<CreateSupplierRequest>): Promise<Supplier> {
    return await apiRequest<Supplier>(`/suppliers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(supplierData),
    });
  }

  /**
   * Exclui um fornecedor
   */
  async deleteSupplier(id: string): Promise<void> {
    await apiRequest<void>(`/suppliers/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Ativa/desativa um fornecedor
   */
  async toggleSupplierStatus(id: string, active: boolean): Promise<Supplier> {
    return await apiRequest<Supplier>(`/suppliers/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ active }),
    });
  }

  /**
   * Busca produtos de um fornecedor
   */
  async getSupplierProducts(id: string, params?: {
    page?: number;
    size?: number;
    search?: string;
  }) {
    const queryParams = new URLSearchParams();
    
    if (params?.page !== undefined) queryParams.set('page', params.page.toString());
    if (params?.size !== undefined) queryParams.set('size', params.size.toString());
    if (params?.search) queryParams.set('search', params.search);

    const queryString = queryParams.toString();
    const endpoint = `/suppliers/${id}/products${queryString ? `?${queryString}` : ''}`;

    return await apiRequest(endpoint);
  }

  /**
   * Valida CNPJ
   */
  async validateDocument(document: string): Promise<{ valid: boolean; message?: string }> {
    return await apiRequest<{ valid: boolean; message?: string }>('/suppliers/validate-document', {
      method: 'POST',
      body: JSON.stringify({ document }),
    });
  }

  /**
   * Busca dados do fornecedor por CNPJ na Receita Federal
   */
  async fetchSupplierDataByCnpj(cnpj: string): Promise<Partial<CreateSupplierRequest>> {
    return await apiRequest<Partial<CreateSupplierRequest>>(`/suppliers/fetch-data/${cnpj}`);
  }
}

export const supplierService = SupplierService.getInstance();