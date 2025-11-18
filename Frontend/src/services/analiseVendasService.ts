import { apiRequest } from './api';

/**
 * Tipos para a VIEW vw_analise_vendas_completa
 */
export interface AnaliseVendasCompletaDTO {
  // Dados da Venda
  idVenda: number;
  dataVenda: string;
  dataVendaSimples: string;
  valorTotal: number;
  desconto: number;
  valorFinal: number;
  metodoPagamento: string;
  statusVenda: string;
  
  // Dados do Cliente
  idCliente: number;
  clienteNome: string;
  clienteEmail: string;
  clienteCidade: string;
  tipoPessoa: string;
  rankingCliente: number;
  totalGastoCliente: number;
  
  // Dados do Funcionário/Vendedor
  idFuncionario: number;
  vendedorNome: string;
  vendedorCargo: string;
  vendedorSetor: string;
  
  // Dados do Caixa
  idCaixa: number;
  statusCaixa: string;
  
  // Métricas Calculadas
  percentualDesconto: number;
  valorMedioItem: number;
  quantidadeItens: number;
  diaSemanaVenda: string;
  horaVenda: number;
}

/**
 * Service para acessar dados da VIEW vw_analise_vendas_completa
 */
class AnaliseVendasService {
  private static instance: AnaliseVendasService;
  
  public static getInstance(): AnaliseVendasService {
    if (!AnaliseVendasService.instance) {
      AnaliseVendasService.instance = new AnaliseVendasService();
    }
    return AnaliseVendasService.instance;
  }

  /**
   * Busca análise completa de vendas dos últimos N dias
   */
  async getAnaliseCompleta(dias: number = 30): Promise<AnaliseVendasCompletaDTO[]> {
    return await apiRequest<AnaliseVendasCompletaDTO[]>(`/reports/analise-vendas-completa?dias=${dias}`);
  }

  /**
   * Busca análise de vendas por cliente
   */
  async getAnaliseVendasPorCliente(clienteId: number): Promise<AnaliseVendasCompletaDTO[]> {
    return await apiRequest<AnaliseVendasCompletaDTO[]>(`/reports/analise-vendas-completa/cliente/${clienteId}`);
  }

  /**
   * Busca análise de vendas por vendedor
   */
  async getAnaliseVendasPorVendedor(vendedorId: number): Promise<AnaliseVendasCompletaDTO[]> {
    return await apiRequest<AnaliseVendasCompletaDTO[]>(`/reports/analise-vendas-completa/vendedor/${vendedorId}`);
  }

  /**
   * Busca top vendas por valor
   */
  async getTopVendas(limit: number = 10): Promise<AnaliseVendasCompletaDTO[]> {
    return await apiRequest<AnaliseVendasCompletaDTO[]>(`/reports/analise-vendas-completa/top-vendas?limit=${limit}`);
  }

  /**
   * Busca análise de vendas por período
   */
  async getAnaliseVendasPorPeriodo(dataInicio: string, dataFim: string): Promise<AnaliseVendasCompletaDTO[]> {
    return await apiRequest<AnaliseVendasCompletaDTO[]>(
      `/reports/analise-vendas-completa/periodo?dataInicio=${dataInicio}&dataFim=${dataFim}`
    );
  }

  /**
   * Busca vendas com alto desconto
   */
  async getVendasComAltoDesconto(percentual: number = 10): Promise<AnaliseVendasCompletaDTO[]> {
    return await apiRequest<AnaliseVendasCompletaDTO[]>(
      `/reports/analise-vendas-completa/alto-desconto?percentual=${percentual}`
    );
  }
}

export const analiseVendasService = AnaliseVendasService.getInstance();
