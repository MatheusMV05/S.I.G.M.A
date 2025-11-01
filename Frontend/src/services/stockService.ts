import { apiRequest } from './api';

export interface StockMovement {
  id_movimentacao: number;
  id_produto: number;
  produto?: {
    nome: string;
    codigo_barras?: string;
  };
  id_usuario: number | null;
  usuario?: {
    nome: string;
  };
  data_movimentacao: string;
  tipo: 'IN' | 'OUT' | 'ADJUSTMENT' | 'LOSS' | 'RETURN' | 'SALE';
  quantidade: number;
  estoque_anterior: number;
  estoque_atual: number;
  observacao: string | null;
}

export interface CreateStockMovementRequest {
  productId: number;
  type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'LOSS' | 'RETURN' | 'SALE';
  quantity: number;
  reason?: string;
}

export interface ProdutoCritico {
  idProduto: number;
  nomeProduto: string;
  categoria: string;
  estoqueAtual: number;
  estoqueMinimo: number;
  deficit: number;
  fornecedor: string;
  telefoneFornecedor: string;
}

export interface ResumoProdutosCriticos {
  totalProdutosCriticos: number;
  criticos: number;
  urgentes: number;
  atencao: number;
  valorTotalReposicao: number;
  dataHoraRelatorio: string;
}

export interface RelatorioProdutosCriticos {
  produtos: ProdutoCritico[];
  resumo: ResumoProdutosCriticos | null;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  first: boolean;
  last: boolean;
}

class StockService {
  private static instance: StockService;
  
  public static getInstance(): StockService {
    if (!StockService.instance) {
      StockService.instance = new StockService();
    }
    return StockService.instance;
  }

  /**
   * Busca movimentações de estoque com paginação e filtros
   */
  async getStockMovements(params?: {
    page?: number;
    size?: number;
    productId?: string;
    type?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<PaginatedResponse<StockMovement>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page !== undefined) queryParams.set('page', params.page.toString());
    if (params?.size !== undefined) queryParams.set('size', params.size.toString());
    if (params?.productId) queryParams.set('productId', params.productId);
    if (params?.type) queryParams.set('type', params.type);
    if (params?.userId) queryParams.set('userId', params.userId);
    if (params?.startDate) queryParams.set('startDate', params.startDate);
    if (params?.endDate) queryParams.set('endDate', params.endDate);

    const queryString = queryParams.toString();
    const endpoint = `/movimentacao${queryString ? `?${queryString}` : ''}`;

    return await apiRequest<PaginatedResponse<StockMovement>>(endpoint);
  }

  /**
   * Busca movimentação por ID
   */
  async getStockMovementById(id: number): Promise<StockMovement> {
    return await apiRequest<StockMovement>(`/movimentacao/${id}`);
  }

  /**
   * Cria uma nova movimentação de estoque
   */
  async createStockMovement(movementData: CreateStockMovementRequest): Promise<StockMovement> {
    return await apiRequest<StockMovement>('/movimentacao', {
      method: 'POST',
      body: JSON.stringify({
        id_produto: movementData.productId,
        tipo: movementData.type,
        quantidade: movementData.quantity,
        observacao: movementData.reason || null
      }),
    });
  }

  /**
   * Busca movimentações de um produto específico
   */
  async getProductMovements(productId: number, params?: {
    page?: number;
    size?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<PaginatedResponse<StockMovement>> {
    return this.getStockMovements({
      ...params,
      productId: productId.toString()
    });
  }

  /**
   * Gera relatório de produtos críticos
   * Utiliza a procedure sp_relatorio_produtos_criticos
   */
  async getRelatorioProdutosCriticos(): Promise<RelatorioProdutosCriticos> {
    return await apiRequest<RelatorioProdutosCriticos>('/stock/produtos-criticos');
  }
}

export const stockService = StockService.getInstance();