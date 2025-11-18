import { useQuery } from '@tanstack/react-query';
import { analiseVendasService, AnaliseVendasCompletaDTO } from '@/services/analiseVendasService';

/**
 * Hook para buscar análise completa de vendas
 */
export function useAnaliseVendasCompleta(dias: number = 30) {
  return useQuery<AnaliseVendasCompletaDTO[], Error>({
    queryKey: ['analise-vendas-completa', dias],
    queryFn: () => analiseVendasService.getAnaliseCompleta(dias),
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}

/**
 * Hook para buscar análise de vendas por cliente
 */
export function useAnaliseVendasPorCliente(clienteId: number | null) {
  return useQuery<AnaliseVendasCompletaDTO[], Error>({
    queryKey: ['analise-vendas-cliente', clienteId],
    queryFn: () => analiseVendasService.getAnaliseVendasPorCliente(clienteId!),
    enabled: clienteId !== null,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Hook para buscar análise de vendas por vendedor
 */
export function useAnaliseVendasPorVendedor(vendedorId: number | null) {
  return useQuery<AnaliseVendasCompletaDTO[], Error>({
    queryKey: ['analise-vendas-vendedor', vendedorId],
    queryFn: () => analiseVendasService.getAnaliseVendasPorVendedor(vendedorId!),
    enabled: vendedorId !== null,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Hook para buscar top vendas
 */
export function useTopVendas(limit: number = 10) {
  return useQuery<AnaliseVendasCompletaDTO[], Error>({
    queryKey: ['top-vendas', limit],
    queryFn: () => analiseVendasService.getTopVendas(limit),
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Hook para buscar análise de vendas por período
 */
export function useAnaliseVendasPorPeriodo(dataInicio: string | null, dataFim: string | null) {
  return useQuery<AnaliseVendasCompletaDTO[], Error>({
    queryKey: ['analise-vendas-periodo', dataInicio, dataFim],
    queryFn: () => analiseVendasService.getAnaliseVendasPorPeriodo(dataInicio!, dataFim!),
    enabled: dataInicio !== null && dataFim !== null,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Hook para buscar vendas com alto desconto
 */
export function useVendasComAltoDesconto(percentual: number = 10) {
  return useQuery<AnaliseVendasCompletaDTO[], Error>({
    queryKey: ['vendas-alto-desconto', percentual],
    queryFn: () => analiseVendasService.getVendasComAltoDesconto(percentual),
    staleTime: 1000 * 60 * 2,
  });
}
