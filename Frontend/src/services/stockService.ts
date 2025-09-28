import { apiRequest } from './api';
import type { 
  StockMovement, 
  CreateStockMovementRequest, 
  PaginatedResponse,
  StockMovementType,
  Product 
} from './types';

class StockService {
  private static instance: StockService;
  
  public static getInstance(): StockService {
    if (!StockService.instance) {
      StockService.instance = new StockService();
    }
    return StockService.instance;
  }

  /**
   * Busca movimentações de estoque com paginação e filtros
   */
  async getStockMovements(params?: {
    page?: number;
    size?: number;
    productId?: string;
    type?: StockMovementType;
    userId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<PaginatedResponse<StockMovement>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page !== undefined) queryParams.set('page', params.page.toString());
    if (params?.size !== undefined) queryParams.set('size', params.size.toString());
    if (params?.productId) queryParams.set('productId', params.productId);
    if (params?.type) queryParams.set('type', params.type);
    if (params?.userId) queryParams.set('userId', params.userId);
    if (params?.startDate) queryParams.set('startDate', params.startDate);
    if (params?.endDate) queryParams.set('endDate', params.endDate);

    const queryString = queryParams.toString();
    const endpoint = `/stock/movements${queryString ? `?${queryString}` : ''}`;

    return await apiRequest<PaginatedResponse<StockMovement>>(endpoint);
  }

  /**
   * Cria uma nova movimentação de estoque
   */
  async createStockMovement(movementData: CreateStockMovementRequest): Promise<StockMovement> {
    return await apiRequest<StockMovement>('/stock/movements', {
      method: 'POST',
      body: JSON.stringify(movementData),
    });
  }

  /**
   * Entrada de estoque
   */
  async stockIn(productId: string, quantity: number, reason: string): Promise<StockMovement> {
    return await this.createStockMovement({
      productId,
      type: 'IN',
      quantity,
      reason,
    });
  }

  /**
   * Saída de estoque
   */
  async stockOut(productId: string, quantity: number, reason: string): Promise<StockMovement> {
    return await this.createStockMovement({
      productId,
      type: 'OUT',
      quantity,
      reason,
    });
  }

  /**
   * Ajuste de estoque
   */
  async stockAdjustment(productId: string, quantity: number, reason: string): Promise<StockMovement> {
    return await this.createStockMovement({
      productId,
      type: 'ADJUSTMENT',
      quantity,
      reason,
    });
  }

  /**
   * Perda de estoque
   */
  async stockLoss(productId: string, quantity: number, reason: string): Promise<StockMovement> {
    return await this.createStockMovement({
      productId,
      type: 'LOSS',
      quantity,
      reason,
    });
  }

  /**
   * Retorno de estoque
   */
  async stockReturn(productId: string, quantity: number, reason: string): Promise<StockMovement> {
    return await this.createStockMovement({
      productId,
      type: 'RETURN',
      quantity,
      reason,
    });
  }

  /**
   * Busca produtos com estoque baixo
   */
  async getLowStockProducts(): Promise<Product[]> {
    return await apiRequest<Product[]>('/stock/low-stock');
  }

  /**
   * Busca produtos sem estoque
   */
  async getOutOfStockProducts(): Promise<Product[]> {
    return await apiRequest<Product[]>('/stock/out-of-stock');
  }

  /**
   * Busca resumo do estoque atual
   */
  async getStockSummary(): Promise<{
    totalProducts: number;
    totalValue: number;
    lowStockCount: number;
    outOfStockCount: number;
    totalMovementsToday: number;
  }> {
    return await apiRequest('/stock/summary');
  }

  /**
   * Busca histórico de estoque de um produto
   */
  async getProductStockHistory(productId: string, params?: {
    page?: number;
    size?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<PaginatedResponse<StockMovement>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page !== undefined) queryParams.set('page', params.page.toString());
    if (params?.size !== undefined) queryParams.set('size', params.size.toString());
    if (params?.startDate) queryParams.set('startDate', params.startDate);
    if (params?.endDate) queryParams.set('endDate', params.endDate);

    const queryString = queryParams.toString();
    const endpoint = `/stock/products/${productId}/history${queryString ? `?${queryString}` : ''}`;

    return await apiRequest<PaginatedResponse<StockMovement>>(endpoint);
  }

  /**
   * Realiza inventário de produtos
   */
  async performInventory(products: Array<{ productId: string; countedQuantity: number }>): Promise<{
    adjustments: StockMovement[];
    summary: {
      totalAdjustments: number;
      totalDiscrepancies: number;
      positiveAdjustments: number;
      negativeAdjustments: number;
    };
  }> {
    return await apiRequest('/stock/inventory', {
      method: 'POST',
      body: JSON.stringify({ products }),
    });
  }

  /**
   * Busca relatório de movimentação por período
   */
  async getMovementReport(startDate: string, endDate: string): Promise<{
    summary: Record<StockMovementType, { count: number; totalQuantity: number }>;
    topProducts: Array<{
      productId: string;
      productName: string;
      totalMovements: number;
      inQuantity: number;
      outQuantity: number;
    }>;
    movementsByDay: Array<{
      date: string;
      movements: number;
      inQuantity: number;
      outQuantity: number;
    }>;
  }> {
    return await apiRequest(`/stock/reports/movements?startDate=${startDate}&endDate=${endDate}`);
  }

  /**
   * Exporta relatório de estoque
   */
  async exportStockReport(filters?: {
    productId?: string;
    type?: StockMovementType;
    startDate?: string;
    endDate?: string;
  }): Promise<Blob> {
    const queryParams = new URLSearchParams();
    
    if (filters?.productId) queryParams.set('productId', filters.productId);
    if (filters?.type) queryParams.set('type', filters.type);
    if (filters?.startDate) queryParams.set('startDate', filters.startDate);
    if (filters?.endDate) queryParams.set('endDate', filters.endDate);

    const queryString = queryParams.toString();
    const endpoint = `/stock/export${queryString ? `?${queryString}` : ''}`;

    return await apiRequest<Blob>(endpoint, {
      headers: {
        ...await this.getHeaders(),
        'Accept': 'text/csv',
      },
    });
  }

  /**
   * Valida se há estoque suficiente para uma operação
   */
  async validateStockAvailability(productId: string, quantity: number): Promise<{
    available: boolean;
    currentStock: number;
    message?: string;
  }> {
    return await apiRequest('/stock/validate', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
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

export const stockService = StockService.getInstance();