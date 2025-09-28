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
import { Progress } from '@/components/ui/progress';
import {
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  ShoppingCart,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Calendar,
  DollarSign,
  Archive,
  PackageCheck,
  PackageX
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Mock data para produtos do inventário
const inventoryProducts = [
  {
    id: '7891234567890',
    name: 'Arroz Branco Tio João 5kg',
    category: 'Grãos e Cereais',
    currentStock: 45,
    minStock: 20,
    maxStock: 100,
    avgConsumption: 8, // por dia
    lastMovement: '2024-12-08',
    location: 'A-01-003',
    supplier: 'Distribuidora Alimentos Ltda',
    costPrice: 12.50,
    sellPrice: 18.90,
    status: 'normal'
  },
  {
    id: '7891234567891',
    name: 'Açúcar Cristal União 1kg',
    category: 'Grãos e Cereais',
    currentStock: 8,
    minStock: 25,
    maxStock: 80,
    avgConsumption: 12,
    lastMovement: '2024-12-07',
    location: 'A-02-001',
    supplier: 'Distribuidora Alimentos Ltda',
    costPrice: 3.20,
    sellPrice: 4.99,
    status: 'low'
  },
  {
    id: '7891234567892',
    name: 'Óleo de Soja Soya 900ml',
    category: 'Óleos e Gorduras',
    currentStock: 0,
    minStock: 15,
    maxStock: 50,
    avgConsumption: 6,
    lastMovement: '2024-12-05',
    location: 'B-01-002',
    supplier: 'Distribuidora Alimentos Ltda',
    costPrice: 6.80,
    sellPrice: 9.90,
    status: 'out'
  },
  {
    id: '7891234567893',
    name: 'Leite Integral Parmalat 1L',
    category: 'Laticínios',
    currentStock: 67,
    minStock: 30,
    maxStock: 80,
    avgConsumption: 15,
    lastMovement: '2024-12-08',
    location: 'C-01-001',
    supplier: 'Laticínios Sul',
    costPrice: 4.20,
    sellPrice: 6.50,
    status: 'normal'
  },
  {
    id: '7891234567894',
    name: 'Detergente Ypê 500ml',
    category: 'Limpeza',
    currentStock: 12,
    minStock: 20,
    maxStock: 60,
    avgConsumption: 4,
    lastMovement: '2024-12-06',
    location: 'D-01-003',
    supplier: 'Produtos de Limpeza Ltda',
    costPrice: 2.80,
    sellPrice: 4.25,
    status: 'low'
  }
];

// Mock data para movimentações
const movements = [
  {
    id: '1',
    productId: '7891234567890',
    productName: 'Arroz Branco Tio João 5kg',
    type: 'entrada',
    quantity: 24,
    date: '2024-12-08T10:30:00',
    user: 'João Silva',
    reason: 'Recebimento de fornecedor',
    reference: 'NF-001234'
  },
  {
    id: '2',
    productId: '7891234567891',
    productName: 'Açúcar Cristal União 1kg',
    type: 'saida',
    quantity: 15,
    date: '2024-12-08T14:22:00',
    user: 'Maria Costa',
    reason: 'Venda no PDV',
    reference: 'VENDA-5678'
  },
  {
    id: '3',
    productId: '7891234567892',
    productName: 'Óleo de Soja Soya 900ml',
    type: 'saida',
    quantity: 8,
    date: '2024-12-07T16:45:00',
    user: 'Pedro Lima',
    reason: 'Venda no PDV',
    reference: 'VENDA-5679'
  },
  {
    id: '4',
    productId: '7891234567893',
    productName: 'Leite Integral Parmalat 1L',
    type: 'entrada',
    quantity: 36,
    date: '2024-12-07T09:15:00',
    user: 'João Silva',
    reason: 'Recebimento de fornecedor',
    reference: 'NF-001235'
  }
];

type InventoryTab = 'products' | 'movements' | 'alerts' | 'reports';

export default function Inventory() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<InventoryTab>('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<typeof inventoryProducts[0] | null>(null);
  const [isInspectionOpen, setIsInspectionOpen] = useState(false);
  const [isNewMovementOpen, setIsNewMovementOpen] = useState(false);
  const [newMovement, setNewMovement] = useState({
    productId: '',
    type: '',
    quantity: '',
    reason: '',
    reference: ''
  });
  const [quickActionProduct, setQuickActionProduct] = useState<typeof inventoryProducts[0] | null>(null);
  const [quickActionType, setQuickActionType] = useState<'add' | 'remove' | 'restock'>('add');
  const [quickActionQuantity, setQuickActionQuantity] = useState('');
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      normal: { label: 'Normal', variant: 'default' as const },
      low: { label: 'Estoque Baixo', variant: 'secondary' as const },
      out: { label: 'Em Falta', variant: 'destructive' as const },
      excess: { label: 'Excesso', variant: 'outline' as const }
    };
    
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.normal;
  };

  const getStockPercentage = (current: number, min: number, max: number) => {
    return ((current - min) / (max - min)) * 100;
  };

  const handleSaveMovement = () => {
    if (!newMovement.productId || !newMovement.type || !newMovement.quantity) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const product = inventoryProducts.find(p => p.id === newMovement.productId);
    if (!product) {
      alert('Produto não encontrado.');
      return;
    }

    const movement = {
      id: (movements.length + 1).toString(),
      productId: newMovement.productId,
      productName: product.name,
      type: newMovement.type as 'entrada' | 'saida',
      quantity: parseInt(newMovement.quantity),
      date: new Date().toISOString(),
      user: user?.name || 'Usuário',
      reason: newMovement.reason || 'Movimentação manual',
      reference: newMovement.reference || 'REF-' + Date.now()
    };

    console.log('Nova movimentação criada:', movement);
    
    setIsNewMovementOpen(false);
    setNewMovement({
      productId: '',
      type: '',
      quantity: '',
      reason: '',
      reference: ''
    });
    
    alert('Movimentação registrada com sucesso!');
  };

  const handleQuickAddStock = (product: typeof inventoryProducts[0]) => {
    setQuickActionProduct(product);
    setQuickActionType('add');
    setQuickActionQuantity('');
    setIsQuickActionOpen(true);
  };

  const handleQuickRemoveStock = (product: typeof inventoryProducts[0]) => {
    setQuickActionProduct(product);
    setQuickActionType('remove');
    setQuickActionQuantity('');
    setIsQuickActionOpen(true);
  };

  const handleQuickRestock = (product: typeof inventoryProducts[0]) => {
    setQuickActionProduct(product);
    setQuickActionType('restock');
    const suggestedQuantity = Math.max(0, product.maxStock - product.currentStock);
    setQuickActionQuantity(suggestedQuantity.toString());
    setIsQuickActionOpen(true);
  };

  const handleConfirmQuickAction = () => {
    if (!quickActionProduct || !quickActionQuantity) {
      alert('Por favor, informe a quantidade.');
      return;
    }

    const quantity = parseInt(quickActionQuantity);
    if (quantity <= 0) {
      alert('A quantidade deve ser maior que zero.');
      return;
    }

    let type: 'entrada' | 'saida' = 'entrada';
    let reason = '';

    switch (quickActionType) {
      case 'add':
        type = 'entrada';
        reason = 'Entrada manual de estoque';
        break;
      case 'remove':
        type = 'saida';
        reason = 'Saída manual de estoque';
        if (quantity > quickActionProduct.currentStock) {
          alert(`Quantidade indisponível. Estoque atual: ${quickActionProduct.currentStock}`);
          return;
        }
        break;
      case 'restock':
        type = 'entrada';
        reason = 'Reposição de estoque';
        break;
    }

    const movement = {
      id: (movements.length + 1).toString(),
      productId: quickActionProduct.id,
      productName: quickActionProduct.name,
      type: type,
      quantity: quantity,
      date: new Date().toISOString(),
      user: user?.name || 'Usuário',
      reason: reason,
      reference: 'REF-' + Date.now()
    };

    console.log('Ação rápida executada:', movement);

    setIsQuickActionOpen(false);
    setQuickActionProduct(null);
    setQuickActionQuantity('');

    const actionText = quickActionType === 'add' ? 'Adição' : 
                      quickActionType === 'remove' ? 'Remoção' : 'Reposição';
    alert(`${actionText} de estoque registrada com sucesso!`);
  };

  const getDaysToStockOut = (currentStock: number, avgConsumption: number) => {
    if (avgConsumption === 0) return '∞';
    const days = Math.floor(currentStock / avgConsumption);
    return days <= 0 ? '0' : days.toString();
  };

  // Filtrar produtos
  const filteredProducts = inventoryProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.id.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Estatísticas
  const totalProducts = inventoryProducts.length;
  const lowStockProducts = inventoryProducts.filter(p => p.status === 'low').length;
  const outOfStockProducts = inventoryProducts.filter(p => p.status === 'out').length;
  const totalValue = inventoryProducts.reduce((sum, p) => sum + (p.currentStock * p.costPrice), 0);

  // Função para abrir inspeção do produto
  const openProductInspection = (product: typeof inventoryProducts[0]) => {
    setSelectedProduct(product);
    setIsInspectionOpen(true);
  };

  // Função para fechar inspeção
  const closeProductInspection = () => {
    setIsInspectionOpen(false);
    setSelectedProduct(null);
  };

  // Calcular histórico de movimentações do produto selecionado
  const getProductMovements = (productId: string) => {
    return movements.filter(m => m.productId === productId);
  };

  return (
    <DesktopOnlyPage
      title="Controle de Estoque"
      description="Sistema completo de controle e gestão de estoque com alertas automáticos e relatórios detalhados."
      features={[
        "Controle de estoque em tempo real",
        "Alertas de estoque baixo e produtos vencidos",
        "Movimentações de entrada e saída",
        "Relatórios de giro de estoque",
        "Análise de investimento por produto",
        "Previsão de reposição automática",
        "Controle de lotes e validades"
      ]}
    >
      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Inventário</h1>
          <p className="text-muted-foreground mt-1">
            Controle de estoque em tempo real com alertas automáticos e relatórios detalhados.
            Controle completo do estoque e movimentações
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
          <Button 
            className="bg-primary hover:bg-primary-hover"
            onClick={() => setIsNewMovementOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Movimentação
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Produtos</p>
                <p className="text-2xl font-bold">{totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estoque Baixo</p>
                <p className="text-2xl font-bold text-warning">{lowStockProducts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Em Falta</p>
                <p className="text-2xl font-bold text-destructive">{outOfStockProducts}</p>
              </div>
              <PackageX className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                <p className="text-xl font-bold text-success">{formatCurrency(totalValue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as InventoryTab)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Produtos
          </TabsTrigger>
          <TabsTrigger value="movements" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Movimentações
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Alertas
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Relatórios
          </TabsTrigger>
        </TabsList>

        {/* Produtos */}
        <TabsContent value="products" className="space-y-6">
          {/* Filtros */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos por nome ou código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Status</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="low">Estoque Baixo</SelectItem>
                <SelectItem value="out">Em Falta</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Categorias</SelectItem>
                <SelectItem value="Grãos e Cereais">Grãos e Cereais</SelectItem>
                <SelectItem value="Laticínios">Laticínios</SelectItem>
                <SelectItem value="Limpeza">Limpeza</SelectItem>
                <SelectItem value="Óleos e Gorduras">Óleos e Gorduras</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabela de Produtos */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Estoque</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Previsão</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => {
                    const statusBadge = getStatusBadge(product.status);
                    const stockPercentage = getStockPercentage(product.currentStock, product.minStock, product.maxStock);
                    const daysToStockOut = getDaysToStockOut(product.currentStock, product.avgConsumption);
                    
                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">{product.name}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {product.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground font-mono">
                                {product.id}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{product.currentStock}</span>
                              <span className="text-sm text-muted-foreground">
                                / {product.maxStock}
                              </span>
                            </div>
                            <Progress 
                              value={Math.max(0, Math.min(100, stockPercentage))} 
                              className="h-1.5 w-24" 
                            />
                            <p className="text-xs text-muted-foreground">
                              Min: {product.minStock}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusBadge.variant}>
                            {statusBadge.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono text-sm font-medium">
                              {product.location}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="text-sm">
                              {daysToStockOut} dias
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {product.avgConsumption}/dia
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-semibold text-success">
                              {formatCurrency(product.currentStock * product.costPrice)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatCurrency(product.costPrice)} /un
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openProductInspection(product)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleQuickAddStock(product)}
                              title="Adicionar ao estoque"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleQuickRemoveStock(product)}
                              title="Remover do estoque"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Movimentações */}
        <TabsContent value="movements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Movimentações</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Referência</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            {formatDate(movement.date)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{movement.productName}</p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {movement.productId}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={movement.type === 'entrada' ? 'default' : 'secondary'}>
                          {movement.type === 'entrada' ? (
                            <><TrendingUp className="h-3 w-3 mr-1" /> Entrada</>
                          ) : (
                            <><TrendingDown className="h-3 w-3 mr-1" /> Saída</>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`font-semibold ${
                          movement.type === 'entrada' ? 'text-success' : 'text-warning'
                        }`}>
                          {movement.type === 'entrada' ? '+' : '-'}{movement.quantity}
                        </span>
                      </TableCell>
                      <TableCell>{movement.user}</TableCell>
                      <TableCell>
                        <span className="text-sm">{movement.reason}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-xs">{movement.reference}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alertas */}
        <TabsContent value="alerts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Produtos em Falta */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PackageX className="h-5 w-5 text-destructive" />
                  Produtos em Falta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {inventoryProducts.filter(p => p.status === 'out').map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 border border-destructive/20 rounded-lg bg-destructive/5">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Última movimentação: {new Date(product.lastMovement).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-primary hover:bg-primary-hover"
                        onClick={() => handleQuickRestock(product)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Repor
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Estoque Baixo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Estoque Baixo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {inventoryProducts.filter(p => p.status === 'low').map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 border border-warning/20 rounded-lg bg-warning/5">
                      <div className="flex-1">
                        <p className="font-medium">{product.name}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-sm text-muted-foreground">
                            Atual: <span className="font-semibold">{product.currentStock}</span>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Mínimo: <span className="font-semibold">{product.minStock}</span>
                          </p>
                        </div>
                        <Progress 
                          value={(product.currentStock / product.minStock) * 100} 
                          className="mt-2 h-1.5" 
                        />
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleQuickRestock(product)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Repor
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Produtos próximos ao vencimento (exemplo) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                Produtos Próximos ao Vencimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-orange-300 rounded-lg bg-orange-100 dark:bg-orange-900/30 dark:border-orange-700">
                  <div>
                    <p className="font-medium text-orange-900 dark:text-orange-100">Leite Integral Parmalat 1L</p>
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                      Vencimento: 15/12/2024 (7 dias) • Estoque: 15 unidades
                    </p>
                  </div>
                  <Badge variant="outline" className="text-orange-700 border-orange-600 dark:text-orange-300 dark:border-orange-400">
                    Urgente
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 border border-orange-300 rounded-lg bg-orange-100 dark:bg-orange-900/30 dark:border-orange-700">
                  <div>
                    <p className="font-medium text-orange-900 dark:text-orange-100">Iogurte Natural Vigor 170g</p>
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                      Vencimento: 18/12/2024 (10 dias) • Estoque: 8 unidades
                    </p>
                  </div>
                  <Badge variant="outline" className="text-orange-700 border-orange-600 dark:text-orange-300 dark:border-orange-400">
                    Atenção
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Relatórios */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Giro de Estoque */}
            <Card>
              <CardHeader>
                <CardTitle>Giro de Estoque por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { category: 'Grãos e Cereais', turnover: 8.5, status: 'good' },
                    { category: 'Laticínios', turnover: 12.3, status: 'excellent' },
                    { category: 'Bebidas', turnover: 6.2, status: 'average' },
                    { category: 'Limpeza', turnover: 4.1, status: 'low' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.category}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.turnover} vezes/mês
                        </p>
                      </div>
                      <Badge variant={
                        item.status === 'excellent' ? 'default' :
                        item.status === 'good' ? 'secondary' :
                        item.status === 'average' ? 'outline' : 'destructive'
                      }>
                        {item.status === 'excellent' ? 'Excelente' :
                         item.status === 'good' ? 'Bom' :
                         item.status === 'average' ? 'Médio' : 'Baixo'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Investimento por Categoria */}
            <Card>
              <CardHeader>
                <CardTitle>Investimento por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { category: 'Grãos e Cereais', value: 15400, percentage: 35 },
                    { category: 'Laticínios', value: 12200, percentage: 28 },
                    { category: 'Bebidas', value: 8900, percentage: 20 },
                    { category: 'Limpeza', value: 7500, percentage: 17 }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.category}</span>
                        <span className="font-semibold text-success">
                          {formatCurrency(item.value)}
                        </span>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {item.percentage}% do total investido
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Produtos com Maior Investimento */}
          <Card>
            <CardHeader>
              <CardTitle>Produtos com Maior Investimento</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Estoque</TableHead>
                    <TableHead>Custo Unit.</TableHead>
                    <TableHead>Investimento</TableHead>
                    <TableHead>% do Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryProducts
                    .sort((a, b) => (b.currentStock * b.costPrice) - (a.currentStock * a.costPrice))
                    .slice(0, 5)
                    .map((product) => {
                      const investment = product.currentStock * product.costPrice;
                      const percentage = (investment / totalValue) * 100;
                      
                      return (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-muted-foreground">{product.category}</p>
                            </div>
                          </TableCell>
                          <TableCell>{product.currentStock}</TableCell>
                          <TableCell>{formatCurrency(product.costPrice)}</TableCell>
                          <TableCell className="font-semibold text-success">
                            {formatCurrency(investment)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={percentage} className="w-16 h-2" />
                              <span className="text-sm">{percentage.toFixed(1)}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de Inspeção de Produto */}
      <Dialog open={isInspectionOpen} onOpenChange={setIsInspectionOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Package className="h-6 w-6 text-primary" />
                  Inspeção de Produto
                </DialogTitle>
                <DialogDescription>
                  Informações detalhadas e histórico completo do produto selecionado.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Informações Básicas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Informações do Produto</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Nome</Label>
                          <p className="font-semibold">{selectedProduct.name}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Código</Label>
                          <p className="font-mono text-sm">{selectedProduct.id}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Categoria</Label>
                          <Badge variant="outline" className="mt-1">{selectedProduct.category}</Badge>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                          <Badge 
                            variant={getStatusBadge(selectedProduct.status).variant}
                            className="mt-1"
                          >
                            {getStatusBadge(selectedProduct.status).label}
                          </Badge>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Localização</Label>
                          <p className="font-mono">{selectedProduct.location}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Fornecedor</Label>
                          <p>{selectedProduct.supplier}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Controle de Estoque</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-3 border rounded-lg">
                          <p className="text-sm text-muted-foreground">Estoque Atual</p>
                          <p className="text-2xl font-bold text-primary">{selectedProduct.currentStock}</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <p className="text-sm text-muted-foreground">Estoque Mínimo</p>
                          <p className="text-xl font-semibold text-warning">{selectedProduct.minStock}</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <p className="text-sm text-muted-foreground">Estoque Máximo</p>
                          <p className="text-xl font-semibold text-success">{selectedProduct.maxStock}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Nível de Estoque</span>
                          <span className="text-sm text-muted-foreground">
                            {Math.round(getStockPercentage(selectedProduct.currentStock, selectedProduct.minStock, selectedProduct.maxStock))}%
                          </span>
                        </div>
                        <Progress 
                          value={Math.max(0, Math.min(100, getStockPercentage(selectedProduct.currentStock, selectedProduct.minStock, selectedProduct.maxStock)))} 
                          className="h-3" 
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Consumo Médio</Label>
                          <p className="text-lg font-semibold">{selectedProduct.avgConsumption}/dia</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Previsão de Estoque</Label>
                          <p className="text-lg font-semibold">
                            {getDaysToStockOut(selectedProduct.currentStock, selectedProduct.avgConsumption)} dias
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Informações Financeiras */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-success" />
                      Informações Financeiras
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="p-4 border rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Preço de Custo</p>
                        <p className="text-xl font-bold text-destructive">
                          {formatCurrency(selectedProduct.costPrice)}
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Preço de Venda</p>
                        <p className="text-xl font-bold text-success">
                          {formatCurrency(selectedProduct.sellPrice)}
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Margem de Lucro</p>
                        <p className="text-xl font-bold text-primary">
                          {(((selectedProduct.sellPrice - selectedProduct.costPrice) / selectedProduct.costPrice) * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Valor Investido</p>
                        <p className="text-xl font-bold text-warning">
                          {formatCurrency(selectedProduct.currentStock * selectedProduct.costPrice)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Histórico de Movimentações */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <RefreshCw className="h-5 w-5 text-primary" />
                      Histórico de Movimentações
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {getProductMovements(selectedProduct.id).length > 0 ? (
                      <div className="space-y-3">
                        {getProductMovements(selectedProduct.id)
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .map((movement) => (
                            <div 
                              key={movement.id} 
                              className="flex items-center justify-between p-3 border rounded-lg bg-muted/30"
                            >
                              <div className="flex items-center gap-3">
                                {movement.type === 'entrada' ? (
                                  <TrendingUp className="h-5 w-5 text-success" />
                                ) : (
                                  <TrendingDown className="h-5 w-5 text-warning" />
                                )}
                                <div>
                                  <p className="font-medium">
                                    {movement.type === 'entrada' ? 'Entrada' : 'Saída'} de {movement.quantity} unidades
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {formatDate(movement.date)} • {movement.user}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {movement.reason} • Ref: {movement.reference}
                                  </p>
                                </div>
                              </div>
                              <Badge variant={movement.type === 'entrada' ? 'default' : 'secondary'}>
                                {movement.type === 'entrada' ? '+' : '-'}{movement.quantity}
                              </Badge>
                            </div>
                          ))
                        }
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <RefreshCw className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">
                          Nenhuma movimentação encontrada para este produto
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Ações Rápidas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Ações Rápidas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      <Button className="bg-primary hover:bg-primary-hover">
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Estoque
                      </Button>
                      <Button variant="outline">
                        <Minus className="h-4 w-4 mr-2" />
                        Remover Estoque
                      </Button>
                      <Button variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar Produto
                      </Button>
                      <Button variant="outline">
                        <Truck className="h-4 w-4 mr-2" />
                        Solicitar Reposição
                      </Button>
                      <Button variant="outline">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Ver Relatórios
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar Dados
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Nova Movimentação */}
      <Dialog open={isNewMovementOpen} onOpenChange={setIsNewMovementOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Movimentação</DialogTitle>
            <DialogDescription>
              Registre uma nova movimentação de entrada ou saída no estoque.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product">Produto *</Label>
              <Select
                value={newMovement.productId}
                onValueChange={(value) => setNewMovement(prev => ({ ...prev, productId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent>
                  {inventoryProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Movimentação *</Label>
              <Select
                value={newMovement.type}
                onValueChange={(value) => setNewMovement(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">Entrada</SelectItem>
                  <SelectItem value="saida">Saída</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={newMovement.quantity}
                onChange={(e) => setNewMovement(prev => ({ ...prev, quantity: e.target.value }))}
                placeholder="Digite a quantidade"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Motivo</Label>
              <Select
                value={newMovement.reason}
                onValueChange={(value) => setNewMovement(prev => ({ ...prev, reason: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o motivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Recebimento de fornecedor">Recebimento de fornecedor</SelectItem>
                  <SelectItem value="Venda no PDV">Venda no PDV</SelectItem>
                  <SelectItem value="Devolução de cliente">Devolução de cliente</SelectItem>
                  <SelectItem value="Transferência">Transferência</SelectItem>
                  <SelectItem value="Ajuste de inventário">Ajuste de inventário</SelectItem>
                  <SelectItem value="Perda/Avaria">Perda/Avaria</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference">Referência</Label>
              <Input
                id="reference"
                value={newMovement.reference}
                onChange={(e) => setNewMovement(prev => ({ ...prev, reference: e.target.value }))}
                placeholder="Ex: NF-001234, VENDA-5678"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsNewMovementOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveMovement}
              className="bg-primary hover:bg-primary-hover"
            >
              <Plus className="h-4 w-4 mr-2" />
              Registrar Movimentação
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Ação Rápida */}
      <Dialog open={isQuickActionOpen} onOpenChange={setIsQuickActionOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {quickActionType === 'add' ? 'Adicionar Estoque' : 
               quickActionType === 'remove' ? 'Remover Estoque' : 
               'Repor Estoque'}
            </DialogTitle>
            <DialogDescription>
              {quickActionProduct && (
                <>
                  <span className="font-medium">{quickActionProduct.name}</span>
                  <br />
                  <span className="text-sm">Estoque atual: {quickActionProduct.currentStock}</span>
                  {quickActionType === 'restock' && (
                    <span className="text-sm block">Estoque máximo: {quickActionProduct.maxStock}</span>
                  )}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quick-quantity">
                Quantidade {quickActionType === 'remove' ? 'a remover' : 'a adicionar'} *
              </Label>
              <Input
                id="quick-quantity"
                type="number"
                min="1"
                max={quickActionType === 'remove' ? quickActionProduct?.currentStock : undefined}
                value={quickActionQuantity}
                onChange={(e) => setQuickActionQuantity(e.target.value)}
                placeholder="Digite a quantidade"
              />
              {quickActionType === 'remove' && quickActionProduct && (
                <p className="text-sm text-muted-foreground">
                  Máximo disponível: {quickActionProduct.currentStock}
                </p>
              )}
              {quickActionType === 'restock' && quickActionProduct && (
                <p className="text-sm text-muted-foreground">
                  Sugerido para atingir estoque máximo: {Math.max(0, quickActionProduct.maxStock - quickActionProduct.currentStock)}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsQuickActionOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmQuickAction}
              className={
                quickActionType === 'remove' 
                  ? "bg-destructive hover:bg-destructive/90" 
                  : "bg-primary hover:bg-primary-hover"
              }
            >
              {quickActionType === 'add' ? (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </>
              ) : quickActionType === 'remove' ? (
                <>
                  <Minus className="h-4 w-4 mr-2" />
                  Remover
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Repor
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  </DesktopOnlyPage>
);
}