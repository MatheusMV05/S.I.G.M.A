import { useQuery } from '@tanstack/react-query';
import { inventarioRentabilidadeService, InventarioRentabilidadeDTO } from '@/services/inventarioRentabilidadeService';

/**
 * Hook para buscar inventário completo com análise de rentabilidade
 */
export function useInventarioRentabilidade() {
  return useQuery<InventarioRentabilidadeDTO[], Error>({
    queryKey: ['inventario-rentabilidade'],
    queryFn: () => inventarioRentabilidadeService.getInventarioCompleto(),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

/**
 * Hook para buscar produtos com alta rentabilidade
 */
export function useAltaRentabilidade() {
  return useQuery<InventarioRentabilidadeDTO[], Error>({
    queryKey: ['alta-rentabilidade'],
    queryFn: () => inventarioRentabilidadeService.getAltaRentabilidade(),
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook para buscar produtos com rentabilidade crítica
 */
export function useRentabilidadeCritica() {
  return useQuery<InventarioRentabilidadeDTO[], Error>({
    queryKey: ['rentabilidade-critica'],
    queryFn: () => inventarioRentabilidadeService.getRentabilidadeCritica(),
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook para buscar inventário por categoria
 */
export function useInventarioPorCategoria(categoriaId: number | null) {
  return useQuery<InventarioRentabilidadeDTO[], Error>({
    queryKey: ['inventario-categoria', categoriaId],
    queryFn: () => inventarioRentabilidadeService.getInventarioPorCategoria(categoriaId!),
    enabled: categoriaId !== null,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook para buscar inventário por fornecedor
 */
export function useInventarioPorFornecedor(fornecedorId: number | null) {
  return useQuery<InventarioRentabilidadeDTO[], Error>({
    queryKey: ['inventario-fornecedor', fornecedorId],
    queryFn: () => inventarioRentabilidadeService.getInventarioPorFornecedor(fornecedorId!),
    enabled: fornecedorId !== null,
    staleTime: 1000 * 60 * 5,
  });
}
