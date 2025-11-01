import { apiRequest } from './api';
import type { 
  DashboardKPIs,
  SalesReport,
  InventoryReport,
  TopProduct,
  SalesByPaymentMethod,
  SalesByHour
} from './types';

class ReportsService {
  private static instance: ReportsService;
  
  public static getInstance(): ReportsService {
    if (!ReportsService.instance) {
      ReportsService.instance = new ReportsService();
    }
    return ReportsService.instance;
  }

  /**
   * Busca KPIs do dashboard com dados reais de vendas
   */
  async getDashboardKPIs(): Promise<DashboardKPIs> {
    return await apiRequest<DashboardKPIs>('/reports/dashboard-kpis');
  }

  /**
   * Busca relatório de vendas por período
   */
  async getSalesReport(startDate: string, endDate: string, filters?: {
    cashierId?: string;
    paymentMethod?: string;
    customerId?: string;
  }): Promise<SalesReport> {
    const queryParams = new URLSearchParams({
      startDate,
      endDate,
    });
    
    if (filters?.cashierId) queryParams.set('cashierId', filters.cashierId);
    if (filters?.paymentMethod) queryParams.set('paymentMethod', filters.paymentMethod);
    if (filters?.customerId) queryParams.set('customerId', filters.customerId);

    return await apiRequest<SalesReport>(`/reports/sales?${queryParams.toString()}`);
  }

  /**
   * Busca relatório de inventário
   */
  async getInventoryReport(filters?: {
    categoryId?: string;
    supplierId?: string;
    lowStock?: boolean;
  }): Promise<InventoryReport> {
    const queryParams = new URLSearchParams();
    
    if (filters?.categoryId) queryParams.set('categoryId', filters.categoryId);
    if (filters?.supplierId) queryParams.set('supplierId', filters.supplierId);
    if (filters?.lowStock !== undefined) queryParams.set('lowStock', filters.lowStock.toString());

    const queryString = queryParams.toString();
    const endpoint = `/reports/inventory${queryString ? `?${queryString}` : ''}`;

    return await apiRequest<InventoryReport>(endpoint);
  }

  /**
   * Busca relatório financeiro
   */
  async getFinancialReport(startDate: string, endDate: string): Promise<{
    totalRevenue: number;
    totalCost: number;
    grossProfit: number;
    grossMargin: number;
    totalSales: number;
    averageTicket: number;
    revenueByDay: Array<{
      date: string;
      revenue: number;
      sales: number;
    }>;
    revenueByPaymentMethod: SalesByPaymentMethod[];
    topProducts: TopProduct[];
    topCategories: Array<{
      categoryId: string;
      categoryName: string;
      revenue: number;
      sales: number;
    }>;
  }> {
    return await apiRequest(`/reports/financial?startDate=${startDate}&endDate=${endDate}`);
  }

  /**
   * Busca relatório de performance de funcionários
   */
  async getEmployeePerformanceReport(startDate: string, endDate: string): Promise<{
    topCashiers: Array<{
      employeeId: string;
      employeeName: string;
      totalSales: number;
      totalRevenue: number;
      averageTicket: number;
    }>;
    performanceByDay: Array<{
      date: string;
      employeeId: string;
      employeeName: string;
      sales: number;
      revenue: number;
    }>;
    salesByHour: SalesByHour[];
  }> {
    return await apiRequest(`/reports/employee-performance?startDate=${startDate}&endDate=${endDate}`);
  }

  /**
   * Busca relatório de clientes
   */
  async getCustomersReport(startDate: string, endDate: string): Promise<{
    totalCustomers: number;
    newCustomers: number;
    returningCustomers: number;
    topCustomers: Array<{
      customerId: string;
      customerName: string;
      totalPurchases: number;
      totalSpent: number;
      averageTicket: number;
      lastPurchase: string;
    }>;
    customersByType: Record<'INDIVIDUAL' | 'COMPANY', number>;
    salesFrequency: Record<string, number>;
  }> {
    return await apiRequest(`/reports/customers?startDate=${startDate}&endDate=${endDate}`);
  }

  /**
   * Busca relatório de fornecedores
   */
  async getSuppliersReport(startDate?: string, endDate?: string): Promise<{
    totalSuppliers: number;
    activeSuppliers: number;
    topSuppliers: Array<{
      supplierId: string;
      supplierName: string;
      totalProducts: number;
      totalValue: number;
      lastDelivery?: string;
    }>;
    suppliersByRegion: Record<string, number>;
    productsBySupplier: Array<{
      supplierId: string;
      supplierName: string;
      productCount: number;
      stockValue: number;
    }>;
  }> {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.set('startDate', startDate);
    if (endDate) queryParams.set('endDate', endDate);

    const queryString = queryParams.toString();
    const endpoint = `/reports/suppliers${queryString ? `?${queryString}` : ''}`;

    return await apiRequest(endpoint);
  }

  /**
   * Busca relatório de perdas
   */
  async getLossReport(startDate: string, endDate: string): Promise<{
    totalLoss: number;
    totalLossValue: number;
    lossByReason: Record<string, { quantity: number; value: number }>;
    lossByProduct: Array<{
      productId: string;
      productName: string;
      totalLoss: number;
      lossValue: number;
      reason: string;
    }>;
    lossByDay: Array<{
      date: string;
      quantity: number;
      value: number;
    }>;
  }> {
    return await apiRequest(`/reports/loss?startDate=${startDate}&endDate=${endDate}`);
  }

  /**
   * Busca relatório comparativo por período
   */
  async getComparativeReport(
    currentStartDate: string,
    currentEndDate: string,
    previousStartDate: string,
    previousEndDate: string
  ): Promise<{
    current: {
      revenue: number;
      sales: number;
      averageTicket: number;
      customers: number;
    };
    previous: {
      revenue: number;
      sales: number;
      averageTicket: number;
      customers: number;
    };
    growth: {
      revenue: number;
      sales: number;
      averageTicket: number;
      customers: number;
    };
  }> {
    return await apiRequest(
      `/reports/comparative?currentStart=${currentStartDate}&currentEnd=${currentEndDate}&previousStart=${previousStartDate}&previousEnd=${previousEndDate}`
    );
  }

  /**
   * Exporta relatório em formato CSV
   */
  async exportReport(reportType: string, params: Record<string, any>): Promise<Blob> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.set(key, value.toString());
      }
    });

    return await apiRequest<Blob>(`/reports/${reportType}/export?${queryParams.toString()}`, {
      headers: {
        ...await this.getHeaders(),
        'Accept': 'text/csv',
      },
    });
  }

  /**
   * Exporta relatório em formato PDF
   */
  async exportReportPDF(reportType: string, params: Record<string, any>): Promise<Blob> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.set(key, value.toString());
      }
    });

    return await apiRequest<Blob>(`/reports/${reportType}/pdf?${queryParams.toString()}`, {
      headers: {
        ...await this.getHeaders(),
        'Accept': 'application/pdf',
      },
    });
  }

  /**
   * Agenda relatório recorrente
   */
  async scheduleRecurringReport(config: {
    reportType: string;
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    recipients: string[];
    parameters: Record<string, any>;
    active: boolean;
  }): Promise<{
    id: string;
    nextExecution: string;
  }> {
    return await apiRequest('/reports/schedule', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  /**
   * Busca relatórios agendados
   */
  async getScheduledReports(): Promise<Array<{
    id: string;
    reportType: string;
    frequency: string;
    recipients: string[];
    nextExecution: string;
    lastExecution?: string;
    active: boolean;
  }>> {
    return await apiRequest('/reports/scheduled');
  }

  /**
   * Cancela relatório agendado
   */
  async cancelScheduledReport(id: string): Promise<void> {
    await apiRequest(`/reports/scheduled/${id}`, {
      method: 'DELETE',
    });
  }

  private async getHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }
}

export const reportsService = ReportsService.getInstance();