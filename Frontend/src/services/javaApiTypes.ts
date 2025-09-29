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
  status: 'ATIVO' | 'INATIVO';
  categoria: {
    id_categoria: number;
    nome: string;
  };
  codigo_barras?: string;
  unidade?: string;
  peso?: number;
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
  id_categoria: number;
  nome: string;
  descricao?: string;
  ativo: boolean;
  data_criacao?: string;
  data_atualizacao?: string;
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
export const adaptProductFromJava = (javaProduct: ProductJavaAPI): ProductAPI => ({
  id_produto: javaProduct.id_produto,
  nome: javaProduct.nome,
  marca: javaProduct.marca,
  descricao: javaProduct.descricao,
  preco_custo: javaProduct.preco_custo,
  preco_venda: javaProduct.preco_venda,
  estoque: javaProduct.estoque,
  estoque_minimo: javaProduct.estoque_minimo,
  status: javaProduct.status,
  category: {
    id: javaProduct.categoria.id_categoria,
    nome: javaProduct.categoria.nome,
  },
  codigo_barras: javaProduct.codigo_barras,
  unidade: javaProduct.unidade,
  peso: javaProduct.peso,
  data_criacao: javaProduct.data_criacao,
  data_atualizacao: javaProduct.data_atualizacao,
});

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
  status: 'ATIVO' | 'INATIVO';
  category: { id: number; nome: string; };
  codigo_barras?: string;
  unidade?: string;
  peso?: number;
  data_criacao?: string;
  data_atualizacao?: string;
}