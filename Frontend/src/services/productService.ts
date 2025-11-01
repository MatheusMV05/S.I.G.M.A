import { apiRequest } from './api';
import type { 
  Product, 
  CreateProductRequest, 
  PaginatedResponse,
  ApiResponse 
} from './types';

class ProductService {
  private static instance: ProductService;
  
  public static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  /**
   * Transforma dados do formulário frontend para o formato esperado pelo backend
   */
  private transformToBackendFormat(data: any): any {
    const transformed: any = { ...data };
    
    // Mapeia os campos do frontend para o backend
    if ('preco_venda' in data) {
      transformed.valor_unitario = data.preco_venda;
      delete transformed.preco_venda;
    }
    
    if ('estoque' in data) {
      transformed.quant_em_estoque = data.estoque;
      delete transformed.estoque;
    }
    
    if ('categoria_id' in data) {
      transformed.id_categoria = parseInt(data.categoria_id);
      delete transformed.categoria_id;
    }
    
    return transformed;
  }

  /**
   * Busca produtos com paginação e filtros
   */
  async getProducts(params?: {
    page?: number;
    size?: number;
    search?: string;
    categoryId?: string;
    supplierId?: string;
    lowStock?: boolean;
    active?: boolean;
  }): Promise<PaginatedResponse<Product>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page !== undefined) queryParams.set('page', params.page.toString());
    if (params?.size !== undefined) queryParams.set('size', params.size.toString());
    if (params?.search) queryParams.set('search', params.search);
    if (params?.categoryId) queryParams.set('categoryId', params.categoryId);
    if (params?.supplierId) queryParams.set('supplierId', params.supplierId);
    if (params?.lowStock !== undefined) queryParams.set('lowStock', params.lowStock.toString());
    if (params?.active !== undefined) queryParams.set('active', params.active.toString());

    const queryString = queryParams.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;

    return await apiRequest<PaginatedResponse<Product>>(endpoint);
  }

  /**
   * Busca produto por ID
   */
  async getProductById(id: string): Promise<Product> {
    return await apiRequest<Product>(`/products/${id}`);
  }

  /**
   * Busca produto por código de barras
   */
  async getProductByBarcode(barcode: string): Promise<Product> {
    return await apiRequest<Product>(`/products/barcode/${barcode}`);
  }

  /**
   * Cria um novo produto
   */
  async createProduct(productData: any): Promise<Product> {
    const transformedData = this.transformToBackendFormat(productData);
    return await apiRequest<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(transformedData),
    });
  }

  /**
   * Atualiza um produto existente
   */
  async updateProduct(id: string, productData: any): Promise<Product> {
    const transformedData = this.transformToBackendFormat(productData);
    return await apiRequest<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transformedData),
    });
  }

  /**
   * Exclui um produto
   */
  async deleteProduct(id: string): Promise<void> {
    await apiRequest<void>(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Ativa/desativa um produto
   */
  async toggleProductStatus(id: string, active: boolean): Promise<Product> {
    return await apiRequest<Product>(`/products/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ active }),
    });
  }

  /**
   * Atualiza preço de um produto
   */
  async updateProductPrice(id: string, price: number, costPrice?: number): Promise<Product> {
    return await apiRequest<Product>(`/products/${id}/price`, {
      method: 'PATCH',
      body: JSON.stringify({ price, costPrice }),
    });
  }

  /**
   * Atualiza estoque de um produto
   */
  async updateProductStock(id: string, stock: number): Promise<Product> {
    return await apiRequest<Product>(`/products/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ stock }),
    });
  }

  /**
   * Busca produtos com estoque baixo
   */
  async getLowStockProducts(): Promise<Product[]> {
    return await apiRequest<Product[]>('/products/low-stock');
  }

  /**
   * Busca produtos mais vendidos
   */
  async getTopSellingProducts(limit = 10): Promise<Product[]> {
    return await apiRequest<Product[]>(`/products/top-selling?limit=${limit}`);
  }

  /**
   * Busca sugestões de produtos por nome
   */
  async getProductSuggestions(query: string, limit = 5): Promise<Product[]> {
    return await apiRequest<Product[]>(`/products/suggestions?q=${encodeURIComponent(query)}&limit=${limit}`);
  }

  /**
   * Exporta produtos para CSV
   */
  async exportProducts(filters?: {
    categoryId?: string;
    supplierId?: string;
    active?: boolean;
  }): Promise<Blob> {
    const queryParams = new URLSearchParams();
    
    if (filters?.categoryId) queryParams.set('categoryId', filters.categoryId);
    if (filters?.supplierId) queryParams.set('supplierId', filters.supplierId);
    if (filters?.active !== undefined) queryParams.set('active', filters.active.toString());

    const queryString = queryParams.toString();
    const endpoint = `/products/export${queryString ? `?${queryString}` : ''}`;

    return await apiRequest<Blob>(endpoint, {
      headers: {
        ...await this.getHeaders(),
        'Accept': 'text/csv',
      },
    });
  }

  /**
   * Importa produtos de arquivo CSV
   */
  async importProducts(file: File): Promise<ApiResponse<{ imported: number; errors: string[] }>> {
    const formData = new FormData();
    formData.append('file', file);

    return await apiRequest<ApiResponse<{ imported: number; errors: string[] }>>('/products/import', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        // Não definir Content-Type para deixar o browser definir o boundary do multipart
      },
    });
  }

  /**
   * Duplica um produto existente
   */
  async duplicateProduct(id: string): Promise<Product> {
    return await apiRequest<Product>(`/products/${id}/duplicate`, {
      method: 'POST',
    });
  }

  /**
   * Calcula desconto progressivo baseado no valor total da compra
   * Utiliza a função SQL fn_calcular_desconto_progressivo
   */
  async calcularDescontoProgressivo(valorTotal: number): Promise<{
    valorOriginal: number;
    descontoAplicado: number;
    percentualDesconto: number;
    valorFinal: number;
    economizado: number;
  }> {
    return await apiRequest<{
      valorOriginal: number;
      descontoAplicado: number;
      percentualDesconto: number;
      valorFinal: number;
      economizado: number;
    }>(`/products/calcular-desconto-progressivo?valorTotal=${valorTotal}`);
  }

  /**
   * Reajusta preços em massa de todos os produtos de uma categoria
   * Utiliza o procedimento sp_reajustar_precos_categoria
   * 
   * @param categoriaId ID da categoria
   * @param percentual Percentual de reajuste (10 = +10%, -5 = -5%)
   * @param aplicarCusto Se true, também reajusta o preço de custo
   */
  async reajustarPrecosCategoria(
    categoriaId: number,
    percentual: number,
    aplicarCusto: boolean
  ): Promise<{
    idCategoria: number;
    percentualAplicado: number;
    reajustouCusto: boolean;
    dataHora: string;
    mensagem: string;
  }> {
    return await apiRequest<{
      idCategoria: number;
      percentualAplicado: number;
      reajustouCusto: boolean;
      dataHora: string;
      mensagem: string;
    }>('/products/reajustar-precos', {
      method: 'POST',
      body: JSON.stringify({
        categoriaId,
        percentual,
        aplicarCusto,
      }),
    });
  }

  /**
   * Busca histórico de auditoria de um produto
   * Utiliza a tabela AuditoriaLog populada pelo trigger trg_auditoria_produto_update
   * 
   * @param productId ID do produto
   * @returns Lista de alterações feitas no produto
   */
  async getHistoricoProduto(productId: number): Promise<LogAuditoriaDTO[]> {
    return await apiRequest<LogAuditoriaDTO[]>(`/products/${productId}/historico`);
  }

  private async getHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }
}

// Interface para o DTO de Log de Auditoria
export interface LogAuditoriaDTO {
  idLog: number;
  tabela: string;
  operacao: 'INSERT' | 'UPDATE' | 'DELETE';
  idUsuario?: number;
  registroId: number;
  dadosAntigos?: string;
  dadosNovos?: string;
  ipOrigem?: string;
  dataHora: string;
  descricao: string;
}

export const productService = ProductService.getInstance();