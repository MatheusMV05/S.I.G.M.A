import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tag,
  Plus,
  Search,
  Edit,
  Eye,
  Trash2,
  Package,
  MapPin,
  BarChart3,
  TrendingUp,
  Save,
  X,
  Filter,
  Grid,
  List,
  DollarSign,
  Percent
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Mock data para categorias
const mockCategories = [
  {
    id: '1',
    name: 'Grãos e Cereais',
    description: 'Arroz, feijão, lentilha, quinoa, aveia e outros grãos',
    location: 'Corredor 1, Seções A-C',
    productsCount: 45,
    totalValue: 25400.00,
    averagePrice: 8.50,
    status: 'active',
    createdDate: '2024-01-10',
    products: [
      { id: '7891234567890', name: 'Arroz Branco Tio João 5kg', price: 18.90, stock: 45 },
      { id: '7891234567891', name: 'Feijão Preto Camil 1kg', price: 7.80, stock: 32 },
      { id: '7891234567892', name: 'Açúcar Cristal União 1kg', price: 4.99, stock: 28 },
      { id: '7891234567893', name: 'Aveia em Flocos Quaker 500g', price: 12.50, stock: 18 },
      { id: '7891234567894', name: 'Lentilha Camil 500g', price: 6.90, stock: 22 }
    ]
  },
  {
    id: '2',
    name: 'Bebidas',
    description: 'Refrigerantes, sucos, águas, energéticos e bebidas alcoólicas',
    location: 'Corredor 2, Seções D-F',
    productsCount: 32,
    totalValue: 18600.00,
    averagePrice: 12.30,
    status: 'active',
    createdDate: '2024-01-10',
    products: [
      { id: '7891234567895', name: 'Refrigerante Coca-Cola 2L', price: 8.90, stock: 67 },
      { id: '7891234567896', name: 'Água Mineral Crystal 500ml', price: 1.50, stock: 120 },
      { id: '7891234567897', name: 'Suco de Laranja Del Valle 1L', price: 6.50, stock: 38 },
      { id: '7891234567898', name: 'Energético Red Bull 250ml', price: 9.90, stock: 24 },
      { id: '7891234567899', name: 'Cerveja Skol Lata 350ml', price: 3.20, stock: 89 }
    ]
  },
  {
    id: '3',
    name: 'Laticínios',
    description: 'Leite, queijos, iogurtes, manteigas e derivados do leite',
    location: 'Geladeira 1, Seções A-B',
    productsCount: 28,
    totalValue: 15800.00,
    averagePrice: 9.80,
    status: 'active',
    createdDate: '2024-01-10',
    products: [
      { id: '7891234567900', name: 'Leite Integral Parmalat 1L', price: 6.50, stock: 67 },
      { id: '7891234567901', name: 'Queijo Mussarela Tirolez 500g', price: 18.90, stock: 15 },
      { id: '7891234567902', name: 'Iogurte Natural Danone 170g', price: 3.50, stock: 45 },
      { id: '7891234567903', name: 'Manteiga Presidente 200g', price: 8.70, stock: 28 },
      { id: '7891234567904', name: 'Requeijão Catupiry 250g', price: 12.90, stock: 22 }
    ]
  },
  {
    id: '4',
    name: 'Produtos de Limpeza',
    description: 'Detergentes, sabão em pó, desinfetantes e produtos de limpeza',
    location: 'Corredor 3, Seções G-H',
    productsCount: 22,
    totalValue: 8900.00,
    averagePrice: 6.70,
    status: 'active',
    createdDate: '2024-01-15',
    products: [
      { id: '7891234567905', name: 'Detergente Ypê 500ml', price: 4.25, stock: 42 },
      { id: '7891234567906', name: 'Sabão em Pó OMO 1kg', price: 15.90, stock: 18 },
      { id: '7891234567907', name: 'Desinfetante Pinho Sol 1L', price: 7.80, stock: 35 },
      { id: '7891234567908', name: 'Água Sanitária Candida 1L', price: 3.50, stock: 48 },
      { id: '7891234567909', name: 'Esponja de Aço Bombril', price: 2.20, stock: 67 }
    ]
  },
  {
    id: '5',
    name: 'Higiene Pessoal',
    description: 'Shampoos, sabonetes, cremes dentais e produtos de higiene',
    location: 'Corredor 4, Seções I-J',
    productsCount: 35,
    totalValue: 12500.00,
    averagePrice: 11.20,
    status: 'active',
    createdDate: '2024-01-20',
    products: [
      { id: '7891234567910', name: 'Shampoo Seda 325ml', price: 12.90, stock: 25 },
      { id: '7891234567911', name: 'Sabonete Dove 90g', price: 3.80, stock: 56 },
      { id: '7891234567912', name: 'Creme Dental Colgate 90g', price: 5.50, stock: 38 },
      { id: '7891234567913', name: 'Desodorante Rexona 150ml', price: 8.90, stock: 29 },
      { id: '7891234567914', name: 'Papel Higiênico Neve 4 rolos', price: 9.80, stock: 42 }
    ]
  },
  {
    id: '6',
    name: 'Congelados',
    description: 'Carnes, peixes, vegetais congelados e sorvetes',
    location: 'Freezer 1-3, Todas as seções',
    productsCount: 18,
    totalValue: 22800.00,
    averagePrice: 18.50,
    status: 'active',
    createdDate: '2024-02-01',
    products: [
      { id: '7891234567915', name: 'Frango Congelado Sadia 1kg', price: 12.90, stock: 35 },
      { id: '7891234567916', name: 'Peixe Tilápia Congelado 500g', price: 15.80, stock: 22 },
      { id: '7891234567917', name: 'Sorvete Kibon 2L', price: 18.90, stock: 18 },
      { id: '7891234567918', name: 'Batata Congelada McCain 1.5kg', price: 14.50, stock: 28 },
      { id: '7891234567919', name: 'Pizza Congelada Sadia', price: 22.90, stock: 15 }
    ]
  }
];

interface Category {
  id: string;
  name: string;
  description: string;
  location: string;
  productsCount: number;
  totalValue: number;
  averagePrice: number;
  status: string;
  createdDate: string;
  products: any[];
}

export default function CategoriesManagement() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Category>>({});
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const filteredCategories = mockCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (category: Category) => {
    setFormData(category);
    setEditMode(true);
    setIsDialogOpen(true);
  };

  const handleNew = () => {
    setFormData({
      name: '',
      description: '',
      location: '',
      status: 'active'
    });
    setEditMode(false);
    setIsDialogOpen(true);
  };

  const handleDetails = (category: Category) => {
    setSelectedCategory(category);
    setIsDetailsOpen(true);
  };

  const handleSave = () => {
    // Aqui seria feita a chamada para a API
    console.log('Salvando categoria:', formData);
    setIsDialogOpen(false);
    setFormData({});
  };

  const handleDelete = (categoryId: string) => {
    // Aqui seria feita a chamada para a API
    console.log('Excluindo categoria:', categoryId);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Categorias</h1>
          <p className="text-muted-foreground mt-1">
            Organize produtos por categorias e gerencie localizações no estoque
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleNew} className="bg-primary hover:bg-primary-hover">
            <Plus className="h-4 w-4 mr-2" />
            Nova Categoria
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Categorias</p>
                <p className="text-2xl font-bold">{mockCategories.length}</p>
              </div>
              <Tag className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Produtos</p>
                <p className="text-2xl font-bold">
                  {mockCategories.reduce((sum, c) => sum + c.productsCount, 0)}
                </p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                <p className="text-xl font-bold text-success">
                  {formatCurrency(mockCategories.reduce((sum, c) => sum + c.totalValue, 0))}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Preço Médio</p>
                <p className="text-xl font-bold text-primary">
                  {formatCurrency(mockCategories.reduce((sum, c) => sum + c.averagePrice, 0) / mockCategories.length)}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar categorias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Conteúdo Principal */}
      {viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <Card key={category.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Tag className="h-5 w-5 text-primary" />
                    {category.name}
                  </CardTitle>
                  <Badge variant={category.status === 'active' ? 'default' : 'secondary'}>
                    {category.status === 'active' ? 'Ativa' : 'Inativa'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {category.description}
                </p>
                
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{category.location}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-2 bg-muted/30 rounded">
                    <p className="text-sm text-muted-foreground">Produtos</p>
                    <p className="text-xl font-bold">{category.productsCount}</p>
                  </div>
                  <div className="text-center p-2 bg-muted/30 rounded">
                    <p className="text-sm text-muted-foreground">Valor Total</p>
                    <p className="text-lg font-bold text-success">
                      {formatCurrency(category.totalValue)}
                    </p>
                  </div>
                </div>

                <div className="text-center p-2 bg-primary/10 rounded">
                  <p className="text-sm text-muted-foreground">Preço Médio</p>
                  <p className="text-lg font-bold text-primary">
                    {formatCurrency(category.averagePrice)}
                  </p>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    Criada em {formatDate(category.createdDate)}
                  </span>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDetails(category)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEdit(category)}
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
                          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir a categoria "{category.name}"? 
                            Esta ação não pode ser desfeita e todos os produtos desta categoria 
                            ficarão sem classificação.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            className="bg-destructive hover:bg-destructive/90"
                            onClick={() => handleDelete(category.id)}
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* List View */
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Produtos</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Preço Médio</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id} className="cursor-pointer hover:bg-muted/30">
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-primary" />
                          <p className="font-medium">{category.name}</p>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {category.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{category.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Package className="h-3 w-3 text-muted-foreground" />
                        <span className="font-semibold">{category.productsCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-success">
                        {formatCurrency(category.totalValue)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-primary">
                        {formatCurrency(category.averagePrice)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={category.status === 'active' ? 'default' : 'secondary'}>
                        {category.status === 'active' ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDetails(category)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(category)}
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
                              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir a categoria "{category.name}"? 
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                className="bg-destructive hover:bg-destructive/90"
                                onClick={() => handleDelete(category.id)}
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Dialog de Cadastro/Edição */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editMode ? 'Editar Categoria' : 'Nova Categoria'}
            </DialogTitle>
            <DialogDescription>
              {editMode ? 'Altere os dados da categoria' : 'Cadastre uma nova categoria'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Categoria *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Ex: Grãos e Cereais"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Descreva os produtos desta categoria"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Localização no Estoque *</Label>
              <Input
                id="location"
                value={formData.location || ''}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="Ex: Corredor 3, Seção A"
              />
              <p className="text-xs text-muted-foreground">
                Informe onde os produtos desta categoria estão localizados no estoque
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status || 'active'} 
                onValueChange={(value) => setFormData({...formData, status: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativa</SelectItem>
                  <SelectItem value="inactive">Inativa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-2">Informações Importantes:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• A localização ajuda na organização do estoque</li>
                <li>• Categorias inativas não aparecem no cadastro de produtos</li>
                <li>• Produtos já cadastrados mantêm a categoria mesmo se inativada</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary-hover">
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Detalhes */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Categoria</DialogTitle>
            <DialogDescription>
              Informações completas e produtos associados
            </DialogDescription>
          </DialogHeader>
          
          {selectedCategory && (
            <div className="space-y-6">
              {/* Informações da Categoria */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Tag className="h-5 w-5" />
                      Informações da Categoria
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Nome</Label>
                      <p className="font-medium text-lg">{selectedCategory.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Descrição</Label>
                      <p>{selectedCategory.description}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Localização</Label>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <p>{selectedCategory.location}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                      <Badge variant={selectedCategory.status === 'active' ? 'default' : 'secondary'}>
                        {selectedCategory.status === 'active' ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Data de Criação</Label>
                      <p>{formatDate(selectedCategory.createdDate)}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Estatísticas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-3 bg-primary/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">Total de Produtos</p>
                      <p className="text-2xl font-bold">{selectedCategory.productsCount}</p>
                    </div>
                    <div className="text-center p-3 bg-success/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">Valor Total em Estoque</p>
                      <p className="text-xl font-bold text-success">
                        {formatCurrency(selectedCategory.totalValue)}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">Preço Médio</p>
                      <p className="text-xl font-bold text-blue-600">
                        {formatCurrency(selectedCategory.averagePrice)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Lista de Produtos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Produtos da Categoria ({selectedCategory.products.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead>Código</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Estoque</TableHead>
                        <TableHead>Valor Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedCategory.products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <p className="font-medium">{product.name}</p>
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-sm">{product.id}</span>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold text-success">
                              {formatCurrency(product.price)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold">{product.stock} un</span>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold text-primary">
                              {formatCurrency(product.price * product.stock)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}