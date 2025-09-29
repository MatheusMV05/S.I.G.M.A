import React, { useState, useMemo } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Search, Plus, Edit, Trash2, AlertTriangle, Eye, Calendar, Package, DollarSign, Grid3X3, List, Download,
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { ProductModal } from '@/components/ProductModal';
import { DeleteProductModal } from '@/components/DeleteProductModal';
import { toast } from 'sonner';

// --- CORREÇÃO IMPORTANTE ---
// 1. O tipo 'Product' foi atualizado para usar os nomes de campo em português
//    exatamente como eles vêm da sua API Java.
type ProductAPI = {
  id_produto: number;
  nome: string;
  marca: string;
  descricao: string;
  preco_custo: number;
  preco_venda: number;
  estoque: number;
  estoque_minimo: number;
  status: 'ATIVO' | 'INATIVO';
  category: { id: number; nome: string; }; // A categoria aninhada
  codigo_barras?: string;
  unidade?: string;
  peso?: number;
  data_criacao?: string;
  data_atualizacao?: string;
  imagens?: string[];
};

// PÁGINA PRINCIPAL DE PRODUTOS
export default function Products() {
  // Estados de controle da UI (sem alterações)
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<ProductAPI | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  
  // Estados dos modais
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [productToEdit, setProductToEdit] = useState<ProductAPI | null>(null);
  const [productToDelete, setProductToDelete] = useState<ProductAPI | null>(null);

  // Hooks do React Query para buscar dados (sem alterações)
  const {
    data: productsPage,
    isLoading: isLoadingProducts,
    error: productsError,
  } = useProducts({
    page,
    size: 10,
    search: searchTerm || undefined,
    categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
    // Adapte o status se necessário, baseado no que o backend espera
    // status: selectedStatus !== 'all' ? selectedStatus.toUpperCase() : undefined,
  });
  
  const { data: categoriesData } = useCategories({ active: true });
  
  const products = (productsPage?.content ?? []) as unknown as ProductAPI[];
  const categories = (categoriesData?.content ?? []) as unknown as Array<{ id: number; nome: string }>;

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  // Funções para controle dos modais
  const handleCreateProduct = () => {
    setModalMode('create');
    setProductToEdit(null);
    setProductModalOpen(true);
  };

  const handleEditProduct = (product: ProductAPI) => {
    setModalMode('edit');
    setProductToEdit(product);
    setProductModalOpen(true);
  };

  const handleDeleteProduct = (product: ProductAPI) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  // Calcular estatísticas dos produtos
  const productStats = useMemo(() => {
    if (!products.length) return null;
    
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.status === 'ATIVO').length;
    const lowStockProducts = products.filter(p => p.estoque <= p.estoque_minimo).length;
    const totalStockValue = products.reduce((sum, p) => sum + (p.estoque * p.preco_custo), 0);
    
    return {
      totalProducts,
      activeProducts,
      lowStockProducts,
      totalStockValue
    };
  }, [products]);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-2xl font-bold">Gestão de Produtos</CardTitle>
                <p className="text-muted-foreground">Adicione, edite e gerencie todos os seus produtos.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => {
                const csvContent = [
                  ['ID', 'Nome', 'Marca', 'Categoria', 'Descrição', 'Preço Custo', 'Preço Venda', 'Estoque', 'Estoque Mínimo', 'Status'],
                  ...products.map(product => [
                    product.id_produto,
                    product.nome,
                    product.marca || '',
                    product.category?.nome || '',
                    product.descricao || '',
                    product.preco_custo,
                    product.preco_venda,
                    product.estoque,
                    product.estoque_minimo,
                    product.status
                  ])
                ].map(row => row.join(',')).join('\n');
                
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', `produtos_${new Date().toISOString().split('T')[0]}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                toast.success('Produtos exportados com sucesso!');
              }}>
                <Download className="mr-2 h-4 w-4" /> Exportar CSV
              </Button>
              <Button onClick={handleCreateProduct}>
                <Plus className="mr-2 h-4 w-4" /> Novo Produto
              </Button>
            </div>
        </div>
      </CardHeader>

      {/* Cards de Estatísticas */}
      {productStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Package className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{productStats.totalProducts}</p>
                  <p className="text-sm text-muted-foreground">Total de Produtos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Badge className="h-8 w-8 rounded-full flex items-center justify-center bg-green-500 hover:bg-green-500">
                  ✓
                </Badge>
                <div>
                  <p className="text-2xl font-bold text-green-600">{productStats.activeProducts}</p>
                  <p className="text-sm text-muted-foreground">Produtos Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold text-red-600">{productStats.lowStockProducts}</p>
                  <p className="text-sm text-muted-foreground">Estoque Baixo</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(productStats.totalStockValue)}</p>
                  <p className="text-sm text-muted-foreground">Valor do Estoque</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou marca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Categorias</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>{cat.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="ATIVO">Ativo</SelectItem>
                <SelectItem value="INATIVO">Inativo</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex border rounded-md">
              <Button 
                variant={viewMode === 'table' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setViewMode('table')}
                className="rounded-r-none"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'cards' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setViewMode('cards')}
                className="rounded-l-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {viewMode === 'table' ? (
        <Card>
          <CardContent className="p-0">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">Preço Custo</TableHead>
                <TableHead className="text-right">Preço Venda</TableHead>
                <TableHead className="text-center">Estoque</TableHead>
                <TableHead className="text-center">Est. Mín.</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingProducts ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={9}><Skeleton className="h-10 w-full" /></TableCell>
                  </TableRow>
                ))
              ) : productsError ? (
                <TableRow>
                  <TableCell colSpan={9}>
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Erro ao carregar</AlertTitle>
                      <AlertDescription>Não foi possível buscar os produtos. Verifique o backend.</AlertDescription>
                    </Alert>
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center h-24">Nenhum produto encontrado.</TableCell>
                </TableRow>
              ) : (
                // --- CORREÇÃO IMPORTANTE ---
                // 2. Todas as referências como product.name foram trocadas para product.nome,
                //    product.brand para product.marca, e assim por diante.
                products.map((product) => (
                  <TableRow key={product.id_produto}>
                    <TableCell>
                      <div className="font-medium">{product.nome}</div>
                      <div className="text-sm text-muted-foreground">{product.marca}</div>
                      {product.codigo_barras && (
                        <div className="text-xs text-muted-foreground">Cód: {product.codigo_barras}</div>
                      )}
                    </TableCell>
                    <TableCell>{product.category?.nome || 'N/A'}</TableCell>
                    <TableCell className="max-w-[200px]">
                      <div className="truncate text-sm">{product.descricao || 'N/A'}</div>
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(product.preco_custo)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(product.preco_venda)}</TableCell>
                    <TableCell className="text-center">
                        <Badge variant={product.estoque <= product.estoque_minimo ? 'destructive' : 'secondary'}>
                            {product.estoque}
                            {product.unidade && ` ${product.unidade}`}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                        <Badge variant="outline">
                            {product.estoque_minimo}
                            {product.unidade && ` ${product.unidade}`}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                        <Badge variant={product.status === 'ATIVO' ? 'default' : 'secondary'}>
                            {product.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedProduct(product)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteProduct(product)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        /* Visualização em Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoadingProducts ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2 mb-4" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))
          ) : productsError ? (
            <div className="col-span-full">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Erro ao carregar</AlertTitle>
                <AlertDescription>Não foi possível buscar os produtos. Verifique o backend.</AlertDescription>
              </Alert>
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">Nenhum produto encontrado.</p>
            </div>
          ) : (
            products.map((product) => (
              <Card key={product.id_produto} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Header do Card */}
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{product.nome}</h3>
                        <p className="text-sm text-muted-foreground truncate">{product.marca}</p>
                      </div>
                      <Badge variant={product.status === 'ATIVO' ? 'default' : 'secondary'} className="ml-2">
                        {product.status}
                      </Badge>
                    </div>

                    {/* Categoria e Descrição */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Package className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{product.category?.nome || 'N/A'}</span>
                      </div>
                      {product.descricao && (
                        <p className="text-xs text-muted-foreground line-clamp-2">{product.descricao}</p>
                      )}
                    </div>

                    {/* Preços */}
                    <div className="grid grid-cols-2 gap-2 py-2 border-y">
                      <div>
                        <p className="text-xs text-muted-foreground">Custo</p>
                        <p className="font-medium text-sm">{formatCurrency(product.preco_custo)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Venda</p>
                        <p className="font-medium text-sm text-green-600">{formatCurrency(product.preco_venda)}</p>
                      </div>
                    </div>

                    {/* Estoque */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Estoque:</span>
                        <Badge variant={product.estoque <= product.estoque_minimo ? 'destructive' : 'secondary'}>
                          {product.estoque}{product.unidade && ` ${product.unidade}`}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Mín: {product.estoque_minimo}
                      </div>
                    </div>

                    {/* Código de Barras */}
                    {product.codigo_barras && (
                      <div className="text-xs text-muted-foreground font-mono">
                        {product.codigo_barras}
                      </div>
                    )}

                    {/* Ações */}
                    <div className="flex justify-between items-center pt-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedProduct(product)}>
                        <Eye className="h-3 w-3 mr-1" />
                        Detalhes
                      </Button>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteProduct(product)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
      
      {/* Paginação (sem alterações) */}
      {productsPage && productsPage.totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={productsPage.first}>Anterior</Button>
          <span className="text-sm text-muted-foreground">Página {productsPage.number + 1} de {productsPage.totalPages}</span>
          <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={productsPage.last}>Próximo</Button>
        </div>
      )}

      {/* Modal de Detalhes do Produto */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Detalhes do Produto
            </DialogTitle>
            <DialogDescription>
              Todas as informações detalhadas do produto selecionado.
            </DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="grid gap-6">
              {/* Informações Básicas */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações Gerais</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">ID do Produto</label>
                    <p className="text-sm font-mono">{selectedProduct.id_produto}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Nome</label>
                    <p className="font-medium">{selectedProduct.nome}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Marca</label>
                    <p>{selectedProduct.marca || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Categoria</label>
                    <p>{selectedProduct.category?.nome || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Descrição</label>
                    <p className="text-sm">{selectedProduct.descricao || 'N/A'}</p>
                  </div>
                  {selectedProduct.codigo_barras && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Código de Barras</label>
                      <p className="font-mono text-sm">{selectedProduct.codigo_barras}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <Badge variant={selectedProduct.status === 'ATIVO' ? 'default' : 'secondary'}>
                      {selectedProduct.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Informações Financeiras */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Preços e Valores
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Preço de Custo</label>
                    <p className="font-medium text-lg">{formatCurrency(selectedProduct.preco_custo)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Preço de Venda</label>
                    <p className="font-medium text-lg text-green-600">{formatCurrency(selectedProduct.preco_venda)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Margem de Lucro</label>
                    <p className="font-medium">
                      {selectedProduct.preco_custo > 0 
                        ? `${(((selectedProduct.preco_venda - selectedProduct.preco_custo) / selectedProduct.preco_custo) * 100).toFixed(1)}%`
                        : 'N/A'
                      }
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Lucro por Unidade</label>
                    <p className="font-medium text-green-600">
                      {formatCurrency(selectedProduct.preco_venda - selectedProduct.preco_custo)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Informações de Estoque */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Controle de Estoque
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Estoque Atual</label>
                    <p className="font-medium text-lg">
                      {selectedProduct.estoque}
                      {selectedProduct.unidade && ` ${selectedProduct.unidade}`}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Estoque Mínimo</label>
                    <p className="font-medium">
                      {selectedProduct.estoque_minimo}
                      {selectedProduct.unidade && ` ${selectedProduct.unidade}`}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Situação</label>
                    <Badge variant={selectedProduct.estoque <= selectedProduct.estoque_minimo ? 'destructive' : 'default'}>
                      {selectedProduct.estoque <= selectedProduct.estoque_minimo ? 'Estoque Baixo' : 'Normal'}
                    </Badge>
                  </div>
                  {selectedProduct.peso && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Peso</label>
                      <p>{selectedProduct.peso} kg</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Valor Total do Estoque</label>
                    <p className="font-medium text-blue-600">
                      {formatCurrency(selectedProduct.estoque * selectedProduct.preco_custo)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Valor de Venda Total</label>
                    <p className="font-medium text-green-600">
                      {formatCurrency(selectedProduct.estoque * selectedProduct.preco_venda)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Informações de Data (se disponíveis) */}
              {(selectedProduct.data_criacao || selectedProduct.data_atualizacao) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Histórico
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    {selectedProduct.data_criacao && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Data de Criação</label>
                        <p>{new Date(selectedProduct.data_criacao).toLocaleDateString('pt-BR')}</p>
                      </div>
                    )}
                    {selectedProduct.data_atualizacao && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Última Atualização</label>
                        <p>{new Date(selectedProduct.data_atualizacao).toLocaleDateString('pt-BR')}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Imagens (se disponíveis) */}
              {selectedProduct.imagens && selectedProduct.imagens.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Imagens do Produto</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedProduct.imagens.map((imagem, index) => (
                        <img 
                          key={index}
                          src={imagem} 
                          alt={`${selectedProduct.nome} - ${index + 1}`}
                          className="w-full h-20 object-cover rounded border"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Adicionar/Editar Produto */}
      <ProductModal
        open={productModalOpen}
        onOpenChange={setProductModalOpen}
        product={productToEdit}
        mode={modalMode}
      />

      {/* Modal de Confirmação de Exclusão */}
      <DeleteProductModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        product={productToDelete}
      />
    </div>
  );
}