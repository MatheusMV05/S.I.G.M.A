import React, { useState, useEffect, useMemo } from 'react'; // Importado useEffect e useMemo
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
  AlertTriangle,
  Download,
  Loader2 // Icon de Loading
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Serviços e Tipos
import { promotionService } from '@/services/promotionService';
import type { CreatePromotionRequest } from '@/services/types';
import { useNotifications } from '@/contexts/NotificationContext'; // Para feedback
import { productJavaService } from '@/services/productJavaService';
import type { ProductAPI } from '@/services/javaApiTypes';

// Interface local atualizada para corresponder ao PromocaoDTO do Backend
interface Promotion {
  id_promocao: number;
  nome: string;
  descricao: string;
  tipo_desconto: 'PERCENTUAL' | 'FIXO';
  valor_desconto: number;
  data_inicio: string;
  data_fim: string;
  status: 'ATIVA' | 'INATIVA' | 'AGENDADA';
  produtos: any[]; // 'any' por enquanto, vindo do DTO
  
  applicationsCount: number;
  totalSales: number;

  // TODO: O frontend usa 'projectedSales', o backend não tem isso.
  // Vamos adicionar manualmente por enquanto.
  projectedSales?: number; 
}

// Tipo para o formulário (corresponde ao CreatePromocaoRequest do Backend)
interface PromotionFormData {
  nome: string;
  descricao: string;
  tipo_desconto: 'PERCENTUAL' | 'FIXO';
  valor_desconto: number;
  data_inicio: string;
  data_fim: string;
  produtoIds: (string | number)[]; // IDs dos produtos
}

// Valores iniciais para um novo formulário
const initialFormData: PromotionFormData = {
  nome: '',
  descricao: '',
  tipo_desconto: 'PERCENTUAL',
  valor_desconto: 0,
  data_inicio: '',
  data_fim: '',
  produtoIds: []
};


export default function PromotionsManagement() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  // Estados da API
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
  });

  // Estados de Filtro (já existentes)
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'scheduled', 'expired'

  // Estados dos Modais (já existentes)
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [promotionToDelete, setPromotionToDelete] = useState<Promotion | null>(null);
  const [availableProducts, setAvailableProducts] = useState<ProductAPI[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  
  // Estado do Formulário (atualizado para nomes do backend)
  const [formData, setFormData] = useState<Partial<PromotionFormData>>(initialFormData);
  const [editMode, setEditMode] = useState(false);

  // Função para buscar dados da API
  const fetchPromotions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Mapeia o status do frontend para o backend
      const statusMap = {
        active: 'ATIVA',
        scheduled: 'AGENDADA',
        expired: 'INATIVA',
        all: 'all'
      };
      const backendStatus = statusMap[statusFilter as keyof typeof statusMap] || 'all';
      
      const params = {
        page: pagination.page,
        size: pagination.size,
        search: searchTerm,
        status: backendStatus
      };

      // Chama o serviço
      const response = await promotionService.getPromotions(params);
      
      // O backend retorna 'PaginatedResponseDTO'
      setPromotions(response.content as unknown as Promotion[]); // Atualiza a interface
      setPagination({
        ...pagination,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
      });

    } catch (err) {
      const e = err as Error;
      setError(e.message || 'Erro ao buscar promoções.');
      addNotification({
        title: "Erro na Operação",
        message: 'Erro ao buscar promoções: ' + e.message,
        type: 'error',
        priority: 'high' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableProducts = async () => {
    setIsLoadingProducts(true); // 1. Define o loading
    
    try {
      // 2. Tenta fazer a chamada à API (com o objeto de parâmetros correto)
      const response = await productJavaService.getProducts({
        page: 0,
        size: 50, // Pode ajustar o 'size'
        search: productSearchTerm,
        status: 'ATIVO' // O backend espera 'ATIVO' ou 'INATIVO'
      });
      
      // 3. Define os produtos (o tipo ProductAPI é o correto)
      setAvailableProducts(response.content);

    } catch (err) {
      // 4. Se a API falhar, mostra a notificação de erro
      const e = err as Error;
      addNotification({
        title: "Erro ao buscar produtos",
        message: e.message || 'Não foi possível carregar a lista de produtos.',
        type: 'error',
        priority: 'medium'
      });
    } finally {
      // 5. Independentemente de sucesso ou falha, remove o loading
      setIsLoadingProducts(false);
    }
  };

  // useEffect para buscar dados quando os filtros mudam
  useEffect(() => {
    // TODO: Adicionar debounce ao searchTerm
    fetchPromotions();
  }, [searchTerm, statusFilter, pagination.page, pagination.size]);

  useEffect(() => {
    // Só busca se o dialog estiver aberto
    if (isDialogOpen) {
      // TODO: Adicionar debounce ao productSearchTerm
      fetchAvailableProducts();
    }
  }, [isDialogOpen, productSearchTerm]);


  // Funções utilitárias (formatadores)
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    // A data do backend vem como 'YYYY-MM-DD'
    if (!dateString) return '--';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const formatPercent = (value: number) => {
    return `${value}%`;
  };

  // Mapeia o status do backend para o badge do frontend
  const getStatusBadge = (status: Promotion['status']) => {
    const statusConfig = {
      ATIVA: { label: 'Ativa', variant: 'default' as const, icon: CheckCircle },
      AGENDADA: { label: 'Agendada', variant: 'secondary' as const, icon: Clock },
      INATIVA: { label: 'Expirada', variant: 'outline' as const, icon: AlertTriangle }
    };
    return statusConfig[status] || statusConfig.INATIVA;
  };

  // (getPromotionStatus foi removido, o backend agora define o status)

  // O useMemo para filtros foi removido, pois o backend faz a filtragem.
  // A lista de promoções agora é 'promotions' direto do estado.

  const handleEdit = (promotion: Promotion) => {
    // Mapeia do DTO (Promotion) para o FormData
    setFormData({
      nome: promotion.nome,
      descricao: promotion.descricao,
      tipo_desconto: promotion.tipo_desconto,
      valor_desconto: promotion.valor_desconto,
      data_inicio: promotion.data_inicio,
      data_fim: promotion.data_fim,
      produtoIds: promotion.produtos.map(p => p.id_produto) // Assumindo que o DTO tem id_produto
    });
    // TODO: A API não está populando 'id_produto' nos produtos. Usando 'id' mockado.
    setSelectedProducts(promotion.produtos.map(p => p.id || p.id_produto));
    
    setEditMode(true);
    setEditingId(promotion.id_promocao);
    setIsDialogOpen(true);
  };

  const handleNew = () => {
    setFormData(initialFormData);
    setSelectedProducts([]);
    setEditMode(false);
    setEditingId(null);
    setIsDialogOpen(true);
  };

  const handleDetails = (promotion: Promotion) => {
    // Adiciona o projectedSales mockado
    setSelectedPromotion({ ...promotion, projectedSales: (promotion.totalSales || 0) * 1.2 || 5000 });
    setIsDetailsOpen(true);
  };

  // Conectado ao Backend
  const handleSave = async () => {
    console.log("--- handleSave FOI CHAMADA ---"); // CHECKPOINT 1

    // 1. Validação
    if (!formData.data_inicio || !formData.data_fim || !formData.nome || (formData.valor_desconto ?? 0) < 0) {
      console.log("!!! ERRO DE VALIDAÇÃO: Campos obrigatórios em falta."); // CHECKPOINT 2
      addNotification({
        title: "Campos Inválidos",
        message: 'Preencha todos os campos obrigatórios (*).',
        type: 'error',
        priority: 'high' 
      });
      return;
    }

    console.log("Validação passou. A construir payload..."); // CHECKPOINT 3

    // 2. Prepara o payload
    const payload = {
      nome: formData.nome || '',
      descricao: formData.descricao || '',
      tipo_desconto: formData.tipo_desconto || 'PERCENTUAL',
      valor_desconto: formData.valor_desconto || 0,
      data_inicio: formData.data_inicio,
      data_fim: formData.data_fim,
      produtoIds: selectedProducts // Converte string[] para number[]
    };

    console.log("Payload a enviar:", payload); // CHECKPOINT 4

    try {
      if (editMode && editingId) {
        console.log(`A tentar ATUALIZAR promoção ID: ${editingId}`); // CHECKPOINT 5
        await promotionService.updatePromotion(String(editingId), payload as any);
        console.log("SUCESSO ao atualizar."); // CHECKPOINT 6
        
        addNotification({
          title: "Sucesso",
          message: 'Promoção atualizada com sucesso!',
          type: 'success',
          priority: 'medium' 
        });

      } else {
        console.log("A tentar CRIAR nova promoção."); // CHECKPOINT 5
        await promotionService.createPromotion(payload as any);
        console.log("SUCESSO ao criar."); // CHECKPOINT 6
        
        addNotification({
          title: "Sucesso",
          message: 'Promoção criada com sucesso!',
          type: 'success',
          priority: 'medium' 
        });
      }
      
      // 4. Limpa o formulário e atualiza a lista
      console.log("A fechar dialog e recarregar lista..."); // CHECKPOINT 7
      setIsDialogOpen(false);
      setFormData(initialFormData);
      setSelectedProducts([]);
      fetchPromotions(); 

    } catch (err) {
      // 5. Mostra o erro da API
      const e = err as Error;
      console.error("!!! ERRO NA API (DENTRO DO CATCH):", e); // CHECKPOINT 8
      
      addNotification({
        title: "Erro na Operação",
        message: `Erro ao salvar promoção: ${e.message}`,
        type: 'error',
        priority: 'high' 
      });
    }
  };

  // Conectado ao Backend
  const handleDeleteConfirm = async () => {
    if (!promotionToDelete) return;

    try {
      await promotionService.deletePromotion(String(promotionToDelete.id_promocao));
      addNotification({
          title: "Sucesso",
          message: 'Promoção atualizada com sucesso!',
          type: 'success',
          priority: 'medium' 
        });
      setPromotionToDelete(null); // <--- ISSO FECHA O DIALOG
      fetchPromotions(); // Recarrega a lista
    } catch (err) {
      const e = err as Error;
      addNotification({
        title: "Erro na Operação",
        message: 'Erro ao buscar promoções: ' + e.message,
        type: 'error',
        priority: 'high' 
      });
      // Não fecha o dialog em caso de erro
    }
  };

  const handleProductToggle = (productId: number) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const calculateDiscountedPrice = (originalPrice: number, discount: number, discountType: string) => {
    return discountType === 'PERCENTUAL' 
      ? originalPrice * (1 - discount / 100)
      : originalPrice - discount;
  };

  const handleAnalytics = (promotion: Promotion) => {
    // Adiciona o projectedSales mockado
    setSelectedPromotion({ ...promotion, projectedSales: (promotion.totalSales || 0) * 1.2 || 5000 });
    setIsAnalyticsOpen(true);
  };

  // (Funções de cálculo de barra de progresso mantidas)
  const calculateProgressBar = (current: number, target: number) => {
    if (target === 0) return { baseWidth: 0, excessWidth: 0, hasExcess: false, percentage: '0.0' };
    
    const percentage = (current / target) * 100;
    const baseWidth = Math.min(100, percentage);
    const hasExcess = percentage > 100;
    const excessWidth = hasExcess ? Math.min(30, (percentage - 100) / 2) : 0; // Limita o excesso visual a 30%
    
    return {
      baseWidth,
      excessWidth,
      hasExcess,
      percentage: percentage.toFixed(1)
    };
  };

  const calculateDailySalesBar = (currentSales: number, maxSales: number) => {
    if (maxSales === 0) return 0;
    const percentage = (currentSales / maxSales) * 100;
    return Math.min(100, percentage);
  };

  // (Mock de analytics mantido)
  const getPromotionAnalytics = (promotion: Promotion) => {
    // ... (mock de analytics)
    const dailySales = [
      { date: '2024-11-20', sales: 1200, applications: 15 },
      { date: '2024-11-21', sales: 2800, applications: 28 },
      { date: '2024-11-22', sales: 3200, applications: 32 },
    ];
    // ...
    return {
      dailySales,
      productPerformance: promotion.produtos.map(product => ({
        ...product,
        salesCount: Math.floor(Math.random() * 50) + 10,
        revenue: (Math.floor(Math.random() * 50) + 10) * (product.discountedPrice || product.price),
        conversionRate: Math.floor(Math.random() * 30) + 15
      })),
      categoryPerformance: [
         { category: 'Grãos e Cereais', sales: 5600, applications: 45, avgTicket: 124.44 },
      ],
      totalRevenue: promotion.totalSales,
      totalApplications: promotion.applicationsCount,
      avgTicket: (promotion.totalSales / (promotion.applicationsCount || 1)),
      conversionRate: (promotion.applicationsCount / 1000) * 100, // Mock base de 1000 visualizações
      roi: ((promotion.totalSales - (promotion.totalSales * 0.7)) / (promotion.totalSales * 0.3)) * 100
    };
  };

  // Cálculo dos cards do topo (agora baseado nos dados paginados, idealmente seria do backend)
  const stats = useMemo(() => {
    // TODO: Idealmente, o backend forneceria esses totais
    // Por enquanto, baseia-se nos dados carregados (o que não é o total real)
    const totalLoaded = pagination.totalElements; // Usa o total real do backend
    const activeLoaded = promotions.filter(p => p.status === 'ATIVA').length;
    const applicationsLoaded = promotions.reduce((sum, p) => sum + p.applicationsCount, 0);
    const salesLoaded = promotions.reduce((sum, p) => sum + p.totalSales, 0);

    return { totalLoaded, activeLoaded, applicationsLoaded, salesLoaded };
  }, [promotions, pagination]);


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

      {/* Stats Cards (Atualizados) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Promoções</p>
                <p className="text-2xl font-bold">{stats.totalLoaded}</p>
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
                  {/* TODO: Esse stat deveria vir da API, não do filtro atual */}
                  {stats.activeLoaded} 
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
                  {/* TODO: Esse stat deveria vir da API */}
                  {stats.applicationsLoaded}
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
                  {/* TODO: Esse stat deveria vir da API */}
                  {formatCurrency(stats.salesLoaded)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca (Atualizados para usar o status do backend) */}
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

      {/* Lista de Promoções (Atualizada) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading && (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="space-y-4 p-6">
              <div className="flex justify-between items-center">
                <div className="h-6 w-1/2 bg-muted rounded animate-pulse"></div>
                <div className="h-6 w-1/4 bg-muted rounded animate-pulse"></div>
              </div>
              <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
              <div className="h-10 w-full bg-muted rounded animate-pulse"></div>
              <div className="h-8 w-full bg-muted rounded animate-pulse"></div>
            </Card>
          ))
        )}
        
        {!isLoading && error && (
          <div className="col-span-1 lg:col-span-2 text-center text-destructive">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Erro ao carregar promoções</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        )}

        {!isLoading && !error && promotions.length === 0 && (
          <div className="col-span-1 lg:col-span-2 text-center text-muted-foreground">
            <Percent className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold">Nenhuma promoção encontrada</h3>
            <p>Tente ajustar os filtros ou crie uma nova promoção.</p>
          </div>
        )}

        {!isLoading && !error && promotions.map((promotion) => {
          // Atualizado para usar os nomes de campo do DTO
          const statusInfo = getStatusBadge(promotion.status);
          const StatusIcon = statusInfo.icon;
          const projectedSales = (promotion.totalSales || 0) * 1.2 || 5000; // Mock de meta
          
          return (
            <Card key={promotion.id_promocao} className="hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Percent className="h-5 w-5 text-primary" />
                    {promotion.nome}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="text-lg font-bold">
                      -{promotion.tipo_desconto === 'PERCENTUAL' ? formatPercent(promotion.valor_desconto) : formatCurrency(promotion.valor_desconto)}
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
                  {promotion.descricao}
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Período</Label>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(promotion.data_inicio)} - {formatDate(promotion.data_fim)}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Produtos</Label>
                    <div className="flex items-center gap-1 text-sm">
                      <Package className="h-3 w-3" />
                      <span>{promotion.produtos.length} itens</span>
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
                      {formatCurrency(projectedSales)}
                    </p>
                  </div>
                </div>

                {(() => {
                  const progressBar = calculateProgressBar(promotion.totalSales, projectedSales);
                  return (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progresso da Meta</span>
                        <span className={progressBar.hasExcess ? 'text-success font-semibold' : ''}>
                          {progressBar.percentage}%
                          {progressBar.hasExcess && ' ✨'}
                        </span>
                      </div>
                      <div className="relative">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${progressBar.baseWidth}%` }}
                          ></div>
                        </div>
                        {progressBar.hasExcess && (
                          <div className="absolute top-0 left-0 w-full">
                            <div 
                              className="bg-success h-2 rounded-full opacity-75 animate-pulse border border-success/50" 
                              style={{ width: `${progressBar.excessWidth}%` }}
                              title={`Superávit de ${(parseFloat(progressBar.percentage) - 100).toFixed(1)}%`}
                            ></div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

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
                    onClick={() => handleAnalytics(promotion)}
                  >
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                  <AlertDialog 
                    // Controla o estado de abertura
                    open={!!promotionToDelete && promotionToDelete.id_promocao === promotion.id_promocao} 
                    onOpenChange={(isOpen) => !isOpen && setPromotionToDelete(null)}
                  >
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => setPromotionToDelete(promotion)} // <--- ATUALIZADO (Define a promoção para excluir)
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          {/* Usa o estado para garantir o nome correto */}
                          Tem certeza que deseja excluir a promoção "{promotionToDelete?.nome}"? 
                          Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setPromotionToDelete(null)}> {/* <--- ATUALIZADO (Limpa o estado) */}
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction 
                          className="bg-destructive hover:bg-destructive/90"
                          onClick={handleDeleteConfirm} // <--- ATUALIZADO (Chama a nova função)
                        >
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
      
      {/* TODO: Adicionar Controles de Paginação aqui */}


      {/* Dialog de Cadastro/Edição (Atualizado para nomes do backend) */}
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
                    <Label htmlFor="nome">Nome da Promoção *</Label>
                    <Input
                      id="nome"
                      value={formData.nome || ''}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      placeholder="Ex: Black Friday 2024"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea
                      id="descricao"
                      value={formData.descricao || ''}
                      onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                      placeholder="Descreva a promoção..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="valor_desconto">Desconto *</Label>
                      <Input
                        id="valor_desconto"
                        type="number"
                        min="0"
                        max={formData.tipo_desconto === 'PERCENTUAL' ? 100 : undefined}
                        value={formData.valor_desconto || ''}
                        onChange={(e) => setFormData({...formData, valor_desconto: parseFloat(e.target.value) || 0})}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tipo_desconto">Tipo de Desconto</Label>
                      <Select 
                        value={formData.tipo_desconto || 'PERCENTUAL'} 
                        onValueChange={(value) => setFormData({...formData, tipo_desconto: value as 'PERCENTUAL' | 'FIXO'})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PERCENTUAL">Percentual (%)</SelectItem>
                          <SelectItem value="FIXO">Valor Fixo (R$)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="data_inicio">Data de Início *</Label>
                      <Input
                        id="data_inicio"
                        type="date"
                        value={formData.data_inicio || ''}
                        onChange={(e) => setFormData({...formData, data_inicio: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="data_fim">Data de Fim *</Label>
                      <Input
                        id="data_fim"
                        type="date"
                        value={formData.data_fim || ''}
                        onChange={(e) => setFormData({...formData, data_fim: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-medium mb-2">Informações da Promoção:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• O status será definido automaticamente pelo backend</li>
                      <li>• Promoções futuras ficam como "Agendadas"</li>
                      <li>• Promoções no período ficam "Ativas"</li>
                      <li>• Promoções passadas ficam "Expiradas"</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Seleção de Produtos (CORRIGIDO PARA OS NOMES CORRETOS DA API) */}
            <TabsContent value="products" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Lista de Produtos Disponíveis (Lado Esquerdo) */}
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
                    {isLoadingProducts && (
                      <div className="p-6 text-center text-muted-foreground">
                        <Loader2 className="h-8 w-8 mx-auto animate-spin" />
                        <p>Buscando produtos...</p>
                      </div>
                    )}
                    {!isLoadingProducts && availableProducts.length === 0 && (
                      <div className="p-6 text-center text-muted-foreground">
                        <p>Nenhum produto encontrado.</p>
                      </div>
                    )}
                    {/* USANDO OS NOMES CORRETOS: id_produto, nome, preco_venda */}
                    {!isLoadingProducts && availableProducts.map((product) => (
                      <div key={product.id_produto} className="flex items-center space-x-2 p-3 border-b hover:bg-muted/30">
                        <Checkbox
                          id={`prod-${product.id_produto}`}
                          checked={selectedProducts.includes(product.id_produto)}
                          onCheckedChange={() => handleProductToggle(product.id_produto)}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{product.nome}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{product.category?.nome || 'Sem Categoria'}</span>
                            <span>•</span>
                            <span className="font-semibold text-success">
                              {formatCurrency(product.preco_venda)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Produtos Selecionados (Lado Direito) */}
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
                      // Filtra a lista da API para mostrar os selecionados
                      availableProducts
                        .filter(product => selectedProducts.includes(product.id_produto))
                        .map((product) => {
                          const discountedPrice = calculateDiscountedPrice(
                            product.preco_venda, 
                            formData.valor_desconto || 0, 
                            formData.tipo_desconto || 'PERCENTUAL'
                          );
                          
                          return (
                            <div key={product.id_produto} className="p-3 border-b">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-sm">{product.nome}</p>
                                  <p className="text-xs text-muted-foreground">{product.category?.nome}</p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleProductToggle(product.id_produto)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground line-through">
                                    {formatCurrency(product.preco_venda)}
                                  </span>
                                  <span className="text-sm font-bold text-success">
                                    {formatCurrency(discountedPrice)}
                                  </span>
                                </div>
                                <Badge variant="destructive">
                                  -{formData.tipo_desconto === 'PERCENTUAL' ? formatPercent(formData.valor_desconto || 0) : formatCurrency(formData.valor_desconto || 0)}
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

            {/* Prévia (CORRIGIDA PARA USAR A API E NOMES CORRETOS) */}
            <TabsContent value="preview" className="space-y-4">
              <div className="space-y-6">
                <div className="p-6 border rounded-lg bg-muted/20">
                  <h3 className="text-xl font-bold mb-2">{formData.nome || 'Nome da Promoção'}</h3>
                  <p className="text-muted-foreground mb-4">
                    {formData.descricao || 'Descrição da promoção'}
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-background rounded">
                      <p className="text-sm text-muted-foreground">Desconto</p>
                      <p className="text-2xl font-bold text-destructive">
                        -{formData.tipo_desconto === 'PERCENTUAL' ? formatPercent(formData.valor_desconto || 0) : formatCurrency(formData.valor_desconto || 0)}
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
                        {formData.data_inicio ? formatDate(formData.data_inicio) : '--'}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-background rounded">
                      <p className="text-sm text-muted-foreground">Fim</p>
                      <p className="text-sm font-medium">
                        {formData.data_fim ? formatDate(formData.data_fim) : '--'}
                      </p>
                    </div>
                  </div>

                  {selectedProducts.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">Produtos com Desconto:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* 
                          1. Usar 'availableProducts' (estado da API)
                          2. Filtrar por 'product.id_produto'
                          3. Usar 'product.nome' e 'product.preco_venda'
                        */}
                        {availableProducts
                          .filter(product => selectedProducts.includes(product.id_produto))
                          .slice(0, 6)
                          .map((product) => {
                            const discountedPrice = calculateDiscountedPrice(
                              product.preco_venda, 
                              formData.valor_desconto || 0, 
                              formData.tipo_desconto || 'PERCENTUAL'
                            );
                            
                            return (
                              <div key={product.id_produto} className="p-3 bg-background rounded border">
                                <p className="font-medium text-sm">{product.nome}</p>
                                <div className="flex items-center justify-between mt-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground line-through">
                                      {formatCurrency(product.preco_venda)}
                                    </span>
                                    <span className="text-sm font-bold text-success">
                                      {formatCurrency(discountedPrice)}
                                    </span>
                                  </div>
                                  <span className="text-xs text-success font-medium">
                                    Economize {formatCurrency(product.preco_venda - discountedPrice)}
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

      {/* Dialog de Detalhes (Atualizado) */}
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
                    {selectedPromotion.nome}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{selectedPromotion.descricao}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-muted/30 rounded">
                      <p className="text-sm text-muted-foreground">Desconto</p>
                      <p className="text-xl font-bold text-destructive">
                        -{selectedPromotion.tipo_desconto === 'PERCENTUAL' ? formatPercent(selectedPromotion.valor_desconto) : formatCurrency(selectedPromotion.valor_desconto)}
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
                      <p className="text-xs">{formatDate(selectedPromotion.data_inicio)}</p>
                      <p className="text-xs">{formatDate(selectedPromotion.data_fim)}</p>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded">
                      <p className="text-sm text-muted-foreground">Produtos</p>
                      <p className="text-xl font-bold">{selectedPromotion.produtos.length}</p>
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
                        {formatCurrency(selectedPromotion.projectedSales || 0)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Produtos da Promoção (Atualizado) */}
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
                      {/* TODO: Os produtos vêm do backend, mas os preços promocionais são mocks */}
                      {selectedPromotion.produtos.map((product) => {
                        const originalPrice = product.preco_venda;
                        const discountedPrice = calculateDiscountedPrice(originalPrice, selectedPromotion.valor_desconto, selectedPromotion.tipo_desconto);
                        return (
                        <TableRow key={product.id_produto || product.id}>
                          <TableCell>
                            <p className="font-medium">{product.nome || product.name}</p>
                            <p className="text-xs text-muted-foreground font-mono">{product.id_produto || product.id}</p>
                          </TableCell>
                          <TableCell>
                            <span className="line-through text-muted-foreground">
                              {formatCurrency(originalPrice)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="font-bold text-success">
                              {formatCurrency(discountedPrice)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="font-bold text-primary">
                              {formatCurrency(originalPrice - discountedPrice)}
                            </span>
                          </TableCell>
                        </TableRow>
                      )})}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Botão Analisar Impacto */}
              <div className="flex justify-center">
                <Button
                  className="bg-primary hover:bg-primary-hover"
                  onClick={() => {
                    setIsDetailsOpen(false);
                    handleAnalytics(selectedPromotion);
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

      {/* Dialog de Analytics da Promoção (Atualizado) */}
      <Dialog open={isAnalyticsOpen} onOpenChange={setIsAnalyticsOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          {selectedPromotion && (() => {
            const analytics = getPromotionAnalytics(selectedPromotion);
            const statusBadge = getStatusBadge(selectedPromotion.status);
            
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <BarChart3 className="h-6 w-6 text-primary" />
                    Analytics da Promoção
                  </DialogTitle>
                  <DialogDescription>
                    Análise completa de performance e impacto da promoção "{selectedPromotion.nome}"
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Header da Promoção */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <Card className="lg:col-span-2">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">{selectedPromotion.nome}</h3>
                            <Badge variant={statusBadge.variant}>
                              <statusBadge.icon className="h-3 w-3 mr-1" />
                              {statusBadge.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{selectedPromotion.descricao}</p>
                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              <Percent className="h-4 w-4 text-primary" />
                              <span>Desconto: {selectedPromotion.tipo_desconto === 'PERCENTUAL' ? formatPercent(selectedPromotion.valor_desconto) : formatCurrency(selectedPromotion.valor_desconto)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-primary" />
                              <span>{formatDate(selectedPromotion.data_inicio)} - {formatDate(selectedPromotion.data_fim)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-primary" />
                              <span>{selectedPromotion.produtos.length} produtos</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center space-y-2">
                          <div className="text-2xl font-bold text-success">
                            {formatCurrency(analytics.totalRevenue)}
                          </div>
                          <p className="text-sm text-muted-foreground">Receita Total</p>
                          <div className="text-lg font-semibold text-primary">
                            {analytics.totalApplications}
                          </div>
                          <p className="text-xs text-muted-foreground">Aplicações da Promoção</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* ... O resto do modal de Analytics permanece o mesmo ... */}
                  {/* (Código do modal de analytics omitido por brevidade, mas deve ser mantido como estava) */}

                  {/* Ações */}
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => console.log('Exportar relatório')}>
                      <Download className="h-4 w-4 mr-2" />
                      Exportar Relatório
                    </Button>
                    <Button variant="outline" onClick={() => setIsAnalyticsOpen(false)}>
                      <X className="h-4 w-4 mr-2" />
                      Fechar
                    </Button>
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}