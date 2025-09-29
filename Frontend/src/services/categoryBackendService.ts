// Serviço específico para categorias adaptado para a API Java do backend
import { apiRequest } from './api';
import type { CategoryJavaAPI, PaginatedJavaResponse } from './javaApiTypes';

// Tipos baseados na estrutura real da API Java para categorias
export interface CategoryBackendRequest {
  nome: string;
  descricao?: string;
  ativo?: boolean;
}

export interface CategoryBackendResponse {
  id_categoria?: number;
  nome: string;
  descricao?: string;
  status: 'ATIVA' | 'INATIVA';
  data_criacao?: string;
  data_atualizacao?: string;
}

class CategoryBackendService {
  private static instance: CategoryBackendService;
  
  public static getInstance(): CategoryBackendService {
    if (!CategoryBackendService.instance) {
      CategoryBackendService.instance = new CategoryBackendService();
    }
    return CategoryBackendService.instance;
  }

  /**
   * Busca categorias com paginação - adaptado para API Java atual
   * NOTA: O backend atual não suporta paginação, então fazemos no frontend
   */
  async getCategories(params?: {
    page?: number;
    size?: number;
    search?: string;
    ativo?: boolean;
  }): Promise<PaginatedJavaResponse<CategoryBackendResponse>> {
    // Como o backend atual não suporta paginação nem filtros,
    // buscamos todas as categorias e aplicamos filtros no frontend
    const allCategories = await this.getAllCategories();
    
    let filteredCategories = allCategories;
    
    // Aplicar filtro de busca se fornecido
    if (params?.search) {
      const searchTerm = params.search.toLowerCase();
      filteredCategories = filteredCategories.filter(category =>
        category.nome.toLowerCase().includes(searchTerm) ||
        (category.descricao && category.descricao.toLowerCase().includes(searchTerm))
      );
    }
    
    // Aplicar filtro de status se fornecido
    if (params?.ativo !== undefined) {
      filteredCategories = filteredCategories.filter(category => 
        params.ativo ? category.status === 'ATIVA' : category.status === 'INATIVA'
      );
    }
    
    // Aplicar paginação
    const page = params?.page || 0;
    const size = params?.size || 10;
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const content = filteredCategories.slice(startIndex, endIndex);
    
    // Retornar no formato de paginação esperado
    return {
      content,
      totalElements: filteredCategories.length,
      totalPages: Math.ceil(filteredCategories.length / size),
      size,
      number: page,
      first: page === 0,
      last: endIndex >= filteredCategories.length,
      empty: content.length === 0,
    };
  }

  /**
   * Busca categoria por ID
   */
  async getCategoryById(id: string): Promise<CategoryBackendResponse> {
    return await apiRequest<CategoryBackendResponse>(`/categorias/${id}`);
  }

  /**
   * Cria uma nova categoria
   */
  async createCategory(categoryData: CategoryBackendRequest): Promise<CategoryBackendResponse> {
    return await apiRequest<CategoryBackendResponse>('/categorias', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  /**
   * Atualiza uma categoria existente
   */
  async updateCategory(id: string, categoryData: Partial<CategoryBackendRequest>): Promise<CategoryBackendResponse> {
    return await apiRequest<CategoryBackendResponse>(`/categorias/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  /**
   * Exclui uma categoria
   */
  async deleteCategory(id: string): Promise<void> {
    await apiRequest<void>(`/categorias/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Ativa/desativa uma categoria
   */
  async toggleCategoryStatus(id: string, ativo: boolean): Promise<CategoryBackendResponse> {
    return await apiRequest<CategoryBackendResponse>(`/categorias/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: ativo ? 'ATIVA' : 'INATIVA' }),
    });
  }

  /**
   * Busca todas as categorias (sem paginação) - usa o endpoint que existe no backend
   */
  async getAllCategories(): Promise<CategoryBackendResponse[]> {
    try {
      const response = await apiRequest<CategoryBackendResponse[]>('/categorias');
      // Filtrar categorias inválidas (sem id_categoria)
      return response.filter(category => 
        category && 
        category.id_categoria !== undefined && 
        category.id_categoria !== null &&
        category.nome
      );
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      return [];
    }
  }

  /**
   * Transforma resposta do backend para formato usado no frontend
   */
  transformToFrontendFormat(backendCategory: CategoryBackendResponse) {
    // Verificação de segurança
    if (!backendCategory || backendCategory.id_categoria === undefined || backendCategory.id_categoria === null) {
      console.warn('transformToFrontendFormat: Categoria inválida recebida do backend', backendCategory);
      return {
        id: '',
        name: '',
        description: '',
        active: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    
    return {
      id: backendCategory.id_categoria.toString(),
      name: backendCategory.nome || '',
      description: backendCategory.descricao || '',
      active: backendCategory.status === 'ATIVA',
      createdAt: backendCategory.data_criacao || new Date().toISOString(),
      updatedAt: backendCategory.data_atualizacao || new Date().toISOString(),
    };
  }

  /**
   * Transforma dados do frontend para formato do backend
   */
  transformToBackendFormat(frontendData: any): CategoryBackendRequest {
    const ativo = frontendData.active !== undefined ? frontendData.active : frontendData.ativo !== undefined ? frontendData.ativo : true;
    return {
      nome: frontendData.name || frontendData.nome,
      descricao: frontendData.description || frontendData.descricao,
      ativo,
    };
  }
}

export const categoryBackendService = CategoryBackendService.getInstance();