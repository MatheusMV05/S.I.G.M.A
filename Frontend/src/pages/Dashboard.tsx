import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useDashboardKPIs } from '@/hooks/useReports';
import { useLowStockProducts } from '@/hooks/useProducts';
import { useProdutosCriticos } from '@/hooks/useProdutosCriticos';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  Users,
  BarChart3,
  PlusCircle,
  FileText,
  Calendar,
  Target,
  Clock,
  Store,
  CreditCard,
  Activity,
  ArrowRight
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

// Dados para gráfico de faturamento dos últimos 30 dias
const revenueData = [
  { day: '01', revenue: 12500, target: 15000 },
  { day: '02', revenue: 14200, target: 15000 },
  { day: '03', revenue: 16800, target: 15000 },
  { day: '04', revenue: 13400, target: 15000 },
  { day: '05', revenue: 17600, target: 15000 },
  { day: '06', revenue: 19200, target: 15000 },
  { day: '07', revenue: 15800, target: 15000 },
  { day: '08', revenue: 14600, target: 15000 },
  { day: '09', revenue: 18400, target: 15000 },
  { day: '10', revenue: 16200, target: 15000 },
  { day: '11', revenue: 17800, target: 15000 },
  { day: '12', revenue: 20400, target: 15000 },
  { day: '13', revenue: 16600, target: 15000 },
  { day: '14', revenue: 15200, target: 15000 },
  { day: '15', revenue: 18900, target: 15000 },
  { day: '16', revenue: 17400, target: 15000 },
  { day: '17', revenue: 16800, target: 15000 },
  { day: '18', revenue: 19600, target: 15000 },
  { day: '19', revenue: 18200, target: 15000 },
  { day: '20', revenue: 17000, target: 15000 },
  { day: '21', revenue: 20800, target: 15000 },
  { day: '22', revenue: 19400, target: 15000 },
  { day: '23', revenue: 18600, target: 15000 },
  { day: '24', revenue: 16400, target: 15000 },
  { day: '25', revenue: 17800, target: 15000 },
  { day: '26', revenue: 19200, target: 15000 },
  { day: '27', revenue: 18400, target: 15000 },
  { day: '28', revenue: 17600, target: 15000 },
  { day: '29', revenue: 19800, target: 15000 },
  { day: '30', revenue: 18750, target: 15000 }
];

// Dados para gráfico de produtos mais vendidos
const topProductsData = [
  { name: 'Arroz Branco 5kg', sales: 145, color: '#9333FF' },
  { name: 'Coca-Cola 2L', sales: 128, color: '#FF33CC' },
  { name: 'Pão Francês kg', sales: 112, color: '#00FF7F' },
  { name: 'Leite Integral 1L', sales: 98, color: '#FFD700' },
  { name: 'Açúcar Cristal 1kg', sales: 87, color: '#FF3333' },
  { name: 'Óleo de Soja 900ml', sales: 76, color: '#33CCFF' }
];

// Dados para vendas por hora do dia atual
const hourlyData = [
  { hour: '08h', sales: 12 },
  { hour: '09h', sales: 28 },
  { hour: '10h', sales: 45 },
  { hour: '11h', sales: 38 },
  { hour: '12h', sales: 52 },
  { hour: '13h', sales: 41 },
  { hour: '14h', sales: 35 },
  { hour: '15h', sales: 48 },
  { hour: '16h', sales: 56 },
  { hour: '17h', sales: 62 },
  { hour: '18h', sales: 58 },
  { hour: '19h', sales: 44 }
];

// Componente KPI Card
const KPICard = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  trend, 
  subtitle,
  color = 'primary' 
}: {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease';
  icon: React.ElementType;
  trend?: 'up' | 'down';
  subtitle?: string;
  color?: string;
}) => {
  const isPositive = changeType === 'increase' || trend === 'up';
  const colorClasses = {
    primary: 'text-primary bg-primary/10',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    destructive: 'text-destructive bg-destructive/10'
  };

  return (
    <Card className="transition-all duration-300 hover:shadow-xl hover:scale-[1.05] cursor-pointer group animate-fade-in border-border/50 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2 flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide group-hover:text-foreground transition-colors">
              {title}
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-primary truncate">
              {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
            </p>
            {subtitle && (
              <p className="text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors truncate">
                {subtitle}
              </p>
            )}
            {change !== undefined && (
              <div className="flex items-center gap-1 animate-fade-in">
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 text-success animate-bounce flex-shrink-0" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive animate-bounce flex-shrink-0" />
                )}
                <span className={`text-sm font-medium ${
                  isPositive ? 'text-success' : 'text-destructive'
                }`}>
                  {Math.abs(change)}%
                </span>
                <span className="text-xs text-muted-foreground">vs ontem</span>
              </div>
            )}
          </div>
          <div className={`flex-shrink-0 p-2 sm:p-3 rounded-xl transition-all duration-300 group-hover:scale-110 ${colorClasses[color as keyof typeof colorClasses] || colorClasses.primary}`}>
            <Icon className="h-5 w-5 sm:h-6 sm:w-6 group-hover:animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Buscar KPIs do dashboard
  const { data: dashboardKPIs, isLoading: isLoadingKPIs, error: kpisError } = useDashboardKPIs();
  
  // Buscar produtos com estoque baixo (método antigo - será substituído)
  const { data: lowStockProducts, isLoading: isLoadingLowStock } = useLowStockProducts();

  // 🆕 Buscar produtos críticos com procedure SQL
  const { data: produtosCriticos, isLoading: isLoadingCriticos, error: criticosError } = useProdutosCriticos({
    refetchInterval: 30000 // Atualiza a cada 30 segundos
  });

  // Dados fallback para desenvolvimento (caso a API não esteja disponível)
  const fallbackKPIs = {
    todayRevenue: 18750.40,
    yesterdayRevenue: 16420.30,
    averageTicket: 94.25,
    totalProducts: 2847,
    lowStockProducts: 15,
    totalCustomers: 1568,
    todaySales: 198,
    monthRevenue: 0,
  };

  // Usar dados reais ou fallback
  const kpis = dashboardKPIs || fallbackKPIs;

  // Calcular variações
  const revenueChange = kpis.yesterdayRevenue 
    ? ((kpis.todayRevenue - kpis.yesterdayRevenue) / kpis.yesterdayRevenue) * 100 
    : 0;
  
  // Para salesChange, vamos usar um valor estimado já que não temos yesterdaySales na API
  const salesChange = 12.5; // Valor estimado positivo

  // Funções de navegação
  const handleNewSale = () => navigate('/pos');
  const handleViewReports = () => navigate('/reports');
  const handleNewProduct = () => navigate('/products');
  const handleNewCustomer = () => navigate('/customers');
  const handleViewInventory = () => navigate('/inventory');

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground animate-fade-in">
            Bem-vindo, <span className="text-primary">{user?.name || 'Usuário'}</span>!
          </h1>
          <p className="text-muted-foreground mt-2 text-base sm:text-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Aqui está o resumo das operações de hoje
          </p>
        </div>
        <div className="flex gap-2 sm:gap-3 animate-fade-in w-full sm:w-auto" style={{ animationDelay: '0.4s' }}>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleViewReports}
            className="hover:scale-105 transition-all duration-200 flex-1 sm:flex-none"
          >
            <FileText className="h-4 w-4 mr-2" />
            Relatórios
          </Button>
          <Button 
            size="sm" 
            onClick={handleNewSale}
            className="bg-primary hover:bg-primary-hover hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex-1 sm:flex-none"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Nova Venda
          </Button>
        </div>
      </div>

      {/* KPIs Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <KPICard
          title="Faturamento Hoje"
          value={`R$ ${kpis.todayRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          change={Math.round(revenueChange * 100) / 100}
          changeType={revenueChange >= 0 ? 'increase' : 'decrease'}
          icon={DollarSign}
          color="success"
          subtitle="Meta: R$ 20.000,00"
        />
        
        <KPICard
          title="Ticket Médio"
          value={`R$ ${kpis.averageTicket.toFixed(2)}`}
          change={8.5}
          changeType="increase"
          icon={CreditCard}
          color="primary"
        />
        
        <KPICard
          title="Vendas Hoje"
          value={kpis.todaySales}
          change={Math.round(salesChange * 100) / 100}
          changeType={salesChange >= 0 ? 'increase' : 'decrease'}
          icon={ShoppingCart}
          color="primary"
        />
        
        <KPICard
          title="Estoque Baixo"
          value={kpis.lowStockProducts}
          icon={AlertTriangle}
          color="warning"
          subtitle={`Total: ${kpis.totalProducts} produtos`}
        />
      </div>

      {/* Charts and Analytics */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="revenue" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Faturamento
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Produtos
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Atividade
          </TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Gráfico de Faturamento */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Faturamento dos Últimos 30 Dias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9333FF" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#9333FF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                    <XAxis dataKey="day" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1a1a', 
                        border: '1px solid #333',
                        borderRadius: '8px'
                      }}
                      formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Faturamento']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#9333FF" 
                      strokeWidth={2}
                      fill="url(#revenueGradient)" 
                    />
                    <Line type="monotone" dataKey="target" stroke="#666" strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Métricas Adicionais */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance do Mês</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Crescimento Semanal</span>
                      <span className="font-semibold text-success">+15.8%</span>
                    </div>
                    <Progress value={15.8} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Retenção de Clientes</span>
                      <span className="font-semibold text-primary">78.5%</span>
                    </div>
                    <Progress value={78.5} className="h-2" />
                  </div>

                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Clientes Ativos</span>
                      <span className="text-xl font-bold">{kpis.totalCustomers}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Promoções Ativas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">8</p>
                      <p className="text-sm text-muted-foreground">campanhas ativas</p>
                    </div>
                    <Target className="h-8 w-8 text-secondary" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Produtos Mais Vendidos */}
            <Card>
              <CardHeader>
                <CardTitle>Produtos Mais Vendidos</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={topProductsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="sales"
                    >
                      {topProductsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1a1a', 
                        border: '1px solid #333',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {topProductsData.slice(0, 3).map((product, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: product.color }}
                        />
                        <span className="truncate">{product.name}</span>
                      </div>
                      <span className="font-semibold">{product.sales}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ranking de Produtos */}
            <Card>
              <CardHeader>
                <CardTitle>Ranking Completo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topProductsData.map((product, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium truncate">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.sales} vendas</p>
                      </div>
                      <div 
                        className="w-4 h-4 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: product.color }}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Vendas por Hora */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Vendas por Hora - Hoje</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                    <XAxis dataKey="hour" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1a1a', 
                        border: '1px solid #333',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="sales" fill="#FF33CC" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Alertas de Produtos Críticos - Tempo Real */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    Produtos Críticos
                    {produtosCriticos && produtosCriticos.resumo && (
                      <Badge variant="destructive" className="ml-2">
                        {produtosCriticos.resumo.totalProdutosCriticos}
                      </Badge>
                    )}
                  </CardTitle>
                  {isLoadingCriticos && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="animate-spin">⏳</div>
                      <span>Atualizando...</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {criticosError ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">Erro ao carregar produtos críticos</p>
                    <Button variant="outline" size="sm" className="mt-4" onClick={() => window.location.reload()}>
                      Tentar Novamente
                    </Button>
                  </div>
                ) : isLoadingCriticos ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex gap-3 p-3 rounded-lg bg-muted/30 animate-pulse">
                        <div className="w-10 h-10 rounded-lg bg-muted" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-3/4" />
                          <div className="h-3 bg-muted rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : produtosCriticos && produtosCriticos.produtos && produtosCriticos.produtos.length > 0 ? (
                  <div className="space-y-3">
                    {produtosCriticos.produtos.slice(0, 5).map((produto, index) => (
                      <div 
                        key={index} 
                        className="flex gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 cursor-pointer transition-all duration-200 hover:scale-[1.02] group border-l-4 border-destructive"
                        onClick={() => navigate('/inventory')}
                      >
                        <div className="p-2 rounded-lg transition-all duration-200 group-hover:scale-110 text-destructive bg-destructive/10">
                          <Package className="h-4 w-4 group-hover:animate-pulse" />
                        </div>
                        <div className="flex-1 space-y-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-medium text-sm group-hover:text-foreground transition-colors truncate">
                              {produto.nomeProduto}
                            </p>
                            <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                          </div>
                          <p className="text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors">
                            {produto.categoria} • Estoque: {produto.estoqueAtual} / Mínimo: {produto.estoqueMinimo}
                          </p>
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs text-muted-foreground truncate">{produto.fornecedor}</p>
                            <Badge variant="destructive" className="text-xs flex-shrink-0">
                              Déficit: {produto.deficit}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {produtosCriticos.produtos.length > 5 && (
                      <Button 
                        variant="outline" 
                        className="w-full mt-2"
                        onClick={() => navigate('/inventory')}
                      >
                        Ver Todos ({produtosCriticos.produtos.length} produtos)
                      </Button>
                    )}
                    
                    {/* Resumo Estatístico */}
                    {produtosCriticos.resumo && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="flex items-center justify-between p-2 rounded bg-destructive/10">
                            <span className="text-muted-foreground">Críticos:</span>
                            <span className="font-bold text-destructive">{produtosCriticos.resumo.criticos}</span>
                          </div>
                          <div className="flex items-center justify-between p-2 rounded bg-warning/10">
                            <span className="text-muted-foreground">Urgentes:</span>
                            <span className="font-bold text-warning">{produtosCriticos.resumo.urgentes}</span>
                          </div>
                          <div className="flex items-center justify-between p-2 rounded bg-primary/10 col-span-2">
                            <span className="text-muted-foreground">Valor Total Reposição:</span>
                            <span className="font-bold text-primary">
                              R$ {produtosCriticos.resumo.valorTotalReposicao?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-success mx-auto mb-4" />
                    <p className="text-sm font-medium text-success">Nenhum produto crítico!</p>
                    <p className="text-xs text-muted-foreground mt-2">Todos os produtos estão com estoque adequado</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions - Escondido em mobile pois as páginas não são acessíveis */}
      <Card className="animate-fade-in hidden md:block" style={{ animationDelay: '0.8s' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-3 hover:scale-105 hover:shadow-lg transition-all duration-200 group"
              onClick={handleNewSale}
            >
              <ShoppingCart className="h-6 w-6 group-hover:text-primary transition-colors" />
              <span className="text-sm font-medium">Nova Venda</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-3 hover:scale-105 hover:shadow-lg transition-all duration-200 group"
              onClick={handleNewProduct}
            >
              <Package className="h-6 w-6 group-hover:text-primary transition-colors" />
              <span className="text-sm font-medium">Cadastrar Produto</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-3 hover:scale-105 hover:shadow-lg transition-all duration-200 group"
              onClick={handleNewCustomer}
            >
              <Users className="h-6 w-6 group-hover:text-primary transition-colors" />
              <span className="text-sm font-medium">Novo Cliente</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-3 hover:scale-105 hover:shadow-lg transition-all duration-200 group"
              onClick={handleViewReports}
            >
              <FileText className="h-6 w-6 group-hover:text-primary transition-colors" />
              <span className="text-sm font-medium">Relatórios</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}