import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { FileText, TrendingUp, Users, Package, Calendar, Download } from 'lucide-react';

// Mock data for charts
const salesData = [
  { day: 'Seg', sales: 12500 },
  { day: 'Ter', sales: 15300 },
  { day: 'Qua', sales: 11800 },
  { day: 'Qui', sales: 18200 },
  { day: 'Sex', sales: 22100 },
  { day: 'Sáb', sales: 25400 },
  { day: 'Dom', sales: 19800 }
];

const topProducts = [
  { name: 'Arroz', sales: 850, value: 15300 },
  { name: 'Feijão', sales: 620, value: 4650 },
  { name: 'Açúcar', sales: 540, value: 2700 },
  { name: 'Óleo', sales: 480, value: 3360 },
  { name: 'Leite', sales: 720, value: 3240 }
];

const categoryData = [
  { name: 'Grãos', value: 35, color: '#8B5CF6' },
  { name: 'Laticínios', value: 25, color: '#10B981' },
  { name: 'Bebidas', value: 20, color: '#F59E0B' },
  { name: 'Limpeza', value: 12, color: '#EF4444' },
  { name: 'Outros', value: 8, color: '#6B7280' }
];

const cashierSales = [
  { name: 'Maria Santos', sales: 85, total: 45200 },
  { name: 'João Silva', sales: 72, total: 38900 },
  { name: 'Ana Costa', sales: 68, total: 35600 },
  { name: 'Pedro Lima', sales: 55, total: 28400 }
];

const promotionData = [
  { period: 'Antes', sales: 120 },
  { period: 'Durante', sales: 380 },
  { period: 'Depois', sales: 150 }
];

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedCashier, setSelectedCashier] = useState('');
  const [selectedPromotion, setSelectedPromotion] = useState('');
  const [customerCpf, setCustomerCpf] = useState('');
  const [supplierName, setSupplierName] = useState('');

  const exportReport = (reportType: string) => {
    // Simular export de relatório
    console.log(`Exportando relatório: ${reportType}`);
    // Aqui seria implementada a lógica de export para PDF/Excel
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Relatórios
          </h1>
          <p className="text-muted-foreground">Análises e relatórios gerenciais</p>
        </div>
      </div>

      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="sales">Faturamento</TabsTrigger>
          <TabsTrigger value="cashiers">Operadores</TabsTrigger>
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="promotions">Promoções</TabsTrigger>
          <TabsTrigger value="customers">Clientes</TabsTrigger>
          <TabsTrigger value="suppliers">Fornecedores</TabsTrigger>
        </TabsList>

        {/* Relatório de Faturamento */}
        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">R$ 127.650</p>
                    <p className="text-sm text-muted-foreground">Faturamento da Semana</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <div>
                    <p className="text-2xl font-bold">R$ 18.236</p>
                    <p className="text-sm text-muted-foreground">Média Diária</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-warning" />
                  <div>
                    <p className="text-2xl font-bold">R$ 85,40</p>
                    <p className="text-sm text-muted-foreground">Ticket Médio</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-secondary" />
                  <div>
                    <p className="text-2xl font-bold">1.495</p>
                    <p className="text-sm text-muted-foreground">Vendas Realizadas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Faturamento por Dia</CardTitle>
                <div className="flex gap-2">
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Esta Semana</SelectItem>
                      <SelectItem value="month">Este Mês</SelectItem>
                      <SelectItem value="quarter">Trimestre</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={() => exportReport('faturamento')}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`R$ ${value}`, 'Faturamento']} />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Relatório de Operadores */}
        <TabsContent value="cashiers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ranking de Vendas por Operador</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Posição</TableHead>
                    <TableHead>Operador</TableHead>
                    <TableHead>Vendas Realizadas</TableHead>
                    <TableHead>Faturamento Total</TableHead>
                    <TableHead>Ticket Médio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cashierSales.map((cashier, index) => (
                    <TableRow key={cashier.name}>
                      <TableCell className="font-bold">{index + 1}º</TableCell>
                      <TableCell className="font-medium">{cashier.name}</TableCell>
                      <TableCell>{cashier.sales}</TableCell>
                      <TableCell>R$ {cashier.total.toLocaleString()}</TableCell>
                      <TableCell>R$ {(cashier.total / cashier.sales).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Relatório de Produtos */}
        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Produtos Mais Vendidos</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Qtd Vendida</TableHead>
                      <TableHead>Faturamento</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topProducts.map((product) => (
                      <TableRow key={product.name}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.sales} un</TableCell>
                        <TableCell>R$ {product.value.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

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
                      outerRadius={100}
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
        </TabsContent>

        {/* Relatório de Promoções */}
        <TabsContent value="promotions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Impacto das Promoções</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="promotion">Selecionar Promoção</Label>
                  <Select value={selectedPromotion} onValueChange={setSelectedPromotion}>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha uma promoção" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="promo1">Promoção Arroz - 15% OFF</SelectItem>
                      <SelectItem value="promo2">Combo Feira - 20% OFF</SelectItem>
                      <SelectItem value="promo3">Liquidação Limpeza - 25% OFF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {selectedPromotion && (
                <div className="mt-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={promotionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Relatório de Clientes */}
        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Compras do Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="customerCpf">CPF do Cliente</Label>
                  <Input
                    id="customerCpf"
                    placeholder="000.000.000-00"
                    value={customerCpf}
                    onChange={(e) => setCustomerCpf(e.target.value)}
                  />
                </div>
                <Button className="mt-6">
                  Buscar Histórico
                </Button>
              </div>
              
              {/* Aqui seria exibido o histórico quando um cliente for selecionado */}
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Digite um CPF para ver o histórico de compras</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Relatório de Fornecedores */}
        <TabsContent value="suppliers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Pedidos a Fornecedores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="supplier">Fornecedor</Label>
                  <Select value={supplierName} onValueChange={setSupplierName}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um fornecedor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="distribuidora-abc">Distribuidora ABC</SelectItem>
                      <SelectItem value="doce-distribuicao">Doce Distribuição</SelectItem>
                      <SelectItem value="fornecedor-xyz">Fornecedor XYZ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="mt-6">
                  Ver Histórico
                </Button>
              </div>
              
              {/* Aqui seria exibido o histórico quando um fornecedor for selecionado */}
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Selecione um fornecedor para ver o histórico de pedidos</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}