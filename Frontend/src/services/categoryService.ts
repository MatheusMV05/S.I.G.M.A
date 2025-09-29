import { categoryBackendService } from './categoryBackendService';
import { adaptCategoryFromJava, adaptCategoryToJava } from './javaApiTypes';
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
    const javaParams = {
      page: params?.page,
      size: params?.size,
      search: params?.search,
      ativo: params?.active,
    };
    
    const response = await categoryBackendService.getCategories(javaParams);
    
    return {
      content: response.content.map(adaptCategoryFromJava),
      totalElements: response.totalElements,
      totalPages: response.totalPages,
      size: response.size,
      number: response.number,
      first: response.first,
      last: response.last,
    };
  }

  /**
   * Busca categorias em formato de árvore
   */
  async getCategoriesTree(): Promise<Category[]> {
    const response = await categoryBackendService.getAllCategories();
    return response.map(adaptCategoryFromJava);
  }

  /**
   * Busca categoria por ID
   */
  async getCategoryById(id: string): Promise<Category> {
    const response = await categoryBackendService.getCategoryById(id);
    return adaptCategoryFromJava(response);
  }

  /**
   * Cria uma nova categoria
   */
  async createCategory(categoryData: CreateCategoryRequest): Promise<Category> {
    const javaData = adaptCategoryToJava(categoryData);
    const response = await categoryBackendService.createCategory(javaData);
    return adaptCategoryFromJava(response);
  }

  /**
   * Atualiza uma categoria existente
   */
  async updateCategory(id: string, categoryData: Partial<CreateCategoryRequest>): Promise<Category> {
    const javaData = adaptCategoryToJava(categoryData);
    const response = await categoryBackendService.updateCategory(id, javaData);
    return adaptCategoryFromJava(response);
  }

  /**
   * Exclui uma categoria
   */
  async deleteCategory(id: string): Promise<void> {
    return await categoryBackendService.deleteCategory(id);
  }

  /**
   * Ativa/desativa uma categoria
   */
  async toggleCategoryStatus(id: string, active: boolean): Promise<Category> {
    const response = await categoryBackendService.toggleCategoryStatus(id, active);
    return adaptCategoryFromJava(response);
  }

  /**
   * Busca subcategorias de uma categoria pai
   */
  async getSubcategories(parentId: string): Promise<Category[]> {
    // Backend atual não suporta hierarquia
    return [];
  }

  /**
   * Busca categorias populares (com mais produtos)
   */
  async getPopularCategories(limit = 10): Promise<Category[]> {
    const response = await categoryBackendService.getAllCategories();
    return response.slice(0, limit).map(adaptCategoryFromJava);
  }

  /**
   * Move categoria para outro pai
   */
  async moveCategory(id: string, newParentId: string | null): Promise<Category> {
    throw new Error('Mover categorias não é suportado pelo backend atual');
  }

  /**
   * Busca todas as categorias sem paginação (útil para dropdowns)
   */
  async getAllCategories(): Promise<Category[]> {
    const response = await categoryBackendService.getAllCategories();
    return response.map(adaptCategoryFromJava);
  }
}

export const categoryService = CategoryService.getInstance();