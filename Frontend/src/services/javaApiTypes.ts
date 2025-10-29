// Tipos específicos para a API Java do backend
export interface ProductJavaAPI {
  id_produto: number;
  nome: string;
  marca: string;
  descricao: string;
  preco_custo: number;
  preco_venda: number;
  estoque: number;
  estoque_minimo: number;
  estoque_maximo?: number;
  status: 'ATIVO' | 'INATIVO';
  
  // Mudança de "categoria" para "category"
  category?: {
    id: number;      // Mudança de "id_categoria" para "id"
    nome: string;
  };
  
  codigo_barras?: string;
  unidade?: string;
  peso?: number;
  data_validade?: string;
  data_criacao?: string;
  data_atualizacao?: string;
}

export interface CreateProductJavaRequest {
  nome: string;
  marca: string;
  descricao?: string;
  preco_custo: number;
  preco_venda: number;
  estoque: number;
  estoque_minimo: number;
  categoria_id: number;
  codigo_barras?: string;
  unidade?: string;
  peso?: number;
}

export interface UpdateProductJavaRequest {
  nome?: string;
  marca?: string;
  descricao?: string;
  preco_custo?: number;
  preco_venda?: number;
  estoque?: number;
  estoque_minimo?: number;
  categoria_id?: number;
  codigo_barras?: string;
  unidade?: string;
  peso?: number;
  status?: 'ATIVO' | 'INATIVO';
}

export interface CategoryJavaAPI {
  id_categoria?: number;
  nome: string;
  descricao?: string;
  status: 'ATIVA' | 'INATIVA';
  data_criacao?: string;
  data_atualizacao?: string;
}

export interface CreateCategoryJavaRequest {
  nome: string;
  descricao?: string;
  ativo?: boolean;
}

export interface UpdateCategoryJavaRequest {
  nome?: string;
  descricao?: string;
  ativo?: boolean;
}

export interface PaginatedJavaResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// Adaptadores para converter entre tipos
export const adaptProductFromJava = (javaProduct: ProductJavaAPI): ProductAPI => {
  // Verificação de segurança para casos onde javaProduct pode ser null/undefined
  if (!javaProduct) {
    console.warn('adaptProductFromJava: javaProduct é null ou undefined');
    return {
      id_produto: 0,
      nome: '',
      marca: '',
      descricao: '',
      preco_custo: 0,
      preco_venda: 0,
      estoque: 0,
      estoque_minimo: 0,
      estoque_maximo: 0,
      status: 'ATIVO',
      category: { id: 0, nome: '' },
      codigo_barras: '',
      unidade: '',
      peso: 0,
      data_validade: '',
      data_criacao: new Date().toISOString(),
      data_atualizacao: new Date().toISOString(),
    };
  }
  
  return {
    id_produto: javaProduct.id_produto,
    nome: javaProduct.nome || '',
    marca: javaProduct.marca || '',
    descricao: javaProduct.descricao || '',
    preco_custo: javaProduct.preco_custo || 0,
    preco_venda: javaProduct.preco_venda || 0,
    estoque: javaProduct.estoque || 0,
    estoque_minimo: javaProduct.estoque_minimo || 0,
    estoque_maximo: javaProduct.estoque_maximo,
    status: javaProduct.status || 'ATIVO',
    category: {
      id: javaProduct.category?.id || 0,
      nome: javaProduct.category?.nome || '',
    },
    codigo_barras: javaProduct.codigo_barras,
    unidade: javaProduct.unidade,
    peso: javaProduct.peso,
    data_validade: javaProduct.data_validade,
    data_criacao: javaProduct.data_criacao,
    data_atualizacao: javaProduct.data_atualizacao,
  };
};

export const adaptProductToJava = (product: any): any => ({
  nome: product.nome,
  marca: product.marca,
  descricao: product.descricao,
  preco_custo: product.preco_custo,
  valor_unitario: product.preco_venda, // Backend espera valor_unitario
  quant_em_estoque: product.estoque, // Backend espera quant_em_estoque
  estoque_minimo: product.estoque_minimo,
  id_categoria: parseInt(product.categoria_id || product.categoryId),
  codigo_barras: product.codigo_barras,
  unidade: product.unidade,
  peso: product.peso,
});

// Tipo usado na UI (mantém compatibilidade com o código existente)
export interface ProductAPI {
  id_produto: number;
  nome: string;
  marca: string;
  descricao: string;
  preco_custo: number;
  preco_venda: number;
  estoque: number;
  estoque_minimo: number;
  estoque_maximo?: number;
  status: 'ATIVO' | 'INATIVO';
  category: { id: number; nome: string; };
  codigo_barras?: string;
  unidade?: string;
  peso?: number;
  data_validade?: string;
  data_criacao?: string;
  data_atualizacao?: string;
}

// Adaptadores para converter categorias entre tipos
export const adaptCategoryFromJava = (javaCategory: CategoryJavaAPI) => {
  // Verificação de segurança para casos onde javaCategory pode ser null/undefined
  if (!javaCategory) {
    console.warn('adaptCategoryFromJava: javaCategory é null ou undefined');
    return {
      id: '',
      name: '',
      description: '',
      active: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
  
  return {
    id: javaCategory.id_categoria ? javaCategory.id_categoria.toString() : '',
    name: javaCategory.nome || '',
    description: javaCategory.descricao || '',
    active: javaCategory.status === 'ATIVA',
    createdAt: javaCategory.data_criacao || new Date().toISOString(),
    updatedAt: javaCategory.data_atualizacao || new Date().toISOString(),
  };
};

export const adaptCategoryToJava = (category: any): CreateCategoryJavaRequest => ({
  nome: category.name || category.nome,
  descricao: category.description || category.descricao,
  ativo: category.active !== undefined ? category.active : category.ativo !== undefined ? category.ativo : true,
});

// Tipo usado na UI para categorias (mantém compatibilidade)
export interface CategoryAPI {
  id: string;
  name: string;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

import { PaginatedResponse } from './types';

export interface BackendClienteDTO {
  id: number;
  nome: string;
  email: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  cep: string;
  telefone: string;
  tipoCliente: 'PF' | 'PJ';
  ativo: boolean;
  ranking: number;
  totalGasto: number;
  cpf?: string;
  dataNascimento?: string; // O backend envia LocalDate, que o JSON converte para string
  cnpj?: string;
  razaoSocial?: string;
  inscricaoEstadual?: string;
}

export type PaginatedClienteResponse = PaginatedResponse<BackendClienteDTO>;