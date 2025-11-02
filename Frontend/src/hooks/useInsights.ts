import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/services/api';

// Query Keys para novos insights
export const insightsKeys = {
  all: ['insights'] as const,
  sazonalidadeMensal: (dias: number) => [...insightsKeys.all, 'sazonalidade-mensal', dias] as const,
  sazonalidadeSemanal: (dias: number) => [...insightsKeys.all, 'sazonalidade-semanal', dias] as const,
  sazonalidadeHoraria: (dias: number) => [...insightsKeys.all, 'sazonalidade-horaria', dias] as const,
  produtosBaixaRotatividade: (limit: number) => [...insightsKeys.all, 'produtos-baixa-rotatividade', limit] as const,
  analiseABC: (dias: number) => [...insightsKeys.all, 'analise-abc', dias] as const,
};

/**
 * Hook para análise de sazonalidade mensal
 */
export function useSazonalidadeMensal(dias: number = 90) {
  return useQuery({
    queryKey: insightsKeys.sazonalidadeMensal(dias),
    queryFn: () => apiRequest(`/insights/sazonalidade/mensal?dias=${dias}`),
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para análise de sazonalidade semanal
 */
export function useSazonalidadeSemanal(dias: number = 60) {
  return useQuery({
    queryKey: insightsKeys.sazonalidadeSemanal(dias),
    queryFn: () => apiRequest(`/insights/sazonalidade/semanal?dias=${dias}`),
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para análise de sazonalidade horária
 */
export function useSazonalidadeHoraria(dias: number = 30) {
  return useQuery({
    queryKey: insightsKeys.sazonalidadeHoraria(dias),
    queryFn: () => apiRequest(`/insights/sazonalidade/horaria?dias=${dias}`),
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para produtos com baixa rotatividade
 */
export function useProdutosBaixaRotatividade(limit: number = 20) {
  return useQuery({
    queryKey: insightsKeys.produtosBaixaRotatividade(limit),
    queryFn: () => apiRequest(`/insights/produtos-baixa-rotatividade?limit=${limit}`),
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para análise ABC
 */
export function useAnaliseABC(dias: number = 90) {
  return useQuery({
    queryKey: insightsKeys.analiseABC(dias),
    queryFn: () => apiRequest(`/insights/analise-abc?dias=${dias}`),
    staleTime: 10 * 60 * 1000,
  });
}
