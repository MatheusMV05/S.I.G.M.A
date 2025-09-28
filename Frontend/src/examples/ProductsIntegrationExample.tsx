/**
 * Exemplo de como integrar as páginas existentes com as APIs reais
 * 
 * Este arquivo demonstra como substituir os dados mockados pelos dados reais das APIs
 * em componentes React utilizando os hooks customizados criados.
 */

import React, { useState } from 'react';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Plus, Edit, Trash2, Search } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ProductsIntegrationExample() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [page, setPage] = useState(0);

  // Usar hooks para buscar dados reais das APIs
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    error: productsError,
    refetch: refetchProducts
  } = useProducts({
    page,
    size: 20,
    search: searchTerm || undefined,
    categoryId: selectedCategory,
    active: true
  });

  const {
    data: categoriesData,
    isLoading: isLoadingCategories
  } = useCategories({ active: true });

  // Hooks para mutações
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  // Handlers para ações
  const handleCreateProduct = async (productData: any) => {
    try {
      await createProductMutation.mutateAsync(productData);
      // Sucesso - o React Query irá atualizar automaticamente a lista
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      // Tratar erro (mostrar toast, etc.)
    }
  };

  const handleUpdateProduct = async (id: string, productData: any) => {
    try {
      await updateProductMutation.mutateAsync({ id, data: productData });
      // Sucesso
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProductMutation.mutateAsync(id);
      // Sucesso
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
    }
  };

  // Renderizar loading state
  if (isLoadingProducts) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Renderizar error state
  if (productsError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erro ao carregar produtos: {productsError.message}
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-2"
            onClick={() => refetchProducts()}
          >
            Tentar novamente
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const products = productsData?.content || [];
  const categories = categoriesData?.content || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Produtos</h1>
          <p className="text-muted-foreground">
            {productsData?.totalElements || 0} produtos encontrados
          </p>
        </div>
        <Button onClick={() => {/* Abrir modal de criar produto */}}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <select 
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || undefined)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="">Todas as categorias</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de produtos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Produtos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    {product.name}
                    {product.brand && (
                      <div className="text-sm text-muted-foreground">
                        {product.brand}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{product.barcode}</TableCell>
                  <TableCell>
                    {product.category?.name || 'Sem categoria'}
                  </TableCell>
                  <TableCell>
                    R$ {product.price.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{product.stock}</span>
                      {product.stock <= product.minStock && (
                        <Badge variant="destructive" className="text-xs">
                          Baixo
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.active ? "default" : "secondary"}>
                      {product.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {/* Abrir modal de edição */}}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        disabled={deleteProductMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Paginação */}
          {productsData && productsData.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Página {productsData.number + 1} de {productsData.totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.min(productsData.totalPages - 1, page + 1))}
                  disabled={page >= productsData.totalPages - 1}
                >
                  Próximo
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * GUIA DE MIGRAÇÃO PARA PÁGINAS EXISTENTES:
 * 
 * 1. Substitua os dados mockados pelos hooks das APIs:
 *    - const mockProducts = [...] → const { data: products } = useProducts()
 * 
 * 2. Adicione estados de loading e error:
 *    - Renderize skeletons durante o loading
 *    - Mostre mensagens de erro quando necessário
 * 
 * 3. Use mutations para operações CRUD:
 *    - useCreateProduct(), useUpdateProduct(), useDeleteProduct()
 * 
 * 4. Implemente paginação real:
 *    - Use os parâmetros page e size dos hooks
 * 
 * 5. Adicione filtros funcionais:
 *    - Passe os parâmetros de filtro para os hooks
 * 
 * 6. Remova console.logs e simulações:
 *    - Substitua por calls reais das APIs
 * 
 * EXEMPLO DE MIGRAÇÃO STEP-BY-STEP:
 * 
 * ANTES:
 * const [products, setProducts] = useState(mockProducts);
 * 
 * DEPOIS:
 * const { data: productsData, isLoading, error } = useProducts({ 
 *   page: currentPage, 
 *   search: searchTerm 
 * });
 * const products = productsData?.content || [];
 */