import { apiRequest } from './api';

/**
 * Tipos para a VIEW vw_inventario_rentabilidade
 */
export interface InventarioRentabilidadeDTO {
  // Dados do Produto
  idProduto: number;
  produtoNome: string;
  marca: string;
  descricao: string;
  codigoBarras: string;
  codigoInterno: string;
  statusProduto: string;
  
  // Preços e Margens
  precoCusto: number;
  precoVenda: number;
  margemLucroPercentual: number;
  lucroUnitario: number;
  
  // Estoque
  estoque: number;
  estoqueMinimo: number;
  estoqueMaximo: number;
  unidadeMedida: string;
  localizacaoPrateleira: string;
  
  // Valores Totais
  valorEstoqueCusto: number;
  valorEstoqueVenda: number;
  lucroPotencialEstoque: number;
  
  // Categoria
  idCategoria: number;
  categoriaNome: string;
  categoriaDescricao: string;
  statusCategoria: string;
  
  // Fornecedor
  idFornecedor: number;
  fornecedorNome: string;
  fornecedorRazaoSocial: string;
  fornecedorCnpj: string;
  fornecedorTelefone: string;
  fornecedorEmail: string;
  fornecedorCidade: string;
  fornecedorEstado: string;
  prazoEntregaDias: number;
  avaliacaoFornecedor: number;
  statusFornecedor: string;
  
  // Status e Análises
  statusEstoque: string;
  acaoRecomendada: string;
  classificacaoRentabilidade: string;
  dataCadastro: string;
  diasDesdeCadastro: number;
}

/**
 * Service para acessar dados da VIEW vw_inventario_rentabilidade
 */
class InventarioRentabilidadeService {
  private static instance: InventarioRentabilidadeService;
  
  public static getInstance(): InventarioRentabilidadeService {
    if (!InventarioRentabilidadeService.instance) {
      InventarioRentabilidadeService.instance = new InventarioRentabilidadeService();
    }
    return InventarioRentabilidadeService.instance;
  }

  /**
   * Busca análise completa de inventário com rentabilidade
   */
  async getInventarioCompleto(): Promise<InventarioRentabilidadeDTO[]> {
    return await apiRequest<InventarioRentabilidadeDTO[]>('/products/inventario-rentabilidade');
  }

  /**
   * Busca produtos com alta rentabilidade (margem >= 50%)
   */
  async getAltaRentabilidade(): Promise<InventarioRentabilidadeDTO[]> {
    return await apiRequest<InventarioRentabilidadeDTO[]>('/products/alta-rentabilidade');
  }

  /**
   * Busca produtos com rentabilidade crítica (margem < 15%)
   */
  async getRentabilidadeCritica(): Promise<InventarioRentabilidadeDTO[]> {
    return await apiRequest<InventarioRentabilidadeDTO[]>('/products/rentabilidade-critica');
  }

  /**
   * Busca inventário por categoria com análise de rentabilidade
   */
  async getInventarioPorCategoria(categoriaId: number): Promise<InventarioRentabilidadeDTO[]> {
    return await apiRequest<InventarioRentabilidadeDTO[]>(`/products/inventario-rentabilidade/categoria/${categoriaId}`);
  }

  /**
   * Busca inventário por fornecedor com análise de rentabilidade
   */
  async getInventarioPorFornecedor(fornecedorId: number): Promise<InventarioRentabilidadeDTO[]> {
    return await apiRequest<InventarioRentabilidadeDTO[]>(`/products/inventario-rentabilidade/fornecedor/${fornecedorId}`);
  }
}

export const inventarioRentabilidadeService = InventarioRentabilidadeService.getInstance();
