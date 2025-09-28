import { apiRequest } from './api';
import type { 
  Promotion, 
  CreatePromotionRequest, 
  PaginatedResponse,
  PromotionType 
} from './types';

class PromotionService {
  private static instance: PromotionService;
  
  public static getInstance(): PromotionService {
    if (!PromotionService.instance) {
      PromotionService.instance = new PromotionService();
    }
    return PromotionService.instance;
  }

  /**
   * Busca promoções com paginação e filtros
   */
  async getPromotions(params?: {
    page?: number;
    size?: number;
    search?: string;
    type?: PromotionType;
    active?: boolean;
    current?: boolean; // apenas promoções vigentes
  }): Promise<PaginatedResponse<Promotion>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page !== undefined) queryParams.set('page', params.page.toString());
    if (params?.size !== undefined) queryParams.set('size', params.size.toString());
    if (params?.search) queryParams.set('search', params.search);
    if (params?.type) queryParams.set('type', params.type);
    if (params?.active !== undefined) queryParams.set('active', params.active.toString());
    if (params?.current !== undefined) queryParams.set('current', params.current.toString());

    const queryString = queryParams.toString();
    const endpoint = `/promotions${queryString ? `?${queryString}` : ''}`;

    return await apiRequest<PaginatedResponse<Promotion>>(endpoint);
  }

  /**
   * Busca promoção por ID
   */
  async getPromotionById(id: string): Promise<Promotion> {
    return await apiRequest<Promotion>(`/promotions/${id}`);
  }

  /**
   * Cria uma nova promoção
   */
  async createPromotion(promotionData: CreatePromotionRequest): Promise<Promotion> {
    return await apiRequest<Promotion>('/promotions', {
      method: 'POST',
      body: JSON.stringify(promotionData),
    });
  }

  /**
   * Atualiza uma promoção existente
   */
  async updatePromotion(id: string, promotionData: Partial<CreatePromotionRequest>): Promise<Promotion> {
    return await apiRequest<Promotion>(`/promotions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(promotionData),
    });
  }

  /**
   * Exclui uma promoção
   */
  async deletePromotion(id: string): Promise<void> {
    await apiRequest<void>(`/promotions/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Ativa/desativa uma promoção
   */
  async togglePromotionStatus(id: string, active: boolean): Promise<Promotion> {
    return await apiRequest<Promotion>(`/promotions/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ active }),
    });
  }

  /**
   * Busca promoções vigentes (ativas e dentro do período)
   */
  async getCurrentPromotions(): Promise<Promotion[]> {
    return await apiRequest<Promotion[]>('/promotions/current');
  }

  /**
   * Busca promoções aplicáveis a um produto
   */
  async getPromotionsForProduct(productId: string): Promise<Promotion[]> {
    return await apiRequest<Promotion[]>(`/promotions/product/${productId}`);
  }

  /**
   * Busca promoções aplicáveis a uma categoria
   */
  async getPromotionsForCategory(categoryId: string): Promise<Promotion[]> {
    return await apiRequest<Promotion[]>(`/promotions/category/${categoryId}`);
  }

  /**
   * Calcula desconto de uma promoção para determinado produto/quantidade
   */
  async calculatePromotionDiscount(promotionId: string, productId: string, quantity: number, unitPrice: number): Promise<{
    discount: number;
    finalPrice: number;
    applicable: boolean;
    reason?: string;
  }> {
    return await apiRequest('/promotions/calculate-discount', {
      method: 'POST',
      body: JSON.stringify({
        promotionId,
        productId,
        quantity,
        unitPrice,
      }),
    });
  }

  /**
   * Aplica melhor promoção disponível para um conjunto de itens
   */
  async applyBestPromotion(items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
  }>): Promise<{
    promotionApplied?: Promotion;
    originalTotal: number;
    discountedTotal: number;
    totalDiscount: number;
    itemsWithDiscount: Array<{
      productId: string;
      quantity: number;
      unitPrice: number;
      discount: number;
      finalPrice: number;
    }>;
  }> {
    return await apiRequest('/promotions/apply-best', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
  }

  /**
   * Busca estatísticas de uso das promoções
   */
  async getPromotionStats(id: string, startDate?: string, endDate?: string): Promise<{
    totalUses: number;
    totalDiscount: number;
    totalRevenue: number;
    averageDiscount: number;
    topProducts: Array<{
      productId: string;
      productName: string;
      uses: number;
      totalDiscount: number;
    }>;
    usageByDay: Array<{
      date: string;
      uses: number;
      discount: number;
    }>;
  }> {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.set('startDate', startDate);
    if (endDate) queryParams.set('endDate', endDate);

    const queryString = queryParams.toString();
    const endpoint = `/promotions/${id}/stats${queryString ? `?${queryString}` : ''}`;

    return await apiRequest(endpoint);
  }

  /**
   * Duplica uma promoção existente
   */
  async duplicatePromotion(id: string): Promise<Promotion> {
    return await apiRequest<Promotion>(`/promotions/${id}/duplicate`, {
      method: 'POST',
    });
  }

  /**
   * Busca promoções que expiram em breve
   */
  async getExpiringPromotions(days = 7): Promise<Promotion[]> {
    return await apiRequest<Promotion[]>(`/promotions/expiring?days=${days}`);
  }

  /**
   * Valida conflitos de promoções
   */
  async validatePromotionConflicts(promotionData: CreatePromotionRequest): Promise<{
    hasConflicts: boolean;
    conflicts: Array<{
      promotionId: string;
      promotionName: string;
      conflictType: 'product' | 'category' | 'period';
    }>;
  }> {
    return await apiRequest('/promotions/validate-conflicts', {
      method: 'POST',
      body: JSON.stringify(promotionData),
    });
  }

  /**
   * Gera relatório de performance das promoções
   */
  async getPromotionsReport(startDate: string, endDate: string): Promise<{
    totalPromotions: number;
    activePromotions: number;
    totalDiscount: number;
    totalRevenue: number;
    topPromotions: Array<{
      promotionId: string;
      promotionName: string;
      uses: number;
      totalDiscount: number;
      roi: number;
    }>;
  }> {
    return await apiRequest(`/promotions/report?startDate=${startDate}&endDate=${endDate}`);
  }
}

export const promotionService = PromotionService.getInstance();