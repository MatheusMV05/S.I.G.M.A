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
  async createProduct(productData: CreateProductRequest): Promise<Product> {
    return await apiRequest<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  /**
   * Atualiza um produto existente
   */
  async updateProduct(id: string, productData: Partial<CreateProductRequest>): Promise<Product> {
    return await apiRequest<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
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

  private async getHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }
}

export const productService = ProductService.getInstance();