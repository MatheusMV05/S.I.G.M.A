import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
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
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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

type ReportType = 'sales' | 'inventory' | 'customers' | 'financial';

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
        <TabsList className="grid w-full grid-cols-4">
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
      </Tabs>
    </div>
  );
}