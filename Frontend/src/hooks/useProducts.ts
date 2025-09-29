import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services';
import type { Product, CreateProductRequest } from '@/services/types';

// Query Keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: any) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  lowStock: () => [...productKeys.all, 'low-stock'] as const,
  topSelling: () => [...productKeys.all, 'top-selling'] as const,
  suggestions: (query: string) => [...productKeys.all, 'suggestions', query] as const,
};

// Hook para listar produtos
export const useProducts = (params?: {
  page?: number;
  size?: number;
  search?: string;
  categoryId?: string;
  supplierId?: string;
  lowStock?: boolean;
  active?: boolean;
}) => {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productService.getProducts(params),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

// Hook para buscar produto por ID
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para buscar produto por código de barras - desabilitado por enquanto
// export const useProductByBarcode = (barcode: string) => {
//   return useQuery({
//     queryKey: ['products', 'barcode', barcode],
//     queryFn: () => productJavaService.getProductByBarcode(barcode),
//     enabled: !!barcode && barcode.length >= 8,
//     staleTime: 5 * 60 * 1000,
//   });
// };

// Hook para produtos com estoque baixo
export const useLowStockProducts = () => {
  return useQuery({
    queryKey: productKeys.lowStock(),
    queryFn: () => productService.getLowStockProducts(),
    staleTime: 1 * 60 * 1000, // 1 minuto
  });
};

// Hook para produtos mais vendidos - desabilitado por enquanto
// export const useTopSellingProducts = (limit = 10) => {
//   return useQuery({
//     queryKey: [...productKeys.topSelling(), limit],
//     queryFn: () => productJavaService.getTopSellingProducts(limit),
//     staleTime: 5 * 60 * 1000,
//   });
// };

// Hook para sugestões de produtos - desabilitado por enquanto
// export const useProductSuggestions = (query: string, limit = 5) => {
//   return useQuery({
//     queryKey: [...productKeys.suggestions(query), limit],
//     queryFn: () => productJavaService.getProductSuggestions(query, limit),
//     enabled: query.length >= 2,
//     staleTime: 30 * 1000,
//   });
// };

// Hook para criar produto
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (productData: CreateProductRequest) => productService.createProduct(productData),
    onSuccess: () => {
      // Invalida todas as listas de produtos
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.lowStock() });
    },
  });
};

// Hook para atualizar produto
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateProductRequest> }) =>
      productService.updateProduct(id, data),
    onSuccess: (updatedProduct) => {
      // Atualiza o produto específico no cache
      queryClient.setQueryData(productKeys.detail(updatedProduct.id_produto.toString()), updatedProduct);
      // Invalida listas
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.lowStock() });
    },
  });
};

// Hook para excluir produto
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: (_, deletedId) => {
      // Remove o produto do cache
      queryClient.removeQueries({ queryKey: productKeys.detail(deletedId) });
      // Invalida listas
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.lowStock() });
    },
  });
};

// Hook para ativar/desativar produto
export const useToggleProductStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      productService.toggleProductStatus(id, active),
    onSuccess: (updatedProduct) => {
      // Atualiza o produto específico no cache
      queryClient.setQueryData(productKeys.detail(updatedProduct.id_produto.toString()), updatedProduct);
      // Invalida listas
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

// Hook para atualizar preço do produto - usando updateProduct
export const useUpdateProductPrice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, price, costPrice }: { id: string; price: number; costPrice?: number }) =>
      productService.updateProduct(id, { preco_venda: price, preco_custo: costPrice }),
    onSuccess: (updatedProduct) => {
      // Atualiza o produto específico no cache
      queryClient.setQueryData(productKeys.detail(updatedProduct.id_produto.toString()), updatedProduct);
      // Invalida listas
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

// Hook para atualizar estoque do produto
export const useUpdateProductStock = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, stock }: { id: string; stock: number }) =>
      productService.updateProductStock(id, stock),
    onSuccess: (updatedProduct) => {
      // Atualiza o produto específico no cache
      queryClient.setQueryData(productKeys.detail(updatedProduct.id_produto.toString()), updatedProduct);
      // Invalida listas e estoque baixo
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.lowStock() });
    },
  });
};

// Hook para duplicar produto - desabilitado por enquanto
// export const useDuplicateProduct = () => {
//   const queryClient = useQueryClient();
//   
//   return useMutation({
//     mutationFn: (id: string) => productJavaService.duplicateProduct(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: productKeys.lists() });
//     },
//   });
// };

// Hook para importar produtos - desabilitado por enquanto
// export const useImportProducts = () => {
//   const queryClient = useQueryClient();
//   
//   return useMutation({
//     mutationFn: (file: File) => productJavaService.importProducts(file),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: productKeys.all });
//     },
//   });
// };