import React, { useState } from 'react';
import { DesktopOnlyPage } from '@/components/DesktopOnlyPage';
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
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Percent,
  Plus,
  Search,
  Edit,
  Eye,
  Trash2,
  Calendar,
  Package,
  DollarSign,
  TrendingUp,
  Clock,
  Target,
  Star,
  Save,
  X,
  Filter,
  BarChart3,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Mock data para promoções
const mockPromotions = [
  {
    id: '1',
    name: 'Black Week Sigma 2024',
    description: 'Semana especial com descontos incríveis em produtos selecionados',
    discount: 25,
    discountType: 'percentage',
    startDate: '2024-11-20',
    endDate: '2024-11-27',
    status: 'active',
    createdDate: '2024-11-15',
    applicationsCount: 156,
    totalSales: 15600.00,
    projectedSales: 18000.00,
    products: [
      { id: '7891234567890', name: 'Arroz Branco Tio João 5kg', originalPrice: 18.90, discountedPrice: 14.18 },
      { id: '7891234567891', name: 'Feijão Preto Camil 1kg', originalPrice: 7.80, discountedPrice: 5.85 },
      { id: '7891234567892', name: 'Açúcar Cristal União 1kg', originalPrice: 4.99, discountedPrice: 3.74 },
      { id: '7891234567893', name: 'Óleo de Soja Soya 900ml', originalPrice: 9.90, discountedPrice: 7.43 }
    ]
  },
  {
    id: '2',
    name: 'Promoção Natal 2024',
    description: 'Produtos natalinos com desconto especial para as festas',
    discount: 15,
    discountType: 'percentage',
    startDate: '2024-12-10',
    endDate: '2024-12-25',
    status: 'scheduled',
    createdDate: '2024-11-28',
    applicationsCount: 0,
    totalSales: 0.00,
    projectedSales: 12000.00,
    products: [
      { id: '7891234567895', name: 'Refrigerante Coca-Cola 2L', originalPrice: 8.90, discountedPrice: 7.57 },
      { id: '7891234567896', name: 'Suco de Laranja Del Valle 1L', originalPrice: 6.50, discountedPrice: 5.53 },
      { id: '7891234567897', name: 'Cerveja Skol Lata 350ml', originalPrice: 3.20, discountedPrice: 2.72 }
    ]
  },
  {
    id: '3',
    name: 'Queima de Estoque - Laticínios',
    description: 'Liquidação de produtos lácteos próximos ao vencimento',
    discount: 30,
    discountType: 'percentage',
    startDate: '2024-11-01',
    endDate: '2024-11-15',
    status: 'expired',
    createdDate: '2024-10-28',
    applicationsCount: 89,
    totalSales: 4500.00,
    projectedSales: 5000.00,
    products: [
      { id: '7891234567900', name: 'Leite Integral Parmalat 1L', originalPrice: 6.50, discountedPrice: 4.55 },
      { id: '7891234567901', name: 'Iogurte Natural Danone 170g', originalPrice: 3.50, discountedPrice: 2.45 },
      { id: '7891234567902', name: 'Queijo Mussarela Tirolez 500g', originalPrice: 18.90, discountedPrice: 13.23 }
    ]
  },
  {
    id: '4',
    name: 'Desconto Progressivo - Limpeza',
    description: 'Compre mais e pague menos: 10% na compra de 2, 20% na compra de 3 ou mais',
    discount: 20,
    discountType: 'percentage',
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    status: 'active',
    createdDate: '2024-11-25',
    applicationsCount: 43,
    totalSales: 2800.00,
    projectedSales: 8000.00,
    products: [
      { id: '7891234567905', name: 'Detergente Ypê 500ml', originalPrice: 4.25, discountedPrice: 3.40 },
      { id: '7891234567906', name: 'Sabão em Pó OMO 1kg', originalPrice: 15.90, discountedPrice: 12.72 },
      { id: '7891234567907', name: 'Desinfetante Pinho Sol 1L', originalPrice: 7.80, discountedPrice: 6.24 }
    ]
  }
];

// Mock data para produtos disponíveis
const mockAvailableProducts = [
  { id: '7891234567890', name: 'Arroz Branco Tio João 5kg', price: 18.90, category: 'Grãos e Cereais' },
  { id: '7891234567891', name: 'Feijão Preto Camil 1kg', price: 7.80, category: 'Grãos e Cereais' },
  { id: '7891234567892', name: 'Açúcar Cristal União 1kg', price: 4.99, category: 'Grãos e Cereais' },
  { id: '7891234567893', name: 'Óleo de Soja Soya 900ml', price: 9.90, category: 'Óleos e Gorduras' },
  { id: '7891234567895', name: 'Refrigerante Coca-Cola 2L', price: 8.90, category: 'Bebidas' },
  { id: '7891234567896', name: 'Suco de Laranja Del Valle 1L', price: 6.50, category: 'Bebidas' },
  { id: '7891234567897', name: 'Cerveja Skol Lata 350ml', price: 3.20, category: 'Bebidas' },
  { id: '7891234567900', name: 'Leite Integral Parmalat 1L', price: 6.50, category: 'Laticínios' },
  { id: '7891234567901', name: 'Iogurte Natural Danone 170g', price: 3.50, category: 'Laticínios' },
  { id: '7891234567902', name: 'Queijo Mussarela Tirolez 500g', price: 18.90, category: 'Laticínios' },
  { id: '7891234567905', name: 'Detergente Ypê 500ml', price: 4.25, category: 'Limpeza' },
  { id: '7891234567906', name: 'Sabão em Pó OMO 1kg', price: 15.90, category: 'Limpeza' },
  { id: '7891234567907', name: 'Desinfetante Pinho Sol 1L', price: 7.80, category: 'Limpeza' }
];

interface Promotion {
  id: string;
  name: string;
  description: string;
  discount: number;
  discountType: string;
  startDate: string;
  endDate: string;
  status: string;
  createdDate: string;
  applicationsCount: number;
  totalSales: number;
  projectedSales: number;
  products: any[];
}

export default function PromotionsManagement() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Promotion>>({});
  const [editMode, setEditMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [productSearchTerm, setProductSearchTerm] = useState('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatPercent = (value: number) => {
    return `${value}%`;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Ativa', variant: 'default' as const, icon: CheckCircle },
      scheduled: { label: 'Agendada', variant: 'secondary' as const, icon: Clock },
      expired: { label: 'Expirada', variant: 'outline' as const, icon: AlertTriangle }
    };
    
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
  };

  const getPromotionStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return 'scheduled';
    if (now > end) return 'expired';
    return 'active';
  };

  const filteredPromotions = mockPromotions.filter(promotion => {
    const matchesSearch = promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promotion.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || promotion.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (promotion: Promotion) => {
    setFormData(promotion);
    setSelectedProducts(promotion.products.map(p => p.id));
    setEditMode(true);
    setIsDialogOpen(true);
  };

  const handleNew = () => {
    setFormData({
      name: '',
      description: '',
      discount: 0,
      discountType: 'percentage',
      startDate: '',
      endDate: '',
      status: 'scheduled',
      products: []
    });
    setSelectedProducts([]);
    setEditMode(false);
    setIsDialogOpen(true);
  };

  const handleDetails = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setIsDetailsOpen(true);
  };

  const handleSave = () => {
    // Calcular preços com desconto para os produtos selecionados
    const promotionProducts = mockAvailableProducts
      .filter(product => selectedProducts.includes(product.id))
      .map(product => ({
        ...product,
        originalPrice: product.price,
        discountedPrice: formData.discountType === 'percentage' 
          ? product.price * (1 - (formData.discount || 0) / 100)
          : product.price - (formData.discount || 0)
      }));

    const finalData = {
      ...formData,
      products: promotionProducts,
      applicationsCount: editMode ? formData.applicationsCount : 0,
      totalSales: editMode ? formData.totalSales : 0,
      status: getPromotionStatus(formData.startDate || '', formData.endDate || '')
    };

    console.log('Salvando promoção:', finalData);
    setIsDialogOpen(false);
    setFormData({});
    setSelectedProducts([]);
  };

  const handleProductToggle = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const filteredAvailableProducts = mockAvailableProducts.filter(product =>
    product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    product.id.includes(productSearchTerm)
  );

  const calculateDiscountedPrice = (originalPrice: number, discount: number, discountType: string) => {
    return discountType === 'percentage' 
      ? originalPrice * (1 - discount / 100)
      : originalPrice - discount;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Promoções</h1>
          <p className="text-muted-foreground mt-1">
            Crie e gerencie campanhas promocionais e acompanhe resultados
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleNew} className="bg-primary hover:bg-primary-hover">
            <Plus className="h-4 w-4 mr-2" />
            Nova Promoção
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Promoções</p>
                <p className="text-2xl font-bold">{mockPromotions.length}</p>
              </div>
              <Percent className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Promoções Ativas</p>
                <p className="text-2xl font-bold text-success">
                  {mockPromotions.filter(p => p.status === 'active').length}
                </p>
              </div>
              <Star className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Aplicações</p>
                <p className="text-2xl font-bold">
                  {mockPromotions.reduce((sum, p) => sum + p.applicationsCount, 0)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vendas Promocionais</p>
                <p className="text-xl font-bold text-primary">
                  {formatCurrency(mockPromotions.reduce((sum, p) => sum + p.totalSales, 0))}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar promoções..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="active">Ativas</SelectItem>
            <SelectItem value="scheduled">Agendadas</SelectItem>
            <SelectItem value="expired">Expiradas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Promoções */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPromotions.map((promotion) => {
          const statusInfo = getStatusBadge(promotion.status);
          const StatusIcon = statusInfo.icon;
          
          return (
            <Card key={promotion.id} className="hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Percent className="h-5 w-5 text-primary" />
                    {promotion.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="text-lg font-bold">
                      -{formatPercent(promotion.discount)}
                    </Badge>
                    <Badge variant={statusInfo.variant}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusInfo.label}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  {promotion.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Período</Label>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Produtos</Label>
                    <div className="flex items-center gap-1 text-sm">
                      <Package className="h-3 w-3" />
                      <span>{promotion.products.length} itens</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-2 bg-muted/30 rounded">
                    <p className="text-xs text-muted-foreground">Aplicações</p>
                    <p className="text-lg font-bold">{promotion.applicationsCount}</p>
                  </div>
                  <div className="text-center p-2 bg-muted/30 rounded">
                    <p className="text-xs text-muted-foreground">Vendas</p>
                    <p className="text-sm font-bold text-success">
                      {formatCurrency(promotion.totalSales)}
                    </p>
                  </div>
                  <div className="text-center p-2 bg-muted/30 rounded">
                    <p className="text-xs text-muted-foreground">Meta</p>
                    <p className="text-sm font-bold text-primary">
                      {formatCurrency(promotion.projectedSales)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso da Meta</span>
                    <span>{((promotion.totalSales / promotion.projectedSales) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${Math.min(100, (promotion.totalSales / promotion.projectedSales) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDetails(promotion)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEdit(promotion)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      // Navegar para relatórios com filtro da promoção
                      console.log('Analisar impacto da promoção:', promotion.id);
                    }}
                  >
                    <BarChart3 className="h-4 w-4" />
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
                          Tem certeza que deseja excluir a promoção "{promotion.name}"? 
                          Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Dialog de Cadastro/Edição */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editMode ? 'Editar Promoção' : 'Nova Promoção'}
            </DialogTitle>
            <DialogDescription>
              {editMode ? 'Altere os dados da promoção' : 'Configure uma nova campanha promocional'}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
              <TabsTrigger value="products">Produtos</TabsTrigger>
              <TabsTrigger value="preview">Prévia</TabsTrigger>
            </TabsList>

            {/* Dados Básicos */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome da Promoção *</Label>
                    <Input
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ex: Black Friday 2024"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Descreva a promoção..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="discount">Desconto *</Label>
                      <Input
                        id="discount"
                        type="number"
                        min="0"
                        max={formData.discountType === 'percentage' ? '100' : undefined}
                        value={formData.discount || ''}
                        onChange={(e) => setFormData({...formData, discount: parseFloat(e.target.value) || 0})}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discountType">Tipo de Desconto</Label>
                      <Select 
                        value={formData.discountType || 'percentage'} 
                        onValueChange={(value) => setFormData({...formData, discountType: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentual (%)</SelectItem>
                          <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Data de Início *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate || ''}
                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">Data de Fim *</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate || ''}
                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-medium mb-2">Informações da Promoção:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• O status será definido automaticamente baseado nas datas</li>
                      <li>• Promoções futuras ficam como "Agendadas"</li>
                      <li>• Promoções no período ficam "Ativas"</li>
                      <li>• Promoções passadas ficam "Expiradas"</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Seleção de Produtos */}
            <TabsContent value="products" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Lista de Produtos Disponíveis */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Produtos Disponíveis</h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar produtos..."
                        value={productSearchTerm}
                        onChange={(e) => setProductSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="border rounded-lg max-h-96 overflow-y-auto">
                    {filteredAvailableProducts.map((product) => (
                      <div key={product.id} className="flex items-center space-x-2 p-3 border-b hover:bg-muted/30">
                        <Checkbox
                          id={product.id}
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={() => handleProductToggle(product.id)}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{product.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{product.category}</span>
                            <span>•</span>
                            <span className="font-semibold text-success">
                              {formatCurrency(product.price)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Produtos Selecionados */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Produtos Selecionados ({selectedProducts.length})
                  </h3>
                  
                  <div className="border rounded-lg max-h-96 overflow-y-auto">
                    {selectedProducts.length === 0 ? (
                      <div className="p-6 text-center text-muted-foreground">
                        <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Nenhum produto selecionado</p>
                      </div>
                    ) : (
                      mockAvailableProducts
                        .filter(product => selectedProducts.includes(product.id))
                        .map((product) => {
                          const discountedPrice = calculateDiscountedPrice(
                            product.price, 
                            formData.discount || 0, 
                            formData.discountType || 'percentage'
                          );
                          
                          return (
                            <div key={product.id} className="p-3 border-b">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-sm">{product.name}</p>
                                  <p className="text-xs text-muted-foreground">{product.category}</p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleProductToggle(product.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground line-through">
                                    {formatCurrency(product.price)}
                                  </span>
                                  <span className="text-sm font-bold text-success">
                                    {formatCurrency(discountedPrice)}
                                  </span>
                                </div>
                                <Badge variant="destructive">
                                  -{formatPercent(formData.discount || 0)}
                                </Badge>
                              </div>
                            </div>
                          );
                        })
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Prévia */}
            <TabsContent value="preview" className="space-y-4">
              <div className="space-y-6">
                <div className="p-6 border rounded-lg bg-muted/20">
                  <h3 className="text-xl font-bold mb-2">{formData.name || 'Nome da Promoção'}</h3>
                  <p className="text-muted-foreground mb-4">
                    {formData.description || 'Descrição da promoção'}
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-background rounded">
                      <p className="text-sm text-muted-foreground">Desconto</p>
                      <p className="text-2xl font-bold text-destructive">
                        -{formatPercent(formData.discount || 0)}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-background rounded">
                      <p className="text-sm text-muted-foreground">Produtos</p>
                      <p className="text-2xl font-bold">
                        {selectedProducts.length}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-background rounded">
                      <p className="text-sm text-muted-foreground">Início</p>
                      <p className="text-sm font-medium">
                        {formData.startDate ? formatDate(formData.startDate) : '--'}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-background rounded">
                      <p className="text-sm text-muted-foreground">Fim</p>
                      <p className="text-sm font-medium">
                        {formData.endDate ? formatDate(formData.endDate) : '--'}
                      </p>
                    </div>
                  </div>

                  {selectedProducts.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">Produtos com Desconto:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {mockAvailableProducts
                          .filter(product => selectedProducts.includes(product.id))
                          .slice(0, 6)
                          .map((product) => {
                            const discountedPrice = calculateDiscountedPrice(
                              product.price, 
                              formData.discount || 0, 
                              formData.discountType || 'percentage'
                            );
                            
                            return (
                              <div key={product.id} className="p-3 bg-background rounded border">
                                <p className="font-medium text-sm">{product.name}</p>
                                <div className="flex items-center justify-between mt-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground line-through">
                                      {formatCurrency(product.price)}
                                    </span>
                                    <span className="text-sm font-bold text-success">
                                      {formatCurrency(discountedPrice)}
                                    </span>
                                  </div>
                                  <span className="text-xs text-success font-medium">
                                    Economize {formatCurrency(product.price - discountedPrice)}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                      {selectedProducts.length > 6 && (
                        <p className="text-sm text-muted-foreground mt-2">
                          E mais {selectedProducts.length - 6} produtos...
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 mt-6">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary-hover">
              <Save className="h-4 w-4 mr-2" />
              Salvar Promoção
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Detalhes */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Promoção</DialogTitle>
            <DialogDescription>
              Informações completas e análise de performance
            </DialogDescription>
          </DialogHeader>
          
          {selectedPromotion && (
            <div className="space-y-6">
              {/* Informações Básicas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Percent className="h-5 w-5" />
                    {selectedPromotion.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{selectedPromotion.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-muted/30 rounded">
                      <p className="text-sm text-muted-foreground">Desconto</p>
                      <p className="text-xl font-bold text-destructive">
                        -{formatPercent(selectedPromotion.discount)}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded">
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge variant={getStatusBadge(selectedPromotion.status).variant}>
                        {getStatusBadge(selectedPromotion.status).label}
                      </Badge>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded">
                      <p className="text-sm text-muted-foreground">Período</p>
                      <p className="text-xs">{formatDate(selectedPromotion.startDate)}</p>
                      <p className="text-xs">{formatDate(selectedPromotion.endDate)}</p>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded">
                      <p className="text-sm text-muted-foreground">Produtos</p>
                      <p className="text-xl font-bold">{selectedPromotion.products.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Aplicações</p>
                      <p className="text-2xl font-bold">{selectedPromotion.applicationsCount}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Vendas Geradas</p>
                      <p className="text-xl font-bold text-success">
                        {formatCurrency(selectedPromotion.totalSales)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Meta Projetada</p>
                      <p className="text-xl font-bold text-primary">
                        {formatCurrency(selectedPromotion.projectedSales)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Produtos da Promoção */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Produtos da Promoção
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead>Preço Original</TableHead>
                        <TableHead>Preço Promocional</TableHead>
                        <TableHead>Economia</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedPromotion.products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs text-muted-foreground font-mono">{product.id}</p>
                          </TableCell>
                          <TableCell>
                            <span className="line-through text-muted-foreground">
                              {formatCurrency(product.originalPrice)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="font-bold text-success">
                              {formatCurrency(product.discountedPrice)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="font-bold text-primary">
                              {formatCurrency(product.originalPrice - product.discountedPrice)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Botão Analisar Impacto */}
              <div className="flex justify-center">
                <Button 
                  className="bg-primary hover:bg-primary-hover"
                  onClick={() => {
                    // Navegar para relatórios com filtro específico
                    console.log('Analisar impacto da promoção:', selectedPromotion.id);
                    setIsDetailsOpen(false);
                  }}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analisar Impacto nos Relatórios
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}