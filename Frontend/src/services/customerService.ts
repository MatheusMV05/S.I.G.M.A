import { apiRequest } from './api';
import type { 
  Customer, 
  CreateCustomerRequest, 
  PaginatedResponse 
} from './types';

class CustomerService {
  private static instance: CustomerService;
  
  public static getInstance(): CustomerService {
    if (!CustomerService.instance) {
      CustomerService.instance = new CustomerService();
    }
    return CustomerService.instance;
  }

  /**
   * Busca clientes com paginação e filtros
   */
  async getCustomers(params?: {
    page?: number;
    size?: number;
    search?: string;
    customerType?: 'INDIVIDUAL' | 'COMPANY';
    active?: boolean;
  }): Promise<PaginatedResponse<Customer>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page !== undefined) queryParams.set('page', params.page.toString());
    if (params?.size !== undefined) queryParams.set('size', params.size.toString());
    if (params?.search) queryParams.set('search', params.search);
    if (params?.customerType) queryParams.set('customerType', params.customerType);
    if (params?.active !== undefined) queryParams.set('active', params.active.toString());

    const queryString = queryParams.toString();
    const endpoint = `/customers${queryString ? `?${queryString}` : ''}`;

    return await apiRequest<PaginatedResponse<Customer>>(endpoint);
  }

  /**
   * Busca cliente por ID
   */
  async getCustomerById(id: string): Promise<Customer> {
    return await apiRequest<Customer>(`/customers/${id}`);
  }

  /**
   * Busca cliente por documento (CPF ou CNPJ)
   */
  async getCustomerByDocument(document: string): Promise<Customer> {
    return await apiRequest<Customer>(`/customers/document/${document}`);
  }

  /**
   * Cria um novo cliente
   */
  async createCustomer(customerData: CreateCustomerRequest): Promise<Customer> {
    return await apiRequest<Customer>('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  }

  /**
   * Atualiza um cliente existente
   */
  async updateCustomer(id: string, customerData: Partial<CreateCustomerRequest>): Promise<Customer> {
    return await apiRequest<Customer>(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customerData),
    });
  }

  /**
   * Exclui um cliente
   */
  async deleteCustomer(id: string): Promise<void> {
    await apiRequest<void>(`/customers/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Ativa/desativa um cliente
   */
  async toggleCustomerStatus(id: string, active: boolean): Promise<Customer> {
    return await apiRequest<Customer>(`/customers/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ active }),
    });
  }

  /**
   * Busca sugestões de clientes por nome ou documento
   */
  async getCustomerSuggestions(query: string, limit = 5): Promise<Customer[]> {
    return await apiRequest<Customer[]>(`/customers/suggestions?q=${encodeURIComponent(query)}&limit=${limit}`);
  }

  /**
   * Busca histórico de compras do cliente
   */
  async getCustomerPurchaseHistory(id: string, params?: {
    page?: number;
    size?: number;
    startDate?: string;
    endDate?: string;
  }) {
    const queryParams = new URLSearchParams();
    
    if (params?.page !== undefined) queryParams.set('page', params.page.toString());
    if (params?.size !== undefined) queryParams.set('size', params.size.toString());
    if (params?.startDate) queryParams.set('startDate', params.startDate);
    if (params?.endDate) queryParams.set('endDate', params.endDate);

    const queryString = queryParams.toString();
    const endpoint = `/customers/${id}/purchases${queryString ? `?${queryString}` : ''}`;

    return await apiRequest(endpoint);
  }

  /**
   * Busca estatísticas do cliente
   */
  async getCustomerStats(id: string): Promise<{
    totalPurchases: number;
    totalSpent: number;
    averageTicket: number;
    lastPurchaseDate: string;
    favoriteCategories: Array<{ categoryId: string; categoryName: string; count: number }>;
  }> {
    return await apiRequest(`/customers/${id}/stats`);
  }

  /**
   * Valida documento (CPF ou CNPJ)
   */
  async validateDocument(document: string, type: 'CPF' | 'CNPJ'): Promise<{ valid: boolean; message?: string }> {
    return await apiRequest<{ valid: boolean; message?: string }>('/customers/validate-document', {
      method: 'POST',
      body: JSON.stringify({ document, type }),
    });
  }

  /**
   * Busca dados do cliente por CPF/CNPJ em bases externas
   */
  async fetchCustomerData(document: string): Promise<Partial<CreateCustomerRequest>> {
    return await apiRequest<Partial<CreateCustomerRequest>>(`/customers/fetch-data/${document}`);
  }

  /**
   * Exporta clientes para CSV
   */
  async exportCustomers(filters?: {
    customerType?: 'INDIVIDUAL' | 'COMPANY';
    active?: boolean;
  }): Promise<Blob> {
    const queryParams = new URLSearchParams();
    
    if (filters?.customerType) queryParams.set('customerType', filters.customerType);
    if (filters?.active !== undefined) queryParams.set('active', filters.active.toString());

    const queryString = queryParams.toString();
    const endpoint = `/customers/export${queryString ? `?${queryString}` : ''}`;

    return await apiRequest<Blob>(endpoint, {
      headers: {
        ...await this.getHeaders(),
        'Accept': 'text/csv',
      },
    });
  }

  private async getHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }
}

export const customerService = CustomerService.getInstance();