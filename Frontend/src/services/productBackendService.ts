// Serviço específico para produtos adaptado para a API Java do backend
import { apiRequest } from './api';

// Tipos baseados na estrutura real da API Java
export interface ProductBackendRequest {
  nome: string;
  marca: string;
  descricao?: string;
  precoCusto: number;
  precoVenda: number;
  estoque: number;
  estoqueMinimo: number;
  categoriaId: number;
  codigoBarras?: string;
  unidade?: string;
  peso?: number;
}

export interface ProductBackendResponse {
  id_produto: number;
  nome: string;
  marca: string;
  descricao: string;
  preco_custo: number;
  preco_venda: number;
  estoque: number;
  estoque_minimo: number;
  status: 'ATIVO' | 'INATIVO';
  categoria: { id: number; nome: string; };
  codigo_barras?: string;
  unidade?: string;
  peso?: number;
  data_criacao?: string;
  data_atualizacao?: string;
}

class ProductBackendService {
  private static instance: ProductBackendService;
  
  public static getInstance(): ProductBackendService {
    if (!ProductBackendService.instance) {
      ProductBackendService.instance = new ProductBackendService();
    }
    return ProductBackendService.instance;
  }

  /**
   * Busca produtos com paginação
   */
  async getProducts(params?: {
    page?: number;
    size?: number;
    search?: string;
    categoryId?: string;
    active?: boolean;
  }) {
    const queryParams = new URLSearchParams();
    
    if (params?.page !== undefined) queryParams.set('page', params.page.toString());
    if (params?.size !== undefined) queryParams.set('size', params.size.toString());
    if (params?.search) queryParams.set('search', params.search);
    if (params?.categoryId) queryParams.set('categoryId', params.categoryId);
    if (params?.active !== undefined) queryParams.set('active', params.active.toString());

    const queryString = queryParams.toString();
    const endpoint = `/produto${queryString ? `?${queryString}` : ''}`;

    return await apiRequest(endpoint);
  }

  /**
   * Busca produto por ID
   */
  async getProductById(id: string) {
    return await apiRequest(`/produto/${id}`);
  }

  /**
   * Cria um novo produto
   */
  async createProduct(productData: ProductBackendRequest) {
    return await apiRequest('/produto', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  /**
   * Atualiza um produto existente
   */
  async updateProduct(id: string, productData: Partial<ProductBackendRequest>) {
    return await apiRequest(`/produto/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  /**
   * Exclui um produto
   */
  async deleteProduct(id: string): Promise<void> {
    await apiRequest<void>(`/produto/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Ativa/desativa um produto
   */
  async toggleProductStatus(id: string, active: boolean) {
    return await apiRequest(`/produto/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ ativo: active }),
    });
  }

  /**
   * Atualiza estoque de um produto
   */
  async updateProductStock(id: string, estoque: number) {
    return await apiRequest(`/produto/${id}/estoque`, {
      method: 'PATCH',
      body: JSON.stringify({ estoque }),
    });
  }

  /**
   * Atualiza preço de um produto
   */
  async updateProductPrice(id: string, precoVenda: number, precoCusto?: number) {
    return await apiRequest(`/produto/${id}/preco`, {
      method: 'PATCH',
      body: JSON.stringify({ precoVenda, precoCusto }),
    });
  }
}

export const productBackendService = ProductBackendService.getInstance();