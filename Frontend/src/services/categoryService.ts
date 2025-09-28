import { apiRequest } from './api';
import type { 
  Category, 
  CreateCategoryRequest, 
  PaginatedResponse 
} from './types';

class CategoryService {
  private static instance: CategoryService;
  
  public static getInstance(): CategoryService {
    if (!CategoryService.instance) {
      CategoryService.instance = new CategoryService();
    }
    return CategoryService.instance;
  }

  /**
   * Busca todas as categorias
   */
  async getCategories(params?: {
    page?: number;
    size?: number;
    search?: string;
    parentId?: string;
    active?: boolean;
  }): Promise<PaginatedResponse<Category>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page !== undefined) queryParams.set('page', params.page.toString());
    if (params?.size !== undefined) queryParams.set('size', params.size.toString());
    if (params?.search) queryParams.set('search', params.search);
    if (params?.parentId) queryParams.set('parentId', params.parentId);
    if (params?.active !== undefined) queryParams.set('active', params.active.toString());

    const queryString = queryParams.toString();
    const endpoint = `/categories${queryString ? `?${queryString}` : ''}`;

    return await apiRequest<PaginatedResponse<Category>>(endpoint);
  }

  /**
   * Busca categorias em formato de árvore
   */
  async getCategoriesTree(): Promise<Category[]> {
    return await apiRequest<Category[]>('/categories/tree');
  }

  /**
   * Busca categoria por ID
   */
  async getCategoryById(id: string): Promise<Category> {
    return await apiRequest<Category>(`/categories/${id}`);
  }

  /**
   * Cria uma nova categoria
   */
  async createCategory(categoryData: CreateCategoryRequest): Promise<Category> {
    return await apiRequest<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  /**
   * Atualiza uma categoria existente
   */
  async updateCategory(id: string, categoryData: Partial<CreateCategoryRequest>): Promise<Category> {
    return await apiRequest<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  /**
   * Exclui uma categoria
   */
  async deleteCategory(id: string): Promise<void> {
    await apiRequest<void>(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Ativa/desativa uma categoria
   */
  async toggleCategoryStatus(id: string, active: boolean): Promise<Category> {
    return await apiRequest<Category>(`/categories/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ active }),
    });
  }

  /**
   * Busca subcategorias de uma categoria pai
   */
  async getSubcategories(parentId: string): Promise<Category[]> {
    return await apiRequest<Category[]>(`/categories/${parentId}/subcategories`);
  }

  /**
   * Busca categorias populares (com mais produtos)
   */
  async getPopularCategories(limit = 10): Promise<Category[]> {
    return await apiRequest<Category[]>(`/categories/popular?limit=${limit}`);
  }

  /**
   * Move categoria para outro pai
   */
  async moveCategory(id: string, newParentId: string | null): Promise<Category> {
    return await apiRequest<Category>(`/categories/${id}/move`, {
      method: 'PATCH',
      body: JSON.stringify({ parentId: newParentId }),
    });
  }
}

export const categoryService = CategoryService.getInstance();