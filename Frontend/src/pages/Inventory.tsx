import React, { useState, useEffect } from 'react';
import { DesktopOnlyPage } from '@/components/DesktopOnlyPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Search,
  Download,
  Calendar as CalendarIcon,
  RefreshCw,
  User,
  FileText,
  ArrowUpDown,
  BarChart3,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { stockService } from '@/services/stockService';
import { productBackendService } from '@/services/productBackendService';

interface Product {
  id_produto: number;
  nome: string;
  estoque: number;
}

interface Movement {
  id_movimentacao: number;
  id_produto: number;
  produto?: { nome: string; };
  id_usuario: number | null;
  data_movimentacao: string;
  tipo: 'IN' | 'OUT' | 'ADJUSTMENT' | 'LOSS' | 'RETURN' | 'SALE';
  quantidade: number;
  estoque_anterior: number;
  estoque_atual: number;
  observacao: string | null;
  usuario?: { nome: string; };
}

export default function Inventory() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Estados
  const [movements, setMovements] = useState<Movement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [reasonFilter, setReasonFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [sortBy, setSortBy] = useState<'date' | 'product' | 'quantity'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(0);
  
  // Modal
  const [isNewMovementOpen, setIsNewMovementOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newMovement, setNewMovement] = useState({
    productId: '',
    type: '',
    quantity: '',
    reason: '',
    reference: ''
  });

  // Carregar movimentações
  const fetchMovements = async () => {
    try {
      setIsLoading(true);
      const response = await stockService.getStockMovements({
        page: currentPage,
        size: pageSize,
        startDate: dateFrom ? format(dateFrom, 'yyyy-MM-dd') : undefined,
        endDate: dateTo ? format(dateTo, 'yyyy-MM-dd') : undefined
      });
      
      setMovements(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error('Erro ao carregar movimentações:', error);
      toast?.({
        title: 'Erro',
        description: 'Não foi possível carregar as movimentações.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar produtos
  const fetchProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const response = await productBackendService.getProducts({ 
        page: 0, 
        size: 1000,
        active: true 
      }) as any;
      setProducts(response.content || []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, [currentPage, dateFrom, dateTo]);

  useEffect(() => {
    if (isNewMovementOpen) {
      fetchProducts();
    }
  }, [isNewMovementOpen]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMovementTypeLabel = (tipo: string) => {
    const types: Record<string, string> = {
      'IN': 'Entrada',
      'OUT': 'Saída',
      'ADJUSTMENT': 'Ajuste',
      'LOSS': 'Perda',
      'RETURN': 'Devolução',
      'SALE': 'Venda'
    };
    return types[tipo] || tipo;
  };

  const getMovementIcon = (tipo: string) => {
    if (tipo === 'IN' || tipo === 'RETURN' || tipo === 'ADJUSTMENT') {
      return <TrendingUp className="h-3 w-3 mr-1" />;
    }
    return <TrendingDown className="h-3 w-3 mr-1" />;
  };

  const getMovementVariant = (tipo: string): "default" | "secondary" | "destructive" | "outline" => {
    if (tipo === 'IN' || tipo === 'RETURN' || tipo === 'ADJUSTMENT') {
      return 'default';
    }
    return 'secondary';
  };

  // Filtrar localmente
  const filteredMovements = movements.filter((movement) => {
    const productName = movement.produto?.nome || '';
    const matchesSearch = 
      productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.id_produto.toString().includes(searchTerm);
    
    const matchesType = typeFilter === 'all' || movement.tipo === typeFilter;
    const matchesReason = reasonFilter === 'all' || (movement.observacao && movement.observacao.includes(reasonFilter));
    const userName = movement.usuario?.nome || '';
    const matchesUser = userFilter === 'all' || userName === userFilter;
    
    return matchesSearch && matchesType && matchesReason && matchesUser;
  });

  // Ordenar
  const sortedMovements = [...filteredMovements].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.data_movimentacao).getTime() - new Date(b.data_movimentacao).getTime();
        break;
      case 'product':
        comparison = (a.produto?.nome || '').localeCompare(b.produto?.nome || '');
        break;
      case 'quantity':
        comparison = a.quantidade - b.quantidade;
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Estatísticas
  const totalEntradas = filteredMovements.filter(m => 
    m.tipo === 'IN' || m.tipo === 'RETURN' || m.tipo === 'ADJUSTMENT'
  ).length;
  
  const totalSaidas = filteredMovements.filter(m => 
    m.tipo === 'OUT' || m.tipo === 'SALE' || m.tipo === 'LOSS'
  ).length;
  
  const quantityEntered = filteredMovements
    .filter(m => m.tipo === 'IN' || m.tipo === 'RETURN' || m.tipo === 'ADJUSTMENT')
    .reduce((sum, m) => sum + m.quantidade, 0);
  
  const quantityExited = filteredMovements
    .filter(m => m.tipo === 'OUT' || m.tipo === 'SALE' || m.tipo === 'LOSS')
    .reduce((sum, m) => sum + Math.abs(m.quantidade), 0);

  const uniqueUsers = Array.from(new Set(movements.map(m => m.usuario?.nome).filter(Boolean)));
  const uniqueReasons = Array.from(new Set(movements.map(m => m.observacao).filter(Boolean)));

  const handleSaveMovement = async () => {
    if (!newMovement.productId || !newMovement.type || !newMovement.quantity) {
      toast?.({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos obrigatórios.',
        variant: 'destructive'
      });
      return;
    }

    const quantity = parseInt(newMovement.quantity);
    if (quantity <= 0) {
      toast?.({
        title: 'Quantidade inválida',
        description: 'A quantidade deve ser maior que zero.',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsSaving(true);
      
      await stockService.createStockMovement({
        productId: parseInt(newMovement.productId),
        type: newMovement.type as any,
        quantity: quantity,
        reason: newMovement.reason || 'Movimentação manual'
      });

      toast?.({
        title: 'Sucesso',
        description: 'Movimentação registrada com sucesso!',
        variant: 'default'
      });
      
      setIsNewMovementOpen(false);
      setNewMovement({
        productId: '',
        type: '',
        quantity: '',
        reason: '',
        reference: ''
      });
      
      fetchMovements();
    } catch (error: any) {
      console.error('Erro ao salvar movimentação:', error);
      toast?.({
        title: 'Erro',
        description: error.message || 'Não foi possível registrar a movimentação.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Data/Hora', 'Produto', 'Tipo', 'Quantidade', 'Estoque Anterior', 'Estoque Novo', 'Usuário', 'Observação'],
      ...sortedMovements.map(m => [
        formatDate(m.data_movimentacao),
        m.produto?.nome || '',
        getMovementTypeLabel(m.tipo),
        m.quantidade,
        m.estoque_anterior,
        m.estoque_atual,
        m.usuario?.nome || '',
        m.observacao || ''
      ])
    ].map(row => row.join(';')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `movimentacoes_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setReasonFilter('all');
    setUserFilter('all');
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <DesktopOnlyPage
      title="Movimentações de Estoque"
      description="Controle completo de todas as entradas e saídas de produtos do estoque com rastreabilidade total."
      features={[
        "Histórico completo de movimentações",
        "Filtros avançados por data, tipo, produto e usuário",
        "Registro de entrada e saída de produtos",
        "Rastreabilidade de estoque anterior e novo",
        "Exportação de relatórios em CSV",
        "Integração em tempo real com o estoque"
      ]}
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Movimentações de Estoque</h1>
            <p className="text-muted-foreground mt-1">
              Histórico completo de entradas e saídas com rastreabilidade total
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Movimentações</p>
                  <p className="text-2xl font-bold">{sortedMovements.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    de {movements.length} no total
                  </p>
                </div>
                <RefreshCw className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Entradas</p>
                  <p className="text-2xl font-bold text-success">{totalEntradas}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    +{quantityEntered} unidades
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Saídas</p>
                  <p className="text-2xl font-bold text-warning">{totalSaidas}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    -{quantityExited} unidades
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Saldo Líquido</p>
                  <p className={`text-2xl font-bold ${
                    (quantityEntered - quantityExited) >= 0 ? 'text-success' : 'text-destructive'
                  }`}>
                    {quantityEntered - quantityExited > 0 ? '+' : ''}
                    {quantityEntered - quantityExited}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    unidades no período
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Filtros
              </CardTitle>
              {(searchTerm || typeFilter !== 'all' || reasonFilter !== 'all' || userFilter !== 'all' || dateFrom || dateTo) && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Limpar Filtros
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Produto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Tipos</SelectItem>
                    <SelectItem value="IN">Entrada</SelectItem>
                    <SelectItem value="OUT">Saída</SelectItem>
                    <SelectItem value="SALE">Venda</SelectItem>
                    <SelectItem value="ADJUSTMENT">Ajuste</SelectItem>
                    <SelectItem value="LOSS">Perda</SelectItem>
                    <SelectItem value="RETURN">Devolução</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Data De</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecionar'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Data Até</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecionar'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Movimentações */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Movimentações</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : sortedMovements.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => toggleSort('date')}>
                      <div className="flex items-center gap-2">
                        Data/Hora
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => toggleSort('product')}>
                      <div className="flex items-center gap-2">
                        Produto
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => toggleSort('quantity')}>
                      <div className="flex items-center gap-2">
                        Quantidade
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Estoque</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Observação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedMovements.map((movement) => (
                    <TableRow key={movement.id_movimentacao}>
                      <TableCell>
                        <p className="text-sm font-medium">
                          {formatDate(movement.data_movimentacao)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{movement.produto?.nome || 'Produto não encontrado'}</p>
                          <p className="text-xs text-muted-foreground">
                            ID: {movement.id_produto}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getMovementVariant(movement.tipo)}>
                          {getMovementIcon(movement.tipo)}
                          {getMovementTypeLabel(movement.tipo)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`font-semibold text-lg ${
                          movement.tipo === 'IN' || movement.tipo === 'RETURN' || movement.tipo === 'ADJUSTMENT'
                            ? 'text-success' 
                            : 'text-warning'
                        }`}>
                          {movement.quantidade > 0 ? '+' : ''}{movement.quantidade}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Anterior:</span>
                            <span className="font-semibold">{movement.estoque_anterior}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Novo:</span>
                            <span className="font-semibold text-primary">{movement.estoque_atual}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{movement.usuario?.nome || 'Sistema'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{movement.observacao || '-'}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-muted-foreground mb-2">
                  Nenhuma movimentação encontrada
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Limpar Filtros
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
            >
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground">
              Página {currentPage + 1} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1}
            >
              Próxima
            </Button>
          </div>
        )}
      </div>

      {/* Modal Nova Movimentação */}
      <Dialog open={isNewMovementOpen} onOpenChange={setIsNewMovementOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nova Movimentação de Estoque</DialogTitle>
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
                  {isLoadingProducts ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    products.map((product) => (
                      <SelectItem key={product.id_produto} value={product.id_produto.toString()}>
                        {product.nome} (Estoque: {product.estoque})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo *</Label>
                <Select
                  value={newMovement.type}
                  onValueChange={(value) => setNewMovement(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN">Entrada</SelectItem>
                    <SelectItem value="OUT">Saída</SelectItem>
                    <SelectItem value="SALE">Venda</SelectItem>
                    <SelectItem value="ADJUSTMENT">Ajuste</SelectItem>
                    <SelectItem value="LOSS">Perda</SelectItem>
                    <SelectItem value="RETURN">Devolução</SelectItem>
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
                  placeholder="Ex: 10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Observação</Label>
              <Textarea
                id="reason"
                value={newMovement.reason}
                onChange={(e) => setNewMovement(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Motivo da movimentação..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsNewMovementOpen(false)}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveMovement}
              className="bg-primary hover:bg-primary-hover"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DesktopOnlyPage>
  );
}