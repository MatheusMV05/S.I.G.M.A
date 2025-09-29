import React, { useState } from 'react';
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
  Search, Plus, Edit, Trash2, AlertTriangle,
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { toast } from 'sonner';

// --- CORREÇÃO IMPORTANTE ---
// 1. O tipo 'Product' foi atualizado para usar os nomes de campo em português
//    exatamente como eles vêm da sua API Java.
type Product = {
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
};

// PÁGINA PRINCIPAL DE PRODUTOS
export default function Products() {
  // Estados de controle da UI (sem alterações)
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Hooks do React Query para buscar dados (sem alterações)
  const {
    data: productsPage,
    isLoading: isLoadingProducts,
    error: productsError,
  } = useProducts({
    page,
    size: 10,
    search: searchTerm || undefined,
    categoryId: selectedCategory !== 'all' ? Number(selectedCategory) : undefined,
    // Adapte o status se necessário, baseado no que o backend espera
    // status: selectedStatus !== 'all' ? selectedStatus.toUpperCase() : undefined,
  });
  
  const { data: categoriesData } = useCategories({ active: true });
  
  const products = productsPage?.content ?? [];
  const categories = categoriesData?.content ?? [];

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-2xl font-bold">Gestão de Produtos</CardTitle>
                <p className="text-muted-foreground">Adicione, edite e gerencie todos os seus produtos.</p>
            </div>
            <Button>
                <Plus className="mr-2 h-4 w-4" /> Novo Produto
            </Button>
        </div>
      </CardHeader>

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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-center">Estoque</TableHead>
                <TableHead className="text-right">Preço de Venda</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingProducts ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={6}><Skeleton className="h-10 w-full" /></TableCell>
                  </TableRow>
                ))
              ) : productsError ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Erro ao carregar</AlertTitle>
                      <AlertDescription>Não foi possível buscar os produtos. Verifique o backend.</AlertDescription>
                    </Alert>
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">Nenhum produto encontrado.</TableCell>
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
                    </TableCell>
                    <TableCell>{product.category?.nome || 'N/A'}</TableCell>
                    <TableCell className="text-center">
                        <Badge variant={product.estoque <= product.estoque_minimo ? 'warning' : 'secondary'}>
                            {product.estoque}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(product.preco_venda)}</TableCell>
                    <TableCell className="text-center">
                        <Badge variant={product.status === 'ATIVO' ? 'success' : 'secondary'}>
                            {product.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Paginação (sem alterações) */}
      {productsPage && productsPage.totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={productsPage.first}>Anterior</Button>
          <span className="text-sm text-muted-foreground">Página {productsPage.number + 1} de {productsPage.totalPages}</span>
          <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={productsPage.last}>Próximo</Button>
        </div>
      )}
    </div>
  );
}