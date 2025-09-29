import { apiRequest } from './api';
import type { 
  ProductJavaAPI,
  CreateProductJavaRequest,
  UpdateProductJavaRequest,
  PaginatedJavaResponse,
  ProductAPI
} from './javaApiTypes';
import { 
  adaptProductFromJava,
  adaptProductToJava
} from './javaApiTypes';

class ProductJavaService {
  private static instance: ProductJavaService;
  
  public static getInstance(): ProductJavaService {
    if (!ProductJavaService.instance) {
      ProductJavaService.instance = new ProductJavaService();
    }
    return ProductJavaService.instance;
  }

  /**
   * Busca produtos com paginação e filtros - adaptado para API Java
   */
  async getProducts(params?: {
    page?: number;
    size?: number;
    search?: string;
    categoryId?: string;
    status?: string;
  }): Promise<{ content: ProductAPI[], totalElements: number, totalPages: number, size: number, number: number, first: boolean, last: boolean }> {
    const queryParams = new URLSearchParams();
    
    if (params?.page !== undefined) queryParams.set('page', params.page.toString());
    if (params?.size !== undefined) queryParams.set('size', params.size.toString());
    if (params?.search) queryParams.set('search', params.search);
    if (params?.categoryId && params.categoryId !== 'all') queryParams.set('categoriaId', params.categoryId);
    if (params?.status && params.status !== 'all') queryParams.set('status', params.status);

    const queryString = queryParams.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;

    try {
      const response = await apiRequest<PaginatedJavaResponse<ProductJavaAPI>>(endpoint);
      
      // Adaptar resposta para formato esperado pela UI
      return {
        content: response.content.map(adaptProductFromJava),
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        size: response.size,
        number: response.number,
        first: response.first,
        last: response.last,
      };
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  }

  /**
   * Busca produto por ID
   */
  async getProductById(id: string): Promise<ProductAPI> {
    try {
      const response = await apiRequest<ProductJavaAPI>(`/products/${id}`);
      return adaptProductFromJava(response);
    } catch (error) {
      console.error('Erro ao buscar produto por ID:', error);
      throw error;
    }
  }

  /**
   * Cria um novo produto
   */
  async createProduct(productData: any): Promise<ProductAPI> {
    try {
      const javaProductData = adaptProductToJava(productData);
      const response = await apiRequest<ProductJavaAPI>('/products', {
        method: 'POST',
        body: JSON.stringify(javaProductData),
      });
      return adaptProductFromJava(response);
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  }

  /**
   * Atualiza um produto existente
   */
  async updateProduct(id: string, productData: any): Promise<ProductAPI> {
    try {
      const javaProductData: any = {
        nome: productData.nome,
        marca: productData.marca,
        descricao: productData.descricao,
        preco_custo: productData.preco_custo,
        valor_unitario: productData.preco_venda, // Backend espera valor_unitario
        quant_em_estoque: productData.estoque, // Backend espera quant_em_estoque
        estoque_minimo: productData.estoque_minimo,
        id_categoria: parseInt(productData.categoria_id || productData.categoryId),
        codigo_barras: productData.codigo_barras,
        unidade: productData.unidade,
        peso: productData.peso,
        status: productData.status,
      };
      
      const response = await apiRequest<ProductJavaAPI>(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(javaProductData),
      });
      return adaptProductFromJava(response);
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
  }

  /**
   * Exclui um produto
   */
  async deleteProduct(id: string): Promise<void> {
    try {
      await apiRequest<void>(`/products/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      throw error;
    }
  }

  /**
   * Ativa/desativa um produto
   */
  async toggleProductStatus(id: string, active: boolean): Promise<ProductAPI> {
    try {
      const status = active ? 'ATIVO' : 'INATIVO';
      const response = await apiRequest<ProductJavaAPI>(`/products/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      return adaptProductFromJava(response);
    } catch (error) {
      console.error('Erro ao alterar status do produto:', error);
      throw error;
    }
  }

  /**
   * Atualiza estoque de um produto
   */
  async updateProductStock(id: string, estoque: number): Promise<ProductAPI> {
    try {
      const response = await apiRequest<ProductJavaAPI>(`/products/${id}/estoque`, {
        method: 'PATCH',
        body: JSON.stringify({ estoque }),
      });
      return adaptProductFromJava(response);
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      throw error;
    }
  }

  /**
   * Busca produtos com estoque baixo
   */
  async getLowStockProducts(): Promise<ProductAPI[]> {
    try {
      const response = await apiRequest<ProductJavaAPI[]>('/products/estoque-baixo');
      return response.map(adaptProductFromJava);
    } catch (error) {
      console.error('Erro ao buscar produtos com estoque baixo:', error);
      throw error;
    }
  }
}

export const productJavaService = ProductJavaService.getInstance();