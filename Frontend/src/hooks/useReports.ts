import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsService } from '@/services';
import { reportService, ProdutoNuncaVendidoDTO, ProdutoAcimaMediaDTO, ClienteVIPDTO } from '@/services/reportService';
import type { DashboardKPIs, SalesReport, InventoryReport } from '@/services/types';

// Query Keys
export const reportKeys = {
  all: ['reports'] as const,
  dashboard: () => [...reportKeys.all, 'dashboard'] as const,
  sales: (startDate: string, endDate: string, filters?: any) => 
    [...reportKeys.all, 'sales', { startDate, endDate, filters }] as const,
  inventory: (filters?: any) => [...reportKeys.all, 'inventory', { filters }] as const,
  financial: (startDate: string, endDate: string) => 
    [...reportKeys.all, 'financial', { startDate, endDate }] as const,
  employees: (startDate: string, endDate: string) => 
    [...reportKeys.all, 'employees', { startDate, endDate }] as const,
  customers: (startDate: string, endDate: string) => 
    [...reportKeys.all, 'customers', { startDate, endDate }] as const,
  suppliers: (startDate?: string, endDate?: string) => 
    [...reportKeys.all, 'suppliers', { startDate, endDate }] as const,
  loss: (startDate: string, endDate: string) => 
    [...reportKeys.all, 'loss', { startDate, endDate }] as const,
  comparative: (params: any) => [...reportKeys.all, 'comparative', params] as const,
  scheduled: () => [...reportKeys.all, 'scheduled'] as const,
  // Feature #6: Relatórios Avançados com SQL
  produtosNuncaVendidos: (limit: number) => [...reportKeys.all, 'produtos-nunca-vendidos', limit] as const,
  produtosAcimaMedia: (limit: number) => [...reportKeys.all, 'produtos-acima-media', limit] as const,
  clientesVIP: (limit: number) => [...reportKeys.all, 'clientes-vip', limit] as const,
};

// Hook para KPIs do dashboard
export const useDashboardKPIs = () => {
  return useQuery({
    queryKey: reportKeys.dashboard(),
    queryFn: () => reportsService.getDashboardKPIs(),
    staleTime: 2 * 60 * 1000, // 2 minutos
    refetchInterval: 5 * 60 * 1000, // Atualiza a cada 5 minutos
  });
};

// Hook para relatório de vendas
export const useSalesReport = (
  startDate: string,
  endDate: string,
  filters?: {
    cashierId?: string;
    paymentMethod?: string;
    customerId?: string;
  }
) => {
  return useQuery({
    queryKey: reportKeys.sales(startDate, endDate, filters),
    queryFn: () => reportsService.getSalesReport(startDate, endDate, filters),
    enabled: !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para relatório de inventário
export const useInventoryReport = (filters?: {
  categoryId?: string;
  supplierId?: string;
  lowStock?: boolean;
}) => {
  return useQuery({
    queryKey: reportKeys.inventory(filters),
    queryFn: () => reportsService.getInventoryReport(filters),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para relatório financeiro
export const useFinancialReport = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: reportKeys.financial(startDate, endDate),
    queryFn: () => reportsService.getFinancialReport(startDate, endDate),
    enabled: !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para relatório de performance de funcionários
export const useEmployeePerformanceReport = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: reportKeys.employees(startDate, endDate),
    queryFn: () => reportsService.getEmployeePerformanceReport(startDate, endDate),
    enabled: !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para relatório de clientes
export const useCustomersReport = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: reportKeys.customers(startDate, endDate),
    queryFn: () => reportsService.getCustomersReport(startDate, endDate),
    enabled: !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para relatório de fornecedores
export const useSuppliersReport = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: reportKeys.suppliers(startDate, endDate),
    queryFn: () => reportsService.getSuppliersReport(startDate, endDate),
    staleTime: 10 * 60 * 1000,
  });
};

// Hook para relatório de perdas
export const useLossReport = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: reportKeys.loss(startDate, endDate),
    queryFn: () => reportsService.getLossReport(startDate, endDate),
    enabled: !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para relatório comparativo
export const useComparativeReport = (
  currentStartDate: string,
  currentEndDate: string,
  previousStartDate: string,
  previousEndDate: string
) => {
  return useQuery({
    queryKey: reportKeys.comparative({
      currentStartDate,
      currentEndDate,
      previousStartDate,
      previousEndDate,
    }),
    queryFn: () =>
      reportsService.getComparativeReport(
        currentStartDate,
        currentEndDate,
        previousStartDate,
        previousEndDate
      ),
    enabled: !!currentStartDate && !!currentEndDate && !!previousStartDate && !!previousEndDate,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para relatórios agendados
export const useScheduledReports = () => {
  return useQuery({
    queryKey: reportKeys.scheduled(),
    queryFn: () => reportsService.getScheduledReports(),
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para exportar relatório
export const useExportReport = () => {
  return useMutation({
    mutationFn: ({ reportType, params }: { reportType: string; params: Record<string, any> }) =>
      reportsService.exportReport(reportType, params),
  });
};

// Hook para exportar relatório em PDF
export const useExportReportPDF = () => {
  return useMutation({
    mutationFn: ({ reportType, params }: { reportType: string; params: Record<string, any> }) =>
      reportsService.exportReportPDF(reportType, params),
  });
};

// Hook para agendar relatório recorrente
export const useScheduleRecurringReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (config: {
      reportType: string;
      frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
      recipients: string[];
      parameters: Record<string, any>;
      active: boolean;
    }) => reportsService.scheduleRecurringReport(config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.scheduled() });
    },
  });
};

// Hook para cancelar relatório agendado
export const useCancelScheduledReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => reportsService.cancelScheduledReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.scheduled() });
    },
  });
};

// ================================================================
// Feature #6: Hooks para Relatórios Avançados com SQL
// ================================================================

/**
 * Hook para produtos que nunca foram vendidos (ANTI JOIN)
 */
export function useProdutosNuncaVendidos(limit: number = 10) {
  return useQuery<ProdutoNuncaVendidoDTO[], Error>({
    queryKey: reportKeys.produtosNuncaVendidos(limit),
    queryFn: () => reportService.getProdutosNuncaVendidos(limit),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para produtos com preço acima da média (SUBCONSULTA)
 */
export function useProdutosAcimaMedia(limit: number = 10) {
  return useQuery<ProdutoAcimaMediaDTO[], Error>({
    queryKey: reportKeys.produtosAcimaMedia(limit),
    queryFn: () => reportService.getProdutosAcimaMedia(limit),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para clientes VIP (SUBCONSULTA)
 */
export function useClientesVIP(limit: number = 10) {
  return useQuery<ClienteVIPDTO[], Error>({
    queryKey: reportKeys.clientesVIP(limit),
    queryFn: () => reportService.getClientesVIP(limit),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}