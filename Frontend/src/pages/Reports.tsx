import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { DesktopOnlyPage } from '@/components/DesktopOnlyPage';
import { Skeleton } from '@/components/ui/skeleton';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  Download,
  Printer,
  FileText,
  BarChart3,
  PieChart as PieChartIcon,
  Target,
  Clock,
  Award,
  AlertTriangle,
  CheckCircle,
  PackageX,
  Crown,
  ArrowUpCircle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProdutosNuncaVendidos, useProdutosAcimaMedia, useClientesVIP } from '@/hooks/useReports';

// Mock data para relatórios
const salesData = [
  { month: 'Jan', vendas: 45000, lucro: 12000, produtos: 520 },
  { month: 'Fev', vendas: 52000, lucro: 14500, produtos: 615 },
  { month: 'Mar', vendas: 48000, lucro: 13200, produtos: 580 },
  { month: 'Abr', vendas: 61000, lucro: 17800, produtos: 720 },
  { month: 'Mai', vendas: 55000, lucro: 15200, produtos: 650 },
  { month: 'Jun', vendas: 67000, lucro: 19500, produtos: 780 },
  { month: 'Jul', vendas: 58000, lucro: 16100, produtos: 680 },
  { month: 'Ago', vendas: 71000, lucro: 20800, produtos: 820 },
  { month: 'Set', vendas: 63000, lucro: 18200, produtos: 740 },
  { month: 'Out', vendas: 69000, lucro: 19800, produtos: 800 },
  { month: 'Nov', vendas: 74000, lucro: 21600, produtos: 860 },
  { month: 'Dez', vendas: 82000, lucro: 24500, produtos: 950 }
];

const categoryData = [
  { name: 'Grãos e Cereais', value: 35, color: '#9333ea' },
  { name: 'Bebidas', value: 28, color: '#ec4899' },
  { name: 'Laticínios', value: 18, color: '#06b6d4' },
  { name: 'Carnes', value: 12, color: '#10b981' },
  { name: 'Limpeza', value: 7, color: '#f59e0b' }
];

const topProducts = [
  { id: 1, name: 'Arroz Branco 5kg', sales: 1250, revenue: 8750.00, growth: 12.5 },
  { id: 2, name: 'Feijão Preto 1kg', sales: 980, revenue: 6860.00, growth: 8.2 },
  { id: 3, name: 'Açúcar Cristal 1kg', sales: 876, revenue: 3504.00, growth: -2.1 },
  { id: 4, name: 'Óleo de Soja 900ml', sales: 754, revenue: 6032.00, growth: 15.3 },
  { id: 5, name: 'Leite Integral 1L', sales: 692, revenue: 4152.00, growth: 5.8 }
];

const customerMetrics = [
  { segment: 'VIP', customers: 45, revenue: 125000, avgTicket: 2777.78 },
  { segment: 'Premium', customers: 128, revenue: 89600, avgTicket: 700.00 },
  { segment: 'Regular', customers: 456, revenue: 164160, avgTicket: 360.00 },
  { segment: 'Básico', customers: 892, revenue: 134280, avgTicket: 150.50 }
];

type ReportType = 'sales' | 'inventory' | 'customers' | 'financial' | 'insights';

export default function Reports() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ReportType>('sales');
  const [dateRange, setDateRange] = useState('month');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  return (
    <DesktopOnlyPage
      title="Relatórios e Analytics"
      description="Sistema completo de relatórios com gráficos, tabelas e análises detalhadas de performance."
      features={[
        "Gráficos interativos e dashboards avançados",
        "Relatórios de vendas, estoque e clientes",
        "Análises financeiras e de performance",
        "Exportação para PDF e Excel",
        "Filtros avançados por período e categoria",
        "Métricas de KPI em tempo real",
        "Comparativos históricos e tendências"
      ]}
    >
      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatórios e Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Análises detalhadas e insights de performance
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mês</SelectItem>
              <SelectItem value="quarter">Este Trimestre</SelectItem>
              <SelectItem value="year">Este Ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vendas do Mês</p>
                <p className="text-2xl font-bold">R$ 82.500</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-success" />
                  <span className="text-sm text-success font-medium">+12.5%</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Produtos Vendidos</p>
                <p className="text-2xl font-bold">1.245</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-success" />
                  <span className="text-sm text-success font-medium">+8.2%</span>
                </div>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Novos Clientes</p>
                <p className="text-2xl font-bold">89</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-success" />
                  <span className="text-sm text-success font-medium">+15.3%</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ticket Médio</p>
                <p className="text-2xl font-bold">R$ 66,27</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3 text-destructive" />
                  <span className="text-sm text-destructive font-medium">-2.1%</span>
                </div>
              </div>
              <Target className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ReportType)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Vendas
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Estoque
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Clientes
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Financeiro
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        {/* Relatório de Vendas */}
        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Vendas */}
            <Card>
              <CardHeader>
                <CardTitle>Evolução das Vendas</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Area 
                      type="monotone" 
                      dataKey="vendas" 
                      stroke="#9333ea" 
                      fill="#9333ea" 
                      fillOpacity={0.1}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Vendas por Categoria */}
            <Card>
              <CardHeader>
                <CardTitle>Vendas por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Produtos */}
          <Card>
            <CardHeader>
              <CardTitle>Produtos Mais Vendidos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Vendas</TableHead>
                    <TableHead>Receita</TableHead>
                    <TableHead>Crescimento</TableHead>
                    <TableHead>Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.sales} unidades</TableCell>
                      <TableCell className="font-semibold text-success">
                        {formatCurrency(product.revenue)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {product.growth > 0 ? (
                            <TrendingUp className="h-3 w-3 text-success" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-destructive" />
                          )}
                          <span className={product.growth > 0 ? 'text-success' : 'text-destructive'}>
                            {formatPercent(product.growth)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={Math.abs(product.growth) * 5} 
                            className="h-2 w-16" 
                          />
                          <Badge variant={product.growth > 10 ? 'default' : product.growth > 0 ? 'secondary' : 'destructive'}>
                            {product.growth > 10 ? 'Excelente' : product.growth > 0 ? 'Bom' : 'Atenção'}
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Relatório de Estoque */}
        <TabsContent value="inventory" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total de Produtos</p>
                    <p className="text-2xl font-bold">1.247</p>
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
                    <p className="text-2xl font-bold text-warning">23</p>
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
                    <p className="text-2xl font-bold text-destructive">7</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de Movimentação */}
          <Card>
            <CardHeader>
              <CardTitle>Movimentação de Estoque</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="produtos" fill="#9333ea" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Produtos com Estoque Baixo */}
          <Card>
            <CardHeader>
              <CardTitle>Produtos com Estoque Baixo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Açúcar Refinado 1kg', current: 5, min: 20, status: 'critical' },
                  { name: 'Óleo de Girassol 900ml', current: 12, min: 25, status: 'warning' },
                  { name: 'Macarrão Espaguete 500g', current: 18, min: 30, status: 'warning' },
                  { name: 'Detergente Líquido', current: 8, min: 15, status: 'critical' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Estoque atual: {item.current} | Mínimo: {item.min}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress 
                        value={(item.current / item.min) * 100} 
                        className="w-24 h-2"
                      />
                      <Badge variant={item.status === 'critical' ? 'destructive' : 'secondary'}>
                        {item.status === 'critical' ? 'Crítico' : 'Baixo'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Relatório de Clientes */}
        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {customerMetrics.map((segment) => (
              <Card key={segment.segment}>
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <Badge variant="outline" className="mb-2">{segment.segment}</Badge>
                    <p className="text-2xl font-bold">{segment.customers}</p>
                    <p className="text-sm text-muted-foreground">clientes</p>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-success">
                        {formatCurrency(segment.revenue)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Ticket: {formatCurrency(segment.avgTicket)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Gráfico de Crescimento de Clientes */}
          <Card>
            <CardHeader>
              <CardTitle>Crescimento da Base de Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="produtos" 
                    stroke="#9333ea" 
                    strokeWidth={3}
                    dot={{ fill: '#9333ea', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Relatório Financeiro */}
        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Receita Total</p>
                    <p className="text-2xl font-bold text-success">R$ 82.500</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-success" />
                      <span className="text-sm text-success font-medium">+12.5%</span>
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
                    <p className="text-sm font-medium text-muted-foreground">Lucro Bruto</p>
                    <p className="text-2xl font-bold text-primary">R$ 24.500</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-success" />
                      <span className="text-sm text-success font-medium">+15.2%</span>
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

          {/* Gráfico de Receita vs Lucro */}
          <Card>
            <CardHeader>
              <CardTitle>Receita vs Lucro</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Area 
                    type="monotone" 
                    dataKey="vendas" 
                    stackId="1"
                    stroke="#9333ea" 
                    fill="#9333ea" 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="lucro" 
                    stackId="2"
                    stroke="#ec4899" 
                    fill="#ec4899" 
                    fillOpacity={0.8}
                  />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Análise de Custos */}
          <Card>
            <CardHeader>
              <CardTitle>Análise de Custos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { category: 'Custo dos Produtos', value: 58000, percentage: 70.3, color: 'bg-primary' },
                  { category: 'Funcionários', value: 12000, percentage: 14.5, color: 'bg-blue-500' },
                  { category: 'Operacionais', value: 8500, percentage: 10.3, color: 'bg-green-500' },
                  { category: 'Marketing', value: 2800, percentage: 3.4, color: 'bg-orange-500' },
                  { category: 'Outros', value: 1200, percentage: 1.5, color: 'bg-gray-500' }
                ].map((cost, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${cost.color}`} />
                      <span className="font-medium">{cost.category}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Progress value={cost.percentage} className="w-24 h-2" />
                      <div className="text-right min-w-[120px]">
                        <p className="font-semibold">{formatCurrency(cost.value)}</p>
                        <p className="text-sm text-muted-foreground">{cost.percentage}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feature #6: Insights - Relatórios Avançados */}
        <TabsContent value="insights" className="space-y-6">
          <InsightsTab />
        </TabsContent>
      </Tabs>
    </div>
  </DesktopOnlyPage>
);
}

// ================================================================
// Feature #6: Componente de Insights
// ================================================================
function InsightsTab() {
  const { data: produtosNuncaVendidos, isLoading: loadingNuncaVendidos, refetch: refetchNuncaVendidos } = useProdutosNuncaVendidos(20);
  const { data: produtosAcimaMedia, isLoading: loadingAcimaMedia, refetch: refetchAcimaMedia } = useProdutosAcimaMedia(15);
  const { data: clientesVIP, isLoading: loadingVIP, refetch: refetchVIP } = useClientesVIP(15);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header com descrição */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">🔍 Insights Avançados de Negócio</h3>
              <p className="text-sm text-purple-700">
                Análises inteligentes que identificam oportunidades, riscos e clientes estratégicos para 
                melhorar a gestão do seu negócio.
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                refetchNuncaVendidos();
                refetchAcimaMedia();
                refetchVIP();
              }}
              className="border-purple-300 hover:bg-purple-100"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Produtos Nunca Vendidos (ANTI JOIN) */}
        <Card className="border-orange-200 flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <PackageX className="h-5 w-5 text-orange-600" />
              Produtos Nunca Vendidos
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Produtos em estoque que nunca geraram receita
            </p>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            {loadingNuncaVendidos ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : produtosNuncaVendidos && produtosNuncaVendidos.length > 0 ? (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-orange-50">
                {produtosNuncaVendidos.map((produto) => (
                  <div key={produto.idProduto} className="p-3 border rounded-lg hover:bg-orange-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm line-clamp-1">{produto.produtoNome}</p>
                        <p className="text-xs text-muted-foreground">{produto.categoriaNome}</p>
                      </div>
                      <Badge variant="destructive" className="text-xs">Parado</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Estoque:</span>
                        <p className="font-semibold">{produto.quantidadeEstoque} un</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Valor parado:</span>
                        <p className="font-semibold text-orange-600">{formatCurrency(produto.valorEstoqueParado)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <PackageX className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhum produto parado encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card 2: Produtos Acima da Média (SUBCONSULTA) */}
        <Card className="border-blue-200 flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ArrowUpCircle className="h-5 w-5 text-blue-600" />
              Produtos Premium
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Produtos com preços acima da média da categoria
            </p>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            {loadingAcimaMedia ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : produtosAcimaMedia && produtosAcimaMedia.length > 0 ? (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-50">
                {produtosAcimaMedia.map((produto) => (
                  <div key={produto.idProduto} className="p-3 border rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm line-clamp-1">{produto.produtoNome}</p>
                        <p className="text-xs text-muted-foreground">{produto.categoriaNome}</p>
                      </div>
                      <Badge variant="default" className="text-xs bg-blue-600">
                        +{produto.percentualAcimaMedia.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Preço:</span>
                        <p className="font-semibold text-blue-600">{formatCurrency(produto.precoVenda)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Acima em:</span>
                        <p className="font-semibold">{formatCurrency(produto.diferencaMedia)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <ArrowUpCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhum produto premium encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card 3: Clientes VIP (SUBCONSULTA) */}
        <Card className="border-purple-200 flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Crown className="h-5 w-5 text-purple-600" />
              Clientes VIP
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Clientes com gastos acima da média geral
            </p>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            {loadingVIP ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : clientesVIP && clientesVIP.length > 0 ? (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-50">
                {clientesVIP.map((cliente) => (
                  <div key={cliente.idCliente} className="p-3 border rounded-lg hover:bg-purple-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm line-clamp-1">{cliente.clienteNome}</p>
                        <p className="text-xs text-muted-foreground">{cliente.totalCompras} compras</p>
                      </div>
                      <Crown className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Total gasto:</span>
                        <p className="font-semibold text-purple-600">{formatCurrency(cliente.valorTotalGasto)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Ticket médio:</span>
                        <p className="font-semibold">{formatCurrency(cliente.ticketMedio)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Crown className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhum cliente VIP encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}