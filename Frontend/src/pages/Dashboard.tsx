import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useDashboardKPIs, useDailyRevenue, useTopProducts, useHourlySales, useSalesByCategory, useSalesStatistics, useSalesDistribution, useSalesByWeekday, usePaymentMethods, useReceitaLucroMensal } from '@/hooks/useReports';
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
  ArrowRight,
  TrendingDown as TrendingDownIcon,
  Award,
  Crown
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
  CartesianGrid,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend
} from 'recharts';

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
  const [selectedPeriod, setSelectedPeriod] = useState(30); // Filtro de período em dias
  
  // Buscar dados reais do backend
  const { data: dashboardKPIs, isLoading: isLoadingKPIs } = useDashboardKPIs();
  const { data: dailyRevenueData, isLoading: isLoadingRevenue } = useDailyRevenue(selectedPeriod);
  const { data: topProductsData, isLoading: isLoadingProducts } = useTopProducts(6);
  const { data: hourlySalesData, isLoading: isLoadingHourly } = useHourlySales();
  
  // Novos gráficos estatísticos
  const { data: salesByCategory, isLoading: isLoadingCategory } = useSalesByCategory();
  const { data: salesStats, isLoading: isLoadingStats } = useSalesStatistics(selectedPeriod);
  const { data: salesDistribution, isLoading: isLoadingDistribution } = useSalesDistribution(selectedPeriod);
  const { data: salesByWeekday, isLoading: isLoadingWeekday } = useSalesByWeekday(selectedPeriod);
  const { data: paymentMethods, isLoading: isLoadingPayments } = usePaymentMethods(selectedPeriod);
  const { data: receitaLucroMensal, isLoading: isLoadingReceitaLucro } = useReceitaLucroMensal(12);
  
  // Buscar produtos com estoque baixo (método antigo - será substituído)
  const { data: lowStockProducts, isLoading: isLoadingLowStock } = useLowStockProducts();

  // 🆕 Buscar produtos críticos com procedure SQL
  const { data: produtosCriticos, isLoading: isLoadingCriticos, error: criticosError } = useProdutosCriticos({
    refetchInterval: 30000 // Atualiza a cada 30 segundos
  });

  // Dados fallback para desenvolvimento (caso a API não esteja disponível)
  const fallbackKPIs = {
    todayRevenue: 0,
    yesterdayRevenue: 0,
    todaySales: 0,
    yesterdaySales: 0,
    averageTicket: 0,
    yesterdayAverageTicket: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    totalCustomers: 0,
    monthRevenue: 0,
    lastMonthRevenue: 0,
    monthlyGrowth: 0,
    weekRevenue: 0,
    lastWeekRevenue: 0,
    weeklyGrowth: 0,
    activePromotions: 0,
    customerRetention: 0,
  };

  // Usar dados reais ou fallback
  const kpis = dashboardKPIs || fallbackKPIs;

  // Calcular variações
  const revenueChange = kpis.yesterdayRevenue 
    ? ((kpis.todayRevenue - kpis.yesterdayRevenue) / kpis.yesterdayRevenue) * 100 
    : 0;
  
  const salesChange = kpis.yesterdaySales 
    ? ((kpis.todaySales - kpis.yesterdaySales) / kpis.yesterdaySales) * 100 
    : 0;

  const ticketChange = kpis.yesterdayAverageTicket 
    ? ((kpis.averageTicket - kpis.yesterdayAverageTicket) / kpis.yesterdayAverageTicket) * 100 
    : 0;

  // Funções de navegação
  const handleNewSale = () => navigate('/pos');
  const handleViewReports = () => navigate('/insights');
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
            Insights
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
          change={Math.round(ticketChange * 100) / 100}
          changeType={ticketChange >= 0 ? 'increase' : 'decrease'}
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <TabsList className="grid w-full sm:w-auto grid-cols-2 sm:grid-cols-4 gap-2">
            <TabsTrigger value="revenue" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Faturamento
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Produtos
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Estatísticas
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Atividade
            </TabsTrigger>
          </TabsList>
          
          {/* Filtro de Período */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Período:</label>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(Number(e.target.value))}
              className="px-3 py-1 rounded-md border border-border bg-background text-sm"
            >
              <option value={7}>7 dias</option>
              <option value={15}>15 dias</option>
              <option value={30}>30 dias</option>
              <option value={60}>60 dias</option>
              <option value={90}>90 dias</option>
            </select>
          </div>
        </div>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Gráfico de Faturamento */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Faturamento dos Últimos {selectedPeriod} Dias
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Exibindo apenas dias com vendas registradas
                </p>
              </CardHeader>
              <CardContent className="relative">
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={dailyRevenueData || []}>
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
                      formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Faturamento']}
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
                {isLoadingRevenue && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
                    <div className="text-sm text-muted-foreground">Carregando dados...</div>
                  </div>
                )}
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
                      <span className={`font-semibold ${kpis.weeklyGrowth >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {kpis.weeklyGrowth >= 0 ? '+' : ''}{kpis.weeklyGrowth.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={Math.min(Math.abs(kpis.weeklyGrowth), 100)} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Retenção de Clientes</span>
                      <span className="font-semibold text-primary">{kpis.customerRetention.toFixed(1)}%</span>
                    </div>
                    <Progress value={kpis.customerRetention} className="h-2" />
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
                      <p className="text-2xl font-bold">{kpis.activePromotions}</p>
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
                      data={topProductsData || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="sales"
                    >
                      {(topProductsData || []).map((entry, index) => (
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
                  {(topProductsData || []).slice(0, 3).map((product, index) => (
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
                  {isLoadingProducts && (
                    <div className="text-center text-sm text-muted-foreground py-4">
                      Carregando produtos...
                    </div>
                  )}
                  {!isLoadingProducts && (!topProductsData || topProductsData.length === 0) && (
                    <div className="text-center text-sm text-muted-foreground py-4">
                      Nenhum produto vendido nos últimos 30 dias
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Ranking de Produtos */}
            <Card>
              <CardHeader>
                <CardTitle>Ranking Completo</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingProducts ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 animate-pulse">
                        <div className="w-8 h-8 rounded-full bg-muted" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-3/4" />
                          <div className="h-3 bg-muted rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : !topProductsData || topProductsData.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">Nenhum produto vendido nos últimos 30 dias</p>
                  </div>
                ) : (
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
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Nova Aba: Estatísticas com Análises Avançadas */}
        <TabsContent value="statistics" className="space-y-6">
          {/* Indicadores Estatísticos */}
          {salesStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Média</p>
                  <p className="text-2xl font-bold text-primary">R$ {salesStats.mean?.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Ticket médio</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Mediana</p>
                  <p className="text-2xl font-bold text-primary">R$ {salesStats.median?.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Valor central</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Desvio Padrão</p>
                  <p className="text-2xl font-bold text-warning">R$ {salesStats.stdDev?.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Dispersão</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Amplitude</p>
                  <p className="text-2xl font-bold text-success">R$ {(salesStats.max - salesStats.min)?.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Max - Min</p>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Gráfico 1: Distribuição de Frequência de Vendas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Distribuição de Vendas por Faixa
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesDistribution || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                    <XAxis dataKey="range" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1a1a', 
                        border: '1px solid #333',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="frequency" fill="#9333FF" radius={[4, 4, 0, 0]}>
                      {(salesDistribution || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${280 + index * 20}, 70%, 50%)`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                {isLoadingDistribution && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
                    <div className="text-sm text-muted-foreground">Carregando distribuição...</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Gráfico 2: Vendas por Dia da Semana (Radar) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-success" />
                  Vendas por Dia da Semana
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={salesByWeekday || []}>
                    <PolarGrid stroke="#333" />
                    <PolarAngleAxis dataKey="weekday" stroke="#888" />
                    <PolarRadiusAxis stroke="#888" />
                    <Radar 
                      name="Vendas" 
                      dataKey="salesCount" 
                      stroke="#00FF7F" 
                      fill="#00FF7F" 
                      fillOpacity={0.6} 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1a1a', 
                        border: '1px solid #333',
                        borderRadius: '8px'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
                {isLoadingWeekday && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
                    <div className="text-sm text-muted-foreground">Carregando dados...</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Gráfico 3: Vendas por Categoria */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-warning" />
                  Faturamento por Categoria
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={salesByCategory || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="revenue"
                    >
                      {(salesByCategory || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1a1a', 
                        border: '1px solid #333',
                        borderRadius: '8px'
                      }}
                      formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Faturamento']}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {isLoadingCategory && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
                    <div className="text-sm text-muted-foreground">Carregando categorias...</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Gráfico 4: Métodos de Pagamento */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Preferência de Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={paymentMethods || []} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                    <XAxis type="number" stroke="#888" />
                    <YAxis dataKey="method" type="category" stroke="#888" width={100} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1a1a', 
                        border: '1px solid #333',
                        borderRadius: '8px'
                      }}
                      formatter={(value) => [`${value} vendas`, 'Quantidade']}
                    />
                    <Bar dataKey="count" fill="#FF33CC" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                {isLoadingPayments && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
                    <div className="text-sm text-muted-foreground">Carregando métodos...</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Insights Estatísticos */}
          {salesStats && (
            <Card>
              <CardHeader>
                <CardTitle>Insights Estatísticos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/30">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-success" />
                      Variabilidade dos Dados
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      O desvio padrão de <strong>R$ {salesStats.stdDev?.toFixed(2)}</strong> indica {
                        salesStats.stdDev > salesStats.mean * 0.5 
                          ? 'alta variabilidade nas vendas' 
                          : 'vendas relativamente consistentes'
                      }.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      Concentração de Valores
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      A diferença entre média (R$ {salesStats.mean?.toFixed(2)}) e mediana (R$ {salesStats.median?.toFixed(2)}) é de <strong>R$ {Math.abs(salesStats.mean - salesStats.median).toFixed(2)}</strong>, {
                        Math.abs(salesStats.mean - salesStats.median) < salesStats.mean * 0.1
                          ? 'indicando distribuição simétrica'
                          : 'indicando presença de valores atípicos'
                      }.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          {/* Métricas Financeiras Avançadas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Receita Total</p>
                    <p className="text-2xl font-bold text-success">R$ {kpis.monthRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-success" />
                      <span className="text-sm text-success font-medium">+{kpis.monthlyGrowth.toFixed(1)}%</span>
                    </div>
                  </div>
                  <DollarSign className="h-8 w-8 text-success" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Lucro Estimado</p>
                    <p className="text-2xl font-bold text-primary">R$ {(kpis.monthRevenue * 0.297).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-success" />
                      <span className="text-sm text-success font-medium">+2.1%</span>
                    </div>
                  </div>
                  <Award className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Margem</p>
                    <p className="text-2xl font-bold">29.7%</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-success" />
                      <span className="text-sm text-success font-medium">+2.1%</span>
                    </div>
                  </div>
                  <Target className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico Receita vs Lucro */}
          <Card>
            <CardHeader>
              <CardTitle>Receita vs Lucro - Últimos 12 Meses</CardTitle>
              {(!receitaLucroMensal || receitaLucroMensal.length === 0) && (
                <p className="text-xs text-muted-foreground mt-1">
                  Aguardando dados - Registre vendas em diferentes meses
                </p>
              )}
            </CardHeader>
            <CardContent className="relative">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={receitaLucroMensal || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a1a', 
                      border: '1px solid #333',
                      borderRadius: '8px'
                    }}
                    formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, '']}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="vendas" 
                    name="Receita"
                    stackId="1"
                    stroke="#9333ea" 
                    fill="#9333ea" 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="lucro" 
                    name="Lucro"
                    stackId="2"
                    stroke="#ec4899" 
                    fill="#ec4899" 
                    fillOpacity={0.8}
                  />
                </AreaChart>
              </ResponsiveContainer>
              {isLoadingReceitaLucro && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
                  <div className="text-sm text-muted-foreground">Carregando dados...</div>
                </div>
              )}
              {!isLoadingReceitaLucro && (!receitaLucroMensal || receitaLucroMensal.length === 0) && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
                  <div className="text-center text-sm text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum dado disponível</p>
                    <p className="text-xs mt-1">Registre vendas em diferentes meses</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Métricas de Clientes por Segmento */}
          <Card>
            <CardHeader>
              <CardTitle>Segmentação de Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { segment: 'VIP', customers: 45, revenue: 125000, avgTicket: 2777.78, color: 'border-purple-500' },
                  { segment: 'Premium', customers: 128, revenue: 89600, avgTicket: 700.00, color: 'border-blue-500' },
                  { segment: 'Regular', customers: 456, revenue: 164160, avgTicket: 360.00, color: 'border-green-500' },
                  { segment: 'Básico', customers: 892, revenue: 134280, avgTicket: 150.50, color: 'border-gray-500' }
                ].map((segment) => (
                  <div key={segment.segment} className={`p-4 border-l-4 ${segment.color} rounded-lg bg-muted/30`}>
                    <div className="text-center space-y-2">
                      <Badge variant="outline" className="mb-2">{segment.segment}</Badge>
                      <p className="text-2xl font-bold">{segment.customers}</p>
                      <p className="text-sm text-muted-foreground">clientes</p>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-success">
                          R$ {segment.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Ticket: R$ {segment.avgTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Vendas por Hora */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Vendas por Hora - Hoje</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={hourlySalesData || []}>
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
                {isLoadingHourly && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
                    <div className="text-sm text-muted-foreground">Carregando dados...</div>
                  </div>
                )}
                {!isLoadingHourly && (!hourlySalesData || hourlySalesData.length === 0) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
                    <div className="text-sm text-muted-foreground">Nenhuma venda registrada hoje</div>
                  </div>
                )}
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
              <span className="text-sm font-medium">Insights</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}