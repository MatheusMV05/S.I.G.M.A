import { apiRequest } from './api';

// Interfaces dos DTOs
export interface ProdutoNuncaVendidoDTO {
  idProduto: number;
  produtoNome: string;
  marca: string;
  precoVenda: number;
  estoque: number;
  categoriaNome: string;
  fornecedorNome: string;
  valorInvestido: number;
  valorPotencialVenda: number;
  diasSemVenda: number;
}

export interface ProdutoAcimaMediaDTO {
  idProduto: number;
  produtoNome: string;
  precoVenda: number;
  categoriaNome: string;
  diferencaMedia: number;
  percentualAcimaMedia: number;
}

export interface ClienteVIPDTO {
  idPessoa: number;
  clienteNome: string;
  clienteEmail: string;
  tipoPessoa: string;
  ranking: number;
  totalGasto: number;
  dataUltimaCompra: string;
  totalCompras: number;
  ticketMedio: number;
  mediaGastoGeral: number;
  diferencaMedia: number;
  percentualAcimaMedia: number;
}

class ReportService {
  private static instance: ReportService;

  public static getInstance(): ReportService {
    if (!ReportService.instance) {
      ReportService.instance = new ReportService();
    }
    return ReportService.instance;
  }

  /**
   * Feature #6: Produtos que nunca foram vendidos (ANTI JOIN)
   * Endpoint: GET /api/relatorios/produtos-nunca-vendidos
   */
  async getProdutosNuncaVendidos(limit: number = 10): Promise<ProdutoNuncaVendidoDTO[]> {
    return await apiRequest<ProdutoNuncaVendidoDTO[]>(
      `/relatorios/produtos-nunca-vendidos?limit=${limit}`
    );
  }

  /**
   * Feature #6: Produtos com preço acima da média da categoria (SUBCONSULTA)
   * Endpoint: GET /api/relatorios/produtos-acima-media
   */
  async getProdutosAcimaMedia(limit: number = 10): Promise<ProdutoAcimaMediaDTO[]> {
    return await apiRequest<ProdutoAcimaMediaDTO[]>(
      `/relatorios/produtos-acima-media?limit=${limit}`
    );
  }

  /**
   * Feature #6: Clientes VIP do mês (SUBCONSULTA)
   * Endpoint: GET /api/relatorios/clientes-vip
   */
  async getClientesVIP(limit: number = 10): Promise<ClienteVIPDTO[]> {
    return await apiRequest<ClienteVIPDTO[]>(
      `/relatorios/clientes-vip?limit=${limit}`
    );
  }
}

export const reportService = ReportService.getInstance();
