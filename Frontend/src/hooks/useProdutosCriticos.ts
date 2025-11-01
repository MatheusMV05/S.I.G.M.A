import { useQuery } from '@tanstack/react-query';
import { stockService, type RelatorioProdutosCriticos } from '@/services/stockService';

export function useProdutosCriticos(options?: {
  refetchInterval?: number;
  enabled?: boolean;
}) {
  return useQuery<RelatorioProdutosCriticos>({
    queryKey: ['produtos-criticos'],
    queryFn: () => stockService.getRelatorioProdutosCriticos(),
    refetchInterval: options?.refetchInterval || 30000, // Atualiza a cada 30 segundos por padrão
    enabled: options?.enabled !== false,
    staleTime: 10000, // Considera os dados "frescos" por 10 segundos
  });
}
