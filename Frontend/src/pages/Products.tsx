import React, { useState } from 'react';
import { DesktopOnlyPage } from '@/components/DesktopOnlyPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  Download,
  Upload,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Barcode,
  Tag,
  DollarSign,
  Calendar,
  Building,
  Layers,
  Eye,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

// Mock data para produtos
const mockProducts = [
  {
    id: '7891234567890',
    name: 'Arroz Branco Tipo 1 5kg',
    brand: 'Tio João',
    category: 'Grãos e Cereais',
    costPrice: 12.50,
    salePrice: 18.90,
    stock: 45,
    minStock: 20,
    maxStock: 100,
    supplier: 'Distribuidora Alimentos Ltda',
    expiryDate: '2025-03-15',
    status: 'active',
    description: 'Arroz branco tipo 1, grãos longos, embalagem de 5kg',
    shelfLocation: 'A1-02',
    lastSold: '2024-12-20',
    totalSold: 156,
    revenue: 2946.40
  },
  {
    id: '7891234567891',
    name: 'Coca-Cola Original 2L',
    brand: 'Coca-Cola',
    category: 'Bebidas',
    costPrice: 4.20,
    salePrice: 7.50,
    stock: 28,
    minStock: 30,
    maxStock: 80,
    supplier: 'Distribuidora Bebidas Sul',
    expiryDate: '2025-06-10',
    status: 'active',
    description: 'Refrigerante cola sabor original, garrafa 2 litros',
    shelfLocation: 'B3-01',
    lastSold: '2024-12-20',
    totalSold: 289,
    revenue: 2167.50
  },
  {
    id: '7891234567892',
    name: 'Pão de Forma Integral 500g',
    brand: 'Wickbold',
    category: 'Padaria',
    costPrice: 3.80,
    salePrice: 6.90,
    stock: 8,
    minStock: 15,
    maxStock: 40,
    supplier: 'Panificadora Central',
    expiryDate: '2024-12-22',
    status: 'active',
    description: 'Pão de forma integral, 500g, rico em fibras',
    shelfLocation: 'C2-03',
    lastSold: '2024-12-20',
    totalSold: 78,
    revenue: 538.20
  },
  {
    id: '7891234567893',
    name: 'Leite Integral UHT 1L',
    brand: 'Parmalat',
    category: 'Laticínios',
    costPrice: 2.20,
    salePrice: 4.50,
    stock: 62,
    minStock: 25,
    maxStock: 100,
    supplier: 'Laticínios do Sul Ltda',
    expiryDate: '2025-01-30',
    status: 'active',
    description: 'Leite integral UHT, embalagem Tetra Pak 1 litro',
    shelfLocation: 'D1-01',
    lastSold: '2024-12-20',
    totalSold: 234,
    revenue: 1053.00
  },
  {
    id: '7891234567894',
    name: 'Detergente Líquido 500ml',
    brand: 'Ypê',
    category: 'Limpeza',
    costPrice: 1.80,
    salePrice: 3.20,
    stock: 0,
    minStock: 12,
    maxStock: 50,
    supplier: 'Distribuidora Limpeza Pro',
    expiryDate: '2026-08-15',
    status: 'inactive',
    description: 'Detergente líquido concentrado, fragrância limão',
    shelfLocation: 'E2-04',
    lastSold: '2024-12-18',
    totalSold: 145,
    revenue: 464.00
  }
];

const categories = [
  'Grãos e Cereais',
  'Bebidas',
  'Padaria',
  'Laticínios',
  'Limpeza',
  'Carnes e Frios',
  'Frutas e Verduras',
  'Higiene Pessoal',
  'Congelados'
];

const suppliers = [
  'Distribuidora Alimentos Ltda',
  'Distribuidora Bebidas Sul',
  'Panificadora Central',
  'Laticínios do Sul Ltda',
  'Distribuidora Limpeza Pro'
];

type Product = typeof mockProducts[0];

export default function Products() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Form state para novo produto
  const [newProduct, setNewProduct] = useState({
    id: '',
    name: '',
    brand: '',
    category: '',
    costPrice: 0,
    salePrice: 0,
    stock: 0,
    minStock: 0,
    maxStock: 0,
    supplier: '',
    expiryDate: '',
    status: 'active',
    description: '',
    shelfLocation: ''
  });

  // Filtros
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.id.includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Estatísticas
  const stats = {
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    lowStock: products.filter(p => p.stock <= p.minStock).length,
    outOfStock: products.filter(p => p.stock === 0).length,
    nearExpiry: products.filter(p => {
      const expiryDate = new Date(p.expiryDate);
      const today = new Date();
      const diffTime = expiryDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30 && diffDays > 0;
    }).length
  };

  const handleAddProduct = () => {
    const product: Product = {
      ...newProduct,
      lastSold: new Date().toISOString().split('T')[0],
      totalSold: 0,
      revenue: 0
    };
    setProducts([...products, product]);
    setNewProduct({
      id: '',
      name: '',
      brand: '',
      category: '',
      costPrice: 0,
      salePrice: 0,
      stock: 0,
      minStock: 0,
      maxStock: 0,
      supplier: '',
      expiryDate: '',
      status: 'active',
      description: '',
      shelfLocation: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleEditProduct = (product: Product) => {
    const index = products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      const updatedProducts = [...products];
      updatedProducts[index] = product;
      setProducts(updatedProducts);
      setEditingProduct(null);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  const getStockStatus = (product: Product) => {
    if (product.stock === 0) return { status: 'out', color: 'destructive', text: 'Esgotado' };
    if (product.stock <= product.minStock) return { status: 'low', color: 'warning', text: 'Baixo' };
    if (product.stock >= product.maxStock * 0.8) return { status: 'high', color: 'success', text: 'Alto' };
    return { status: 'normal', color: 'secondary', text: 'Normal' };
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <DesktopOnlyPage
      title="Gestão de Produtos"
      description="Sistema completo de cadastro e gerenciamento de produtos com controle de estoque e preços."
      features={[
        "Cadastro completo de produtos com códigos de barras",
        "Controle de estoque e movimentações",
        "Gestão de preços e margens de lucro",
        "Categorização e organização por departamentos",
        "Controle de validade e produtos vencidos",
        "Relatórios de produtos mais vendidos",
        "Importação e exportação de dados"
      ]}
    >
      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Produtos</h1>
          <p className="text-muted-foreground mt-1">
            Sistema completo de cadastro e gerenciamento de produtos com controle de estoque e preços.
            Gerencie seu catálogo de produtos, estoque e preços
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-primary hover:bg-primary-hover">
                <Plus className="h-4 w-4 mr-2" />
                Novo Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Produto</DialogTitle>
                <DialogDescription>
                  Preencha as informações do produto abaixo
                </DialogDescription>
              </DialogHeader>
              <ProductForm
                product={newProduct}
                onChange={setNewProduct}
                onSubmit={handleAddProduct}
                onCancel={() => setIsAddDialogOpen(false)}
                isEditing={false}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ativos</p>
                <p className="text-2xl font-bold text-success">{stats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estoque Baixo</p>
                <p className="text-2xl font-bold text-warning">{stats.lowStock}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Esgotados</p>
                <p className="text-2xl font-bold text-destructive">{stats.outOfStock}</p>
              </div>
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Próx. Vencimento</p>
                <p className="text-2xl font-bold text-orange-500">{stats.nearExpiry}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, marca ou código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Categorias</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Preços</TableHead>
                <TableHead>Validade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product);
                const margin = ((product.salePrice - product.costPrice) / product.costPrice) * 100;
                const isNearExpiry = new Date(product.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{product.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{product.brand}</span>
                          <span>•</span>
                          <span className="font-mono text-xs">{product.id}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{product.stock}</span>
                          <Badge variant={stockStatus.color as any} className="text-xs">
                            {stockStatus.text}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Min: {product.minStock} | Max: {product.maxStock}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{formatCurrency(product.salePrice)}</p>
                        <p className="text-xs text-muted-foreground">
                          Custo: {formatCurrency(product.costPrice)}
                        </p>
                        <div className="flex items-center gap-1 text-xs">
                          {margin > 0 ? (
                            <TrendingUp className="h-3 w-3 text-success" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-destructive" />
                          )}
                          <span className={margin > 0 ? 'text-success' : 'text-destructive'}>
                            {margin.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className={`text-sm ${isNearExpiry ? 'text-orange-500 font-medium' : ''}`}>
                          {formatDate(product.expiryDate)}
                        </p>
                        {isNearExpiry && (
                          <Badge variant="outline" className="text-orange-500 border-orange-500">
                            Próximo ao venc.
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                        {product.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{product.totalSold} vendas</p>
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(product.revenue)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedProduct(product)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir Produto</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o produto "{product.name}"? 
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteProduct(product.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Product Dialog */}
      {editingProduct && (
        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Produto</DialogTitle>
              <DialogDescription>
                Altere as informações do produto abaixo
              </DialogDescription>
            </DialogHeader>
            <ProductForm
              product={editingProduct}
              onChange={setEditingProduct}
              onSubmit={() => handleEditProduct(editingProduct)}
              onCancel={() => setEditingProduct(null)}
              isEditing={true}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Product Details Dialog */}
      {selectedProduct && (
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalhes do Produto</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>Detalhes do produto: {selectedProduct.name}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
    </DesktopOnlyPage>
  );
}

// Componente do formulário de produto
const ProductForm = ({ 
  product, 
  onChange, 
  onSubmit, 
  onCancel, 
  isEditing 
}: {
  product: any;
  onChange: (product: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isEditing: boolean;
}) => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
          <TabsTrigger value="pricing">Preços e Estoque</TabsTrigger>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Produto</Label>
              <Input
                id="name"
                value={product.name}
                onChange={(e) => onChange({ ...product, name: e.target.value })}
                placeholder="Nome do produto"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Marca</Label>
              <Input
                id="brand"
                value={product.brand}
                onChange={(e) => onChange({ ...product, brand: e.target.value })}
                placeholder="Marca do produto"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="id">Código de Barras</Label>
              <Input
                id="id"
                value={product.id}
                onChange={(e) => onChange({ ...product, id: e.target.value })}
                placeholder="Código de barras"
                disabled={isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select 
                value={product.category} 
                onValueChange={(value) => onChange({ ...product, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={product.description}
              onChange={(e) => onChange({ ...product, description: e.target.value })}
              placeholder="Descrição detalhada do produto"
              rows={3}
            />
          </div>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="costPrice">Preço de Custo</Label>
              <Input
                id="costPrice"
                type="number"
                step="0.01"
                value={product.costPrice}
                onChange={(e) => onChange({ ...product, costPrice: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salePrice">Preço de Venda</Label>
              <Input
                id="salePrice"
                type="number"
                step="0.01"
                value={product.salePrice}
                onChange={(e) => onChange({ ...product, salePrice: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock">Estoque Atual</Label>
              <Input
                id="stock"
                type="number"
                value={product.stock}
                onChange={(e) => onChange({ ...product, stock: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minStock">Estoque Mínimo</Label>
              <Input
                id="minStock"
                type="number"
                value={product.minStock}
                onChange={(e) => onChange({ ...product, minStock: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxStock">Estoque Máximo</Label>
              <Input
                id="maxStock"
                type="number"
                value={product.maxStock}
                onChange={(e) => onChange({ ...product, maxStock: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplier">Fornecedor</Label>
              <Select 
                value={product.supplier} 
                onValueChange={(value) => onChange({ ...product, supplier: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um fornecedor" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map(supplier => (
                    <SelectItem key={supplier} value={supplier}>{supplier}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="shelfLocation">Localização na Prateleira</Label>
              <Input
                id="shelfLocation"
                value={product.shelfLocation}
                onChange={(e) => onChange({ ...product, shelfLocation: e.target.value })}
                placeholder="Ex: A1-02"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Data de Validade</Label>
              <Input
                id="expiryDate"
                type="date"
                value={product.expiryDate}
                onChange={(e) => onChange({ ...product, expiryDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={product.status} 
                onValueChange={(value) => onChange({ ...product, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={onSubmit} className="bg-primary hover:bg-primary-hover">
          {isEditing ? 'Salvar Alterações' : 'Cadastrar Produto'}
        </Button>
      </div>
    </div>
  );
};

// Componente de detalhes do produto
const ProductDetails = ({ product }: { product: Product }) => {
  const stockStatus = getStockStatus(product);
  const margin = ((product.salePrice - product.costPrice) / product.costPrice) * 100;
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p className="text-muted-foreground">{product.brand}</p>
            <Badge variant="outline" className="mt-2">{product.category}</Badge>
          </div>
          <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
            {product.status === 'active' ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Código de Barras</p>
            <p className="font-mono font-medium">{product.id}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Localização</p>
            <p className="font-medium">{product.shelfLocation}</p>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="space-y-3">
        <h4 className="font-semibold flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Preços e Margem
        </h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Custo</p>
            <p className="text-lg font-semibold">{formatCurrency(product.costPrice)}</p>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Venda</p>
            <p className="text-lg font-semibold text-primary">{formatCurrency(product.salePrice)}</p>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Margem</p>
            <p className={`text-lg font-semibold ${margin > 0 ? 'text-success' : 'text-destructive'}`}>
              {margin.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Stock */}
      <div className="space-y-3">
        <h4 className="font-semibold flex items-center gap-2">
          <Package className="h-4 w-4" />
          Estoque
        </h4>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Atual</p>
            <p className="text-lg font-semibold">{product.stock}</p>
            <Badge variant={stockStatus.color as any} className="text-xs mt-1">
              {stockStatus.text}
            </Badge>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Mínimo</p>
            <p className="text-lg font-semibold">{product.minStock}</p>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Máximo</p>
            <p className="text-lg font-semibold">{product.maxStock}</p>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Disponível</p>
            <p className="text-lg font-semibold text-success">
              {Math.round(((product.maxStock - product.stock) / product.maxStock) * 100)}%
            </p>
          </div>
        </div>
      </div>

      {/* Performance */}
      <div className="space-y-3">
        <h4 className="font-semibold flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Performance
        </h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Vendido</p>
            <p className="text-lg font-semibold">{product.totalSold}</p>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Receita Total</p>
            <p className="text-lg font-semibold text-success">{formatCurrency(product.revenue)}</p>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Última Venda</p>
            <p className="text-lg font-semibold">{formatDate(product.lastSold)}</p>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="space-y-3">
        <h4 className="font-semibold">Informações Adicionais</h4>
        <div className="space-y-2">
          <div>
            <p className="text-sm text-muted-foreground">Descrição</p>
            <p>{product.description}</p>
          </div>
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Fornecedor</p>
              <p>{product.supplier}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data de Validade</p>
              <p>{formatDate(product.expiryDate)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function getStockStatus(product: Product) {
  if (product.stock === 0) return { status: 'out', color: 'destructive', text: 'Esgotado' };
  if (product.stock <= product.minStock) return { status: 'low', color: 'warning', text: 'Baixo' };
  if (product.stock >= product.maxStock * 0.8) return { status: 'high', color: 'success', text: 'Alto' };
  return { status: 'normal', color: 'secondary', text: 'Normal' };
}