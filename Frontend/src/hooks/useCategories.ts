import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/services';
import type { Category, CreateCategoryRequest } from '@/services/types';

// Query Keys
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters: any) => [...categoryKeys.lists(), { filters }] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
  tree: () => [...categoryKeys.all, 'tree'] as const,
  popular: () => [...categoryKeys.all, 'popular'] as const,
  subcategories: (parentId: string) => [...categoryKeys.all, 'subcategories', parentId] as const,
};

// Hook para listar categorias
export const useCategories = (params?: {
  page?: number;
  size?: number;
  search?: string;
  parentId?: string;
  active?: boolean;
}) => {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => categoryService.getCategories(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para árvore de categorias
export const useCategoriesTree = () => {
  return useQuery({
    queryKey: categoryKeys.tree(),
    queryFn: () => categoryService.getCategoriesTree(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para buscar categoria por ID
export const useCategory = (id: string) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryService.getCategoryById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para subcategorias
export const useSubcategories = (parentId: string) => {
  return useQuery({
    queryKey: categoryKeys.subcategories(parentId),
    queryFn: () => categoryService.getSubcategories(parentId),
    enabled: !!parentId,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para categorias populares
export const usePopularCategories = (limit = 10) => {
  return useQuery({
    queryKey: [...categoryKeys.popular(), limit],
    queryFn: () => categoryService.getPopularCategories(limit),
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para criar categoria
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (categoryData: CreateCategoryRequest) => categoryService.createCategory(categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
};

// Hook para atualizar categoria
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateCategoryRequest> }) =>
      categoryService.updateCategory(id, data),
    onSuccess: (updatedCategory) => {
      queryClient.setQueryData(categoryKeys.detail(updatedCategory.id), updatedCategory);
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.tree() });
    },
  });
};

// Hook para excluir categoria
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: categoryKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
};

// Hook para ativar/desativar categoria
export const useToggleCategoryStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      categoryService.toggleCategoryStatus(id, active),
    onSuccess: (updatedCategory) => {
      queryClient.setQueryData(categoryKeys.detail(updatedCategory.id), updatedCategory);
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.tree() });
    },
  });
};

// Hook para mover categoria
export const useMoveCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, newParentId }: { id: string; newParentId: string | null }) =>
      categoryService.moveCategory(id, newParentId),
    onSuccess: (updatedCategory) => {
      queryClient.setQueryData(categoryKeys.detail(updatedCategory.id), updatedCategory);
      queryClient.invalidateQueries({ queryKey: categoryKeys.tree() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
};