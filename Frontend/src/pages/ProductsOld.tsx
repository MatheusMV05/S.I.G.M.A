import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Search, Plus, Edit2, Trash2, Package, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  supplier: string;
  stock: number;
  unitPrice: number;
  expiryDate: string;
  unit: string;
  minStock: number;
}

// Mock data
const mockProducts: Product[] = [
  {
    id: '001',
    name: 'Arroz Tio João',
    brand: 'Tio João',
    category: 'Grãos',
    supplier: 'Distribuidora ABC',
    stock: 50,
    unitPrice: 18.99,
    expiryDate: '2024-12-31',
    unit: 'kg',
    minStock: 10
  },
  {
    id: '002',
    name: 'Feijão Preto',
    brand: 'Camil',
    category: 'Grãos',
    supplier: 'Distribuidora ABC',
    stock: 5,
    unitPrice: 7.50,
    expiryDate: '2024-11-15',
    unit: 'kg',
    minStock: 10
  },
  {
    id: '003',
    name: 'Açúcar Cristal',
    brand: 'União',
    category: 'Açúcar',
    supplier: 'Doce Distribuição',
    stock: 80,
    unitPrice: 4.99,
    expiryDate: '2025-06-30',
    unit: 'kg',
    minStock: 15
  },
];

const mockCategories = ['Grãos', 'Açúcar', 'Laticínios', 'Carnes', 'Bebidas', 'Higiene', 'Limpeza'];
const mockSuppliers = ['Distribuidora ABC', 'Doce Distribuição', 'Fornecedor XYZ', 'Atacadão Ltda'];

export default function Products() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const { toast } = useToast();

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.id.includes(searchTerm);
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    const matchesSupplier = !supplierFilter || product.supplier === supplierFilter;
    
    return matchesSearch && matchesCategory && matchesSupplier;
  });

  const handleAdd = () => {
    if (!formData.name || !formData.brand || !formData.category) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const newProduct: Product = {
      id: String(Date.now()),
      name: formData.name!,
      brand: formData.brand!,
      category: formData.category!,
      supplier: formData.supplier || '',
      stock: formData.stock || 0,
      unitPrice: formData.unitPrice || 0,
      expiryDate: formData.expiryDate || '',
      unit: formData.unit || 'un',
      minStock: formData.minStock || 0
    };

    setProducts([...products, newProduct]);
    setFormData({});
    setIsAddDialogOpen(false);
    toast({
      title: "Produto adicionado",
      description: "Produto cadastrado com sucesso"
    });
  };

  const handleEdit = () => {
    if (!selectedProduct) return;

    setProducts(products.map(p => 
      p.id === selectedProduct.id 
        ? { ...selectedProduct, ...formData }
        : p
    ));
    
    setIsEditDialogOpen(false);
    setSelectedProduct(null);
    setFormData({});
    toast({
      title: "Produto atualizado",
      description: "Produto editado com sucesso"
    });
  };

  const handleDelete = () => {
    if (!selectedProduct) return;
    
    setProducts(products.filter(p => p.id !== selectedProduct.id));
    setIsDeleteDialogOpen(false);
    setSelectedProduct(null);
    toast({
      title: "Produto removido",
      description: "Produto excluído com sucesso"
    });
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setFormData(product);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const getStockBadgeVariant = (stock: number, minStock: number) => {
    if (stock === 0) return "destructive";
    if (stock <= minStock) return "secondary";
    return "default";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Package className="h-8 w-8" />
            Gestão de Produtos
          </h1>
          <p className="text-muted-foreground">Cadastro e gerenciamento de produtos</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Produto</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="brand">Marca *</Label>
                <Input
                  id="brand"
                  value={formData.brand || ''}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="category">Categoria *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="supplier">Fornecedor</Label>
                <Select value={formData.supplier} onValueChange={(value) => setFormData({...formData, supplier: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockSuppliers.map(sup => (
                      <SelectItem key={sup} value={sup}>{sup}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="stock">Quantidade em Estoque</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock || ''}
                  onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="minStock">Estoque Mínimo</Label>
                <Input
                  id="minStock"
                  type="number"
                  value={formData.minStock || ''}
                  onChange={(e) => setFormData({...formData, minStock: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="unitPrice">Preço Unitário</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  step="0.01"
                  value={formData.unitPrice || ''}
                  onChange={(e) => setFormData({...formData, unitPrice: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="unit">Unidade</Label>
                <Select value={formData.unit} onValueChange={(value) => setFormData({...formData, unit: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="un">Unidade</SelectItem>
                    <SelectItem value="kg">Kilogramas</SelectItem>
                    <SelectItem value="g">Gramas</SelectItem>
                    <SelectItem value="l">Litros</SelectItem>
                    <SelectItem value="ml">Mililitros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="expiryDate">Data de Validade</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate || ''}
                  onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAdd}>Cadastrar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar produto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as categorias</SelectItem>
                {mockCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={supplierFilter} onValueChange={setSupplierFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os fornecedores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os fornecedores</SelectItem>
                {mockSuppliers.map(sup => (
                  <SelectItem key={sup} value={sup}>{sup}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Validade</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-mono">{product.id}</TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.supplier}</TableCell>
                  <TableCell>
                    <Badge variant={getStockBadgeVariant(product.stock, product.minStock)}>
                      {product.stock} {product.unit}
                    </Badge>
                  </TableCell>
                  <TableCell>R$ {product.unitPrice.toFixed(2)}</TableCell>
                  <TableCell>{product.expiryDate ? new Date(product.expiryDate).toLocaleDateString() : '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(product)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => openDeleteDialog(product)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-name">Nome *</Label>
              <Input
                id="edit-name"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-brand">Marca *</Label>
              <Input
                id="edit-brand"
                value={formData.brand || ''}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
              />
            </div>
            {/* Adicione os outros campos similar ao dialog de adicionar */}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEdit}>Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o produto "{selectedProduct?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}