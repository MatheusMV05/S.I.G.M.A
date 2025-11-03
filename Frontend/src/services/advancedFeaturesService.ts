import { apiRequest } from './api';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface ProdutoNuncaVendido {
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

export interface ProdutoFornecedor {
  idProduto: number | null;
  produtoNome: string | null;
  precoVenda: number | null;
  estoque: number | null;
  idFornecedor: number | null;
  fornecedorNome: string | null;
  fornecedorTelefone: string | null;
  fornecedorStatus: string | null;
  statusVinculo: string;
}

export interface ProdutoAcimaMedia {
  idProduto: number;
  produtoNome: string;
  marca: string;
  precoVenda: number;
  precoCusto: number;
  margemLucro: number;
  categoriaNome: string;
  precoMedioCategoria: number;
  diferencaMedia: number;
  percentualAcimaMedia: number;
}

export interface ClienteVIP {
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

export interface RelatorioVenda {
  vendaId: number;
  dataVenda: string;
  clienteNome: string;
  funcionarioNome: string;
  produtoNome: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
  valorTotal: number;
}

export interface EstoqueCompleto {
  produtoId: number;
  produtoNome: string;
  categoriaNome: string;
  quantidadeEstoque: number;
  precoVenda: number;
  fornecedorNome: string;
  fornecedorTelefone: string;
}

export interface CalculoDesconto {
  precoOriginal: number;
  descontoAplicado: number;
  precoFinal: number;
}

export interface AtualizacaoPrecoResult {
  mensagem: string;
  produtosAtualizados: number;
}

export interface EstoqueBaixo {
  produtoId: number;
  nome: string;
  quantidadeEstoque: number;
  estoqueMinimo: number;
  diferenca: number;
}

export interface LogAuditoria {
  logId: number;
  tabelaAfetada: string;
  operacao: string;
  registroId: number;
  usuarioId: number;
  dataHora: string;
  descricao: string;
}

export interface FiltroLogsAuditoria {
  tabela?: string;
  operacao?: string;
  registroId?: number;
  usuarioId?: number;
  dataInicio?: string;
  dataFim?: string;
  limit?: number;
  offset?: number;
}

// ============================================
// ADVANCED QUERIES SERVICE
// ============================================

export const advancedQueriesService = {
  // ANTI JOIN - Produtos nunca vendidos
  getProdutosNuncaVendidos: async (): Promise<ProdutoNuncaVendido[]> => {
    return await apiRequest<ProdutoNuncaVendido[]>('/advanced-queries/produtos-nunca-vendidos');
  },

  // FULL OUTER JOIN - Produtos e Fornecedores
  getProdutosEFornecedores: async (): Promise<ProdutoFornecedor[]> => {
    return await apiRequest<ProdutoFornecedor[]>('/advanced-queries/produtos-fornecedores');
  },

  // SUBCONSULTA 1 - Produtos acima da média de preço
  getProdutosAcimaDaMedia: async (): Promise<ProdutoAcimaMedia[]> => {
    return await apiRequest<ProdutoAcimaMedia[]>('/advanced-queries/produtos-acima-media');
  },

  // SUBCONSULTA 2 - Clientes VIP (gastaram acima da média)
  getClientesVIP: async (): Promise<ClienteVIP[]> => {
    return await apiRequest<ClienteVIP[]>('/advanced-queries/clientes-vip');
  },

  // VIEW 1 - Relatório de Vendas
  getRelatorioVendas: async (): Promise<RelatorioVenda[]> => {
    return await apiRequest<RelatorioVenda[]>('/advanced-queries/relatorio-vendas');
  },

  // VIEW 2 - Estoque Completo
  getEstoqueCompleto: async (): Promise<EstoqueCompleto[]> => {
    return await apiRequest<EstoqueCompleto[]>('/advanced-queries/estoque-completo');
  },
};

// ============================================
// DATABASE FEATURES SERVICE
// ============================================

export const databaseFeaturesService = {
  // FUNÇÃO 1 - Calcular desconto
  calcularDesconto: async (preco: number): Promise<CalculoDesconto> => {
    return await apiRequest<CalculoDesconto>(`/database-features/calcular-desconto/${preco}`);
  },

  // FUNÇÃO 2 - Verificar estoque disponível
  verificarEstoque: async (produtoId: number, quantidade: number): Promise<boolean> => {
    return await apiRequest<boolean>(
      `/database-features/verificar-estoque/${produtoId}/${quantidade}`
    );
  },

  // PROCEDIMENTO 1 - Atualizar preços por categoria
  atualizarPrecos: async (
    categoriaId: number,
    percentualAumento: number
  ): Promise<AtualizacaoPrecoResult> => {
    return await apiRequest<AtualizacaoPrecoResult>(
      `/database-features/atualizar-precos?categoriaId=${categoriaId}&percentualAumento=${percentualAumento}`,
      { method: 'POST' }
    );
  },

  // PROCEDIMENTO 2 - Relatório de estoque baixo
  getRelatorioEstoqueBaixo: async (): Promise<EstoqueBaixo[]> => {
    return await apiRequest<EstoqueBaixo[]>('/database-features/relatorio-estoque-baixo');
  },

  // LOGS DE AUDITORIA - Listar todos
  getLogsAuditoria: async (): Promise<LogAuditoria[]> => {
    return await apiRequest<LogAuditoria[]>('/database-features/logs');
  },

  // LOGS DE AUDITORIA - Com filtros
  getLogsComFiltros: async (filtros: FiltroLogsAuditoria): Promise<LogAuditoria[]> => {
    const queryParams = new URLSearchParams();
    if (filtros.tabela) queryParams.append('tabela', filtros.tabela);
    if (filtros.operacao) queryParams.append('operacao', filtros.operacao);
    if (filtros.registroId) queryParams.append('registroId', filtros.registroId.toString());
    if (filtros.usuarioId) queryParams.append('usuarioId', filtros.usuarioId.toString());
    if (filtros.dataInicio) queryParams.append('dataInicio', filtros.dataInicio);
    if (filtros.dataFim) queryParams.append('dataFim', filtros.dataFim);
    if (filtros.limit) queryParams.append('limit', filtros.limit.toString());
    if (filtros.offset) queryParams.append('offset', filtros.offset.toString());
    
    return await apiRequest<LogAuditoria[]>(
      `/database-features/logs/filtros?${queryParams.toString()}`
    );
  },

  // LOGS DE AUDITORIA - Logs recentes
  getLogsRecentes: async (limit: number = 50): Promise<LogAuditoria[]> => {
    return await apiRequest<LogAuditoria[]>(`/database-features/logs/recentes/${limit}`);
  },

  // LOGS DE AUDITORIA - Por tabela
  getLogsPorTabela: async (tabela: string): Promise<LogAuditoria[]> => {
    return await apiRequest<LogAuditoria[]>(`/database-features/logs/tabela/${tabela}`);
  },

  // LOGS DE AUDITORIA - Por registro
  getLogsPorRegistro: async (
    tabela: string,
    registroId: number
  ): Promise<LogAuditoria[]> => {
    return await apiRequest<LogAuditoria[]>(
      `/database-features/logs/registro/${tabela}/${registroId}`
    );
  },

  // LOGS DE AUDITORIA - Contar total
  contarLogs: async (): Promise<number> => {
    return await apiRequest<number>('/database-features/logs/count');
  },

  // LOGS DE AUDITORIA - Deletar logs antigos
  deletarLogsAntigos: async (diasAtras: number): Promise<number> => {
    return await apiRequest<number>(`/database-features/logs/antigos/${diasAtras}`, {
      method: 'DELETE',
    });
  },
};

export default {
  advancedQueriesService,
  databaseFeaturesService,
};
