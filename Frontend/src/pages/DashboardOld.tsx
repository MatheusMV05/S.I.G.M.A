import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SigmaLogo } from '@/components/SigmaLogo';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  Calendar,
  Users,
  BarChart3,
} from 'lucide-react';

// Mock data para métricas
const mockMetrics = {
  dailyRevenue: 15420.50,
  averageTicket: 87.30,
  lowStockItems: 12,
  dailySales: 176,
  weeklyGrowth: 8.2,
  monthlyCustomers: 1247,
};

// Mock data para produtos em destaque
const mockTopProducts = [
  { name: 'Arroz Branco 5kg', sales: 45, revenue: 1350.00 },
  { name: 'Coca-Cola 2L', sales: 89, revenue: 2225.00 },
  { name: 'Pão Francês kg', sales: 156, revenue: 936.00 },
  { name: 'Leite Integral 1L', sales: 67, revenue: 335.00 },
];

// Mock data para alertas
const mockAlerts = [
  { type: 'stock', message: 'Açúcar Cristal está com estoque baixo', priority: 'high' },
  { type: 'expiry', message: '8 produtos vencem em 3 dias', priority: 'medium' },
  { type: 'promotion', message: 'Promoção de Natal termina em 5 dias', priority: 'low' },
];

export default function Dashboard() {
  const { user } = useAuth();

  const getRoleSpecificContent = () => {
    switch (user?.role) {
      case 'cashier':
        return <CashierDashboard />;
      case 'stock':
        return <StockDashboard />;
      default:
        return <AdminSupervisorDashboard />;
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <SigmaLogo size="md" />
            <h1 className="text-4xl font-black text-foreground tracking-tight">
              Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground font-medium">
            Bem-vindo(a), <span className="text-foreground font-semibold">{user?.name}</span>! Visão geral do sistema.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg px-4 py-2">
          <Calendar className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-foreground">
            {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      {getRoleSpecificContent()}
    </div>
  );
}

// Dashboard para Administrador e Supervisor
function AdminSupervisorDashboard() {
  return (
    <>
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Faturamento do Dia"
          value={`R$ ${mockMetrics.dailyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          change="+12.5%"
          changeType="positive"
          icon={<DollarSign className="h-5 w-5" />}
        />
        <MetricCard
          title="Ticket Médio"
          value={`R$ ${mockMetrics.averageTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          change="+3.2%"
          changeType="positive"
          icon={<ShoppingCart className="h-5 w-5" />}
        />
        <MetricCard
          title="Vendas do Dia"
          value={mockMetrics.dailySales.toString()}
          change="+8.1%"
          changeType="positive"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <MetricCard
          title="Estoque Baixo"
          value={mockMetrics.lowStockItems.toString()}
          change="-2"
          changeType="negative"
          icon={<AlertTriangle className="h-5 w-5" />}
        />
      </div>

      {/* Gráficos e Listas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Produtos Mais Vendidos */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Produtos Mais Vendidos (Hoje)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTopProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sales} unidades vendidas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">
                      R$ {product.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alertas e Ações Rápidas */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Alertas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockAlerts.map((alert, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    alert.priority === 'high' ? 'bg-destructive' :
                    alert.priority === 'medium' ? 'bg-warning' : 'bg-primary'
                  }`} />
                  <p className="text-sm text-foreground flex-1">{alert.message}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Package className="h-4 w-4 mr-2" />
                Cadastrar Produto
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Novo Cliente
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Ver Relatórios
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

// Dashboard para Operador de Caixa
function CashierDashboard() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="text-center">
        <CardContent className="pt-6">
          <ShoppingCart className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Sistema de Vendas
          </h2>
          <p className="text-muted-foreground mb-6">
            Clique no botão abaixo para iniciar uma nova venda
          </p>
          <Button variant="hero" size="xl" className="w-full max-w-sm">
            <ShoppingCart className="h-6 w-6 mr-3" />
            Iniciar Ponto de Venda
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        <MetricCard
          title="Vendas Hoje"
          value="23"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <MetricCard
          title="Total Vendido"
          value="R$ 2.840,50"
          icon={<DollarSign className="h-5 w-5" />}
        />
      </div>
    </div>
  );
}

// Dashboard para Estoquista
function StockDashboard() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Produtos em Falta"
          value="3"
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        <MetricCard
          title="Estoque Baixo"
          value="12"
          icon={<Package className="h-5 w-5" />}
        />
        <MetricCard
          title="Próximos ao Vencimento"
          value="8"
          icon={<Calendar className="h-5 w-5" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tarefas Pendentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Badge variant="destructive">Urgente</Badge>
                <span className="text-foreground">Repor Açúcar Cristal - Prateleira A3</span>
              </div>
              <Button size="sm">Marcar como Feito</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Badge variant="outline">Normal</Badge>
                <span className="text-foreground">Verificar validade - Seção Laticínios</span>
              </div>
              <Button size="sm" variant="outline">Verificar</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

// Componente de Card de Métrica
interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative';
  icon: React.ReactNode;
}

function MetricCard({ title, value, change, changeType, icon }: MetricCardProps) {
  return (
    <Card className="metric-card bg-gradient-to-br from-card to-card/50 border-border/30 hover:border-primary/20 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-2">
            <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">{title}</p>
            <p className="text-3xl font-black text-foreground tracking-tight">{value}</p>
            {change && (
              <div className="flex items-center gap-1">
                <TrendingUp className={`h-3 w-3 ${changeType === 'positive' ? 'text-success' : 'text-destructive'}`} />
                <p className={`text-xs font-semibold ${changeType === 'positive' ? 'text-success' : 'text-destructive'}`}>
                  {change} vs. ontem
                </p>
              </div>
            )}
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}