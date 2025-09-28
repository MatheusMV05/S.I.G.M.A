import { apiRequest } from './api';
import type { 
  Sale, 
  CreateSaleRequest, 
  PaginatedResponse,
  PaymentMethod,
  SaleStatus 
} from './types';

class SalesService {
  private static instance: SalesService;
  
  public static getInstance(): SalesService {
    if (!SalesService.instance) {
      SalesService.instance = new SalesService();
    }
    return SalesService.instance;
  }

  /**
   * Busca vendas com paginação e filtros
   */
  async getSales(params?: {
    page?: number;
    size?: number;
    search?: string;
    customerId?: string;
    cashierId?: string;
    paymentMethod?: PaymentMethod;
    status?: SaleStatus;
    startDate?: string;
    endDate?: string;
  }): Promise<PaginatedResponse<Sale>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page !== undefined) queryParams.set('page', params.page.toString());
    if (params?.size !== undefined) queryParams.set('size', params.size.toString());
    if (params?.search) queryParams.set('search', params.search);
    if (params?.customerId) queryParams.set('customerId', params.customerId);
    if (params?.cashierId) queryParams.set('cashierId', params.cashierId);
    if (params?.paymentMethod) queryParams.set('paymentMethod', params.paymentMethod);
    if (params?.status) queryParams.set('status', params.status);
    if (params?.startDate) queryParams.set('startDate', params.startDate);
    if (params?.endDate) queryParams.set('endDate', params.endDate);

    const queryString = queryParams.toString();
    const endpoint = `/sales${queryString ? `?${queryString}` : ''}`;

    return await apiRequest<PaginatedResponse<Sale>>(endpoint);
  }

  /**
   * Busca venda por ID
   */
  async getSaleById(id: string): Promise<Sale> {
    return await apiRequest<Sale>(`/sales/${id}`);
  }

  /**
   * Cria uma nova venda
   */
  async createSale(saleData: CreateSaleRequest): Promise<Sale> {
    return await apiRequest<Sale>('/sales', {
      method: 'POST',
      body: JSON.stringify(saleData),
    });
  }

  /**
   * Cancela uma venda
   */
  async cancelSale(id: string, reason: string): Promise<Sale> {
    return await apiRequest<Sale>(`/sales/${id}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
  }

  /**
   * Aplica desconto em uma venda
   */
  async applySaleDiscount(id: string, discount: number, reason?: string): Promise<Sale> {
    return await apiRequest<Sale>(`/sales/${id}/discount`, {
      method: 'PATCH',
      body: JSON.stringify({ discount, reason }),
    });
  }

  /**
   * Busca vendas do dia atual
   */
  async getTodaySales(): Promise<Sale[]> {
    return await apiRequest<Sale[]>('/sales/today');
  }

  /**
   * Busca vendas por período
   */
  async getSalesByPeriod(startDate: string, endDate: string): Promise<Sale[]> {
    return await apiRequest<Sale[]>(`/sales/period?startDate=${startDate}&endDate=${endDate}`);
  }

  /**
   * Busca resumo de vendas por período
   */
  async getSalesSummary(startDate: string, endDate: string): Promise<{
    totalSales: number;
    totalRevenue: number;
    averageTicket: number;
    salesByPaymentMethod: Record<PaymentMethod, number>;
    salesByHour: Array<{ hour: number; count: number; total: number }>;
  }> {
    return await apiRequest(`/sales/summary?startDate=${startDate}&endDate=${endDate}`);
  }

  /**
   * Gera recibo/cupom da venda
   */
  async generateReceipt(id: string, format: 'PDF' | 'HTML' = 'PDF'): Promise<Blob> {
    return await apiRequest<Blob>(`/sales/${id}/receipt?format=${format}`, {
      headers: {
        ...await this.getHeaders(),
        'Accept': format === 'PDF' ? 'application/pdf' : 'text/html',
      },
    });
  }

  /**
   * Reabre uma venda cancelada (se permitido)
   */
  async reopenSale(id: string): Promise<Sale> {
    return await apiRequest<Sale>(`/sales/${id}/reopen`, {
      method: 'PATCH',
    });
  }

  /**
   * Busca vendas em aberto (não finalizadas)
   */
  async getOpenSales(): Promise<Sale[]> {
    return await apiRequest<Sale[]>('/sales/open');
  }

  /**
   * Finaliza venda em aberto
   */
  async finalizeSale(id: string, paymentMethod: PaymentMethod): Promise<Sale> {
    return await apiRequest<Sale>(`/sales/${id}/finalize`, {
      method: 'PATCH',
      body: JSON.stringify({ paymentMethod }),
    });
  }

  /**
   * Adiciona produto a uma venda em aberto
   */
  async addProductToSale(saleId: string, productId: string, quantity: number, unitPrice?: number): Promise<Sale> {
    return await apiRequest<Sale>(`/sales/${saleId}/items`, {
      method: 'POST',
      body: JSON.stringify({ productId, quantity, unitPrice }),
    });
  }

  /**
   * Remove produto de uma venda em aberto
   */
  async removeProductFromSale(saleId: string, itemId: string): Promise<Sale> {
    return await apiRequest<Sale>(`/sales/${saleId}/items/${itemId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Atualiza quantidade de um item na venda
   */
  async updateSaleItemQuantity(saleId: string, itemId: string, quantity: number): Promise<Sale> {
    return await apiRequest<Sale>(`/sales/${saleId}/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    });
  }

  /**
   * Busca métodos de pagamento disponíveis
   */
  async getPaymentMethods(): Promise<Array<{ method: PaymentMethod; name: string; active: boolean }>> {
    return await apiRequest('/sales/payment-methods');
  }

  /**
   * Valida se é possível cancelar uma venda
   */
  async canCancelSale(id: string): Promise<{ canCancel: boolean; reason?: string }> {
    return await apiRequest(`/sales/${id}/can-cancel`);
  }

  private async getHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }
}

export const salesService = SalesService.getInstance();