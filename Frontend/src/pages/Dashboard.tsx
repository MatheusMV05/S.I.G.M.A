import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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

// Mock KPIs data com dados realistas
const dashboardKPIs = {
  todayRevenue: 18750.40,
  yesterdayRevenue: 16420.30,
  averageTicket: 94.25,
  avgTicketChange: 12.5,
  todaySales: 198,
  yesterdaySales: 176,
  lowStockItems: 15,
  totalProducts: 2847,
  activePromotions: 8,
  weeklyGrowth: 15.8,
  monthlyCustomers: 1568,
  customerRetention: 78.5
};

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

// Alertas e notificações
const alerts = [
  { 
    id: 1, 
    type: 'stock', 
    icon: Package, 
    title: 'Estoque Baixo', 
    message: '15 produtos estão abaixo do nível mínimo', 
    priority: 'high',
    time: '5 min atrás'
  },
  { 
    id: 2, 
    type: 'expiry', 
    icon: Clock, 
    title: 'Produtos Próximos do Vencimento', 
    message: '23 itens vencem nos próximos 5 dias', 
    priority: 'medium',
    time: '1 hora atrás'
  },
  { 
    id: 3, 
    type: 'promotion', 
    icon: Target, 
    title: 'Promoção Ativa', 
    message: 'Promoção "Black Week" com 78% de adesão', 
    priority: 'low',
    time: '2 horas atrás'
  }
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
    <Card className="transition-all duration-300 hover:shadow-xl hover:scale-[1.05] cursor-pointer group animate-fade-in border-border/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide group-hover:text-foreground transition-colors">
              {title}
            </p>
            <p className="text-3xl font-bold text-primary">
              {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
            </p>
            {subtitle && (
              <p className="text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors">
                {subtitle}
              </p>
            )}
            {change !== undefined && (
              <div className="flex items-center gap-1 animate-fade-in">
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 text-success animate-bounce" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive animate-bounce" />
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
          <div className={`p-3 rounded-xl transition-all duration-300 group-hover:scale-110 ${colorClasses[color as keyof typeof colorClasses] || colorClasses.primary}`}>
            <Icon className="h-6 w-6 group-hover:animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedAlert, setSelectedAlert] = useState<typeof alerts[0] | null>(null);

  const revenueChange = ((dashboardKPIs.todayRevenue - dashboardKPIs.yesterdayRevenue) / dashboardKPIs.yesterdayRevenue) * 100;
  const salesChange = ((dashboardKPIs.todaySales - dashboardKPIs.yesterdaySales) / dashboardKPIs.yesterdaySales) * 100;

  // Funções de navegação
  const handleNewSale = () => navigate('/pos');
  const handleViewReports = () => navigate('/reports');
  const handleNewProduct = () => navigate('/products');
  const handleNewCustomer = () => navigate('/customers');
  const handleViewInventory = () => navigate('/inventory');

  // Função para lidar com alertas
  const handleAlertAction = (alert: typeof alerts[0]) => {
    setSelectedAlert(alert);
    
    switch (alert.type) {
      case 'stock':
        navigate('/inventory');
        break;
      case 'expiry':
        navigate('/products');
        break;
      case 'promotion':
        navigate('/promotions');
        break;
      default:
        break;
    }
  };

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <KPICard
          title="Faturamento Hoje"
          value={`R$ ${dashboardKPIs.todayRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          change={Math.round(revenueChange * 100) / 100}
          changeType={revenueChange >= 0 ? 'increase' : 'decrease'}
          icon={DollarSign}
          color="success"
          subtitle="Meta: R$ 20.000,00"
        />
        
        <KPICard
          title="Ticket Médio"
          value={`R$ ${dashboardKPIs.averageTicket.toFixed(2)}`}
          change={dashboardKPIs.avgTicketChange}
          changeType="increase"
          icon={CreditCard}
          color="primary"
        />
        
        <KPICard
          title="Vendas Hoje"
          value={dashboardKPIs.todaySales}
          change={Math.round(salesChange * 100) / 100}
          changeType={salesChange >= 0 ? 'increase' : 'decrease'}
          icon={ShoppingCart}
          color="primary"
        />
        
        <KPICard
          title="Estoque Baixo"
          value={dashboardKPIs.lowStockItems}
          icon={AlertTriangle}
          color="warning"
          subtitle={`Total: ${dashboardKPIs.totalProducts} produtos`}
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
                      <span className="font-semibold text-success">+{dashboardKPIs.weeklyGrowth}%</span>
                    </div>
                    <Progress value={dashboardKPIs.weeklyGrowth} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Retenção de Clientes</span>
                      <span className="font-semibold text-primary">{dashboardKPIs.customerRetention}%</span>
                    </div>
                    <Progress value={dashboardKPIs.customerRetention} className="h-2" />
                  </div>

                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Clientes Ativos</span>
                      <span className="text-xl font-bold">{dashboardKPIs.monthlyCustomers}</span>
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
                      <p className="text-2xl font-bold">{dashboardKPIs.activePromotions}</p>
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

            {/* Alertas e Notificações */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Alertas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.map((alert) => {
                    const Icon = alert.icon;
                    const priorityColors = {
                      high: 'text-destructive bg-destructive/10',
                      medium: 'text-warning bg-warning/10',
                      low: 'text-primary bg-primary/10'
                    };
                    
                    return (
                      <div 
                        key={alert.id} 
                        className="flex gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 cursor-pointer transition-all duration-200 hover:scale-[1.02] group"
                        onClick={() => handleAlertAction(alert)}
                      >
                        <div className={`p-2 rounded-lg transition-all duration-200 group-hover:scale-110 ${priorityColors[alert.priority as keyof typeof priorityColors]}`}>
                          <Icon className="h-4 w-4 group-hover:animate-pulse" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm group-hover:text-foreground transition-colors">{alert.title}</p>
                            <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <p className="text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors">{alert.message}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">{alert.time}</p>
                            <Badge 
                              variant={alert.priority === 'high' ? 'destructive' : alert.priority === 'medium' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {alert.priority === 'high' ? 'Urgente' : alert.priority === 'medium' ? 'Médio' : 'Baixo'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
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