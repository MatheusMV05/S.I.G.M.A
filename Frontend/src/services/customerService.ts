import { apiRequest } from './api';
import type { 
  Customer, 
  CreateCustomerRequest, 
  PaginatedResponse,
  Address // Importa o tipo Address aninhado
} from './types';
import type { 
  BackendClienteDTO, 
  PaginatedClienteResponse 
} from './javaApiTypes'; // Importa os tipos do Backend

/**
 * Converte o DTO "plano" do backend para a interface "aninhada" 
 * que a página Customers.tsx espera.
 * * Usado para LER dados (GET).
 */
const mapBackendToFrontend = (dto: BackendClienteDTO): Customer => {
  
  // 1. Traduz os campos de endereço para um objeto aninhado
  const address: Address = {
    street: dto.rua || '',
    number: dto.numero || '',
    neighborhood: dto.bairro || '',
    city: dto.cidade || '',
    state: '', // 'Estado' não existe no DTO do backend
    zipCode: dto.cep || '',
  };

  // 2. Traduz os tipos e nomes
  const customerType = dto.tipoCliente === 'PF' ? 'individual' : 'business';
  
  // Para PJ, o 'name' do frontend é a 'razaoSocial' do backend.
  // Para PF, o 'name' do frontend é o 'nome' do backend.
  const name = dto.tipoCliente === 'PJ' ? (dto.razaoSocial || dto.nome) : dto.nome;
  
  // O 'document' do frontend é 'cpf' ou 'cnpj' dependendo do tipo
  const document = dto.tipoCliente === 'PF' ? (dto.cpf || '') : (dto.cnpj || '');

  // 3. Monta o objeto final do frontend
  const customer: Customer = {
    id: dto.id.toString(),
    name: name,
    email: dto.email,
    phone: dto.telefone,
    type: customerType,
    document: document,
    address: address,
    status: dto.ativo ? 'active' : 'inactive',
    birthDate: dto.dataNascimento,
    totalSpent: dto.totalGasto || 0,
    classificacao: dto.classificacao, // Classificação VIP do SQL
    totalPurchases: 0, // TODO: O backend não retorna esse campo ainda
    registrationDate: '', // TODO: O backend não retorna esse campo ainda
    lastPurchase: undefined, // TODO: O backend não retorna esse campo ainda
    notes: '', // TODO: O backend não retorna esse campo ainda
    
    companyInfo: dto.tipoCliente === 'PJ' ? {
      tradeName: dto.nome, // 'nome' do backend é o Nome Fantasia para PJ
      stateRegistration: dto.inscricaoEstadual,
    } : undefined,
    
    createdAt: '', // O DTO não fornece isso
    updatedAt: '', // O DTO não fornece isso
  };

  return customer;
};

/**
 * Converte o objeto "aninhado" do formulário do frontend para o DTO "plano" do backend.
 * * Usado para ENVIAR dados (POST, PUT).
 * @param customer Pode ser o 'Customer' da UI ou 'CreateCustomerRequest' de types.ts
 */
const mapFrontendToBackend = (customer: Partial<CreateCustomerRequest> | Partial<Customer>): Partial<BackendClienteDTO> => {
  
  const customerData = customer as any; 
  const tipoCliente = (customerData.type === 'individual') ? 'PF' : 'PJ';

  const dto: Partial<BackendClienteDTO> = {
    id: customerData.id ? Number(customerData.id) : undefined,
    
    nome: tipoCliente === 'PJ' ? customerData.companyInfo?.tradeName : customer.name,
    razaoSocial: tipoCliente === 'PJ' ? customer.name : undefined,

    email: customer.email,
    telefone: customer.phone,
    tipoCliente: tipoCliente,
    
    rua: customer.address?.street,
    numero: customer.address?.number,
    bairro: (customer.address as any)?.neighborhood,
    cidade: customer.address?.city,
    cep: customer.address?.zipCode,
    
    ativo: customerData.status === 'inactive' ? false : true,
    
    cpf: tipoCliente === 'PF' ? customer.document : undefined,
    dataNascimento: tipoCliente === 'PF' ? customer.birthDate : undefined,
    
    cnpj: tipoCliente === 'PJ' ? customer.document : undefined,
    inscricaoEstadual: tipoCliente === 'PJ' ? customerData.companyInfo?.stateRegistration : undefined,
  };

  return dto;
};

class CustomerService {
  private static instance: CustomerService;
  
  public static getInstance(): CustomerService {
    if (!CustomerService.instance) {
      CustomerService.instance = new CustomerService();
    }
    return CustomerService.instance;
  }

  /**
   * Busca clientes com paginação e filtros (CORRIGIDO)
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

    const response = await apiRequest<PaginatedClienteResponse>(endpoint);
    const mappedContent = response.content.map(mapBackendToFrontend);

    return {
      ...response,
      content: mappedContent,
    };
  }

  /**
   * Busca cliente por ID (CORRIGIDO)
   */
  async getCustomerById(id: string): Promise<Customer> {
    const dto = await apiRequest<BackendClienteDTO>(`/customers/${id}`);
    return mapBackendToFrontend(dto);
  }

  /**
   * Busca cliente por documento (CPF ou CNPJ) (CORRIGIDO)
   */
  async getCustomerByDocument(document: string): Promise<Customer> {
    const dto = await apiRequest<BackendClienteDTO>(`/customers/document/${document}`);
    return mapBackendToFrontend(dto);
  }

  /**
   * Cria um novo cliente (CORRIGIDO)
   */
  async createCustomer(customerData: CreateCustomerRequest): Promise<Customer> {
    const dto = mapFrontendToBackend(customerData);
    
    const responseDto = await apiRequest<BackendClienteDTO>('/customers', {
      method: 'POST',
      body: JSON.stringify(dto),
    });

    return mapBackendToFrontend(responseDto);
  }

  /**
   * Atualiza um cliente existente (CORRIGIDO)
   */
  async updateCustomer(id: string, customerData: Partial<CreateCustomerRequest | Customer>): Promise<Customer> {
    const dto = mapFrontendToBackend(customerData);
    
    const responseDto = await apiRequest<BackendClienteDTO>(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dto),
    });

    return mapBackendToFrontend(responseDto);
  }

  /**
   * Exclui um cliente (Não precisa de mapeamento)
   */
  async deleteCustomer(id: string): Promise<void> {
    await apiRequest<void>(`/customers/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Ativa/desativa um cliente (CORRIGIDO)
   */
  async toggleCustomerStatus(id: string, active: boolean): Promise<Customer> {
    const responseDto = await apiRequest<BackendClienteDTO>(`/customers/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ active }),
    });
    return mapBackendToFrontend(responseDto);
  }

  /**
   * Busca sugestões de clientes (CORRIGIDO)
   */
  async getCustomerSuggestions(query: string, limit = 5): Promise<Customer[]> {
    const responseDtos = await apiRequest<BackendClienteDTO[]>(`/customers/suggestions?q=${encodeURIComponent(query)}&limit=${limit}`);
    return responseDtos.map(mapBackendToFrontend);
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
   * Busca estatísticas gerais de todos os clientes
   */
  async getStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    individuals: number;
    businesses: number;
    totalRevenue: number;
    averageTicket: number;
  }> {
    return await apiRequest('/customers/stats');
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