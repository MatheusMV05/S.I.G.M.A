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
import { Separator } from '@/components/ui/separator';
import {
  Users,
  UserPlus,
  Building,
  Truck,
  Tag,
  Percent,
  Plus,
  Edit,
  Trash2,
  Search,
  Eye,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Shield,
  Star,
  Package,
  DollarSign,
  TrendingUp,
  Clock,
  Filter,
  Download,
  Upload
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Mock data para funcionários
const mockEmployees = [
  {
    id: '1',
    name: 'João Silva Santos',
    email: 'joao.silva@comprebem.com',
    phone: '(11) 99999-1234',
    role: 'admin',
    department: 'Administração',
    hireDate: '2024-01-15',
    salary: 5500.00,
    status: 'active',
    userId: 'user1'
  },
  {
    id: '2',
    name: 'Maria Oliveira Costa',
    email: 'maria.costa@comprebem.com',
    phone: '(11) 88888-5678',
    role: 'supervisor',
    department: 'Vendas',
    hireDate: '2024-02-20',
    salary: 3800.00,
    status: 'active',
    userId: 'user2'
  },
  {
    id: '3',
    name: 'Pedro Mendes Lima',
    email: 'pedro.lima@comprebem.com',
    phone: '(11) 77777-9999',
    role: 'cashier',
    department: 'Vendas',
    hireDate: '2024-03-10',
    salary: 2200.00,
    status: 'active',
    userId: 'user3'
  }
];

// Mock data para fornecedores
const mockSuppliers = [
  {
    id: '1',
    name: 'Distribuidora Alimentos Ltda',
    cnpj: '12.345.678/0001-90',
    contact: 'Carlos Silva',
    email: 'contato@distralimentos.com.br',
    phone: '(11) 3333-4444',
    address: 'Rua Industrial, 123 - São Paulo/SP',
    category: 'Alimentos',
    status: 'active',
    contractDate: '2024-01-10',
    totalOrders: 45,
    totalValue: 125000.00
  },
  {
    id: '2',
    name: 'Bebidas Sul Distribuidora',
    cnpj: '98.765.432/0001-21',
    contact: 'Ana Santos',
    email: 'vendas@bebidassul.com.br',
    phone: '(11) 2222-3333',
    address: 'Av. das Bebidas, 456 - São Paulo/SP',
    category: 'Bebidas',
    status: 'active',
    contractDate: '2024-02-15',
    totalOrders: 28,
    totalValue: 85000.00
  }
];

// Mock data para categorias
const mockCategories = [
  {
    id: '1',
    name: 'Grãos e Cereais',
    description: 'Arroz, feijão, lentilha, quinoa, aveia',
    productsCount: 45,
    status: 'active',
    createdDate: '2024-01-10'
  },
  {
    id: '2',
    name: 'Bebidas',
    description: 'Refrigerantes, sucos, águas, energéticos',
    productsCount: 32,
    status: 'active',
    createdDate: '2024-01-10'
  },
  {
    id: '3',
    name: 'Laticínios',
    description: 'Leite, queijos, iogurtes, manteigas',
    productsCount: 28,
    status: 'active',
    createdDate: '2024-01-10'
  }
];

// Mock data para promoções
const mockPromotions = [
  {
    id: '1',
    name: 'Black Week Sigma',
    description: 'Descontos especiais na semana do consumidor',
    discount: 15,
    type: 'percentage',
    startDate: '2024-12-15',
    endDate: '2024-12-22',
    status: 'active',
    products: ['7891234567890', '7891234567891'],
    totalSales: 15600.00,
    applicationsCount: 156
  },
  {
    id: '2',
    name: 'Promoção Natal',
    description: 'Produtos selecionados com desconto natalino',
    discount: 10,
    type: 'percentage',
    startDate: '2024-12-20',
    endDate: '2024-12-31',
    status: 'active',
    products: ['7891234567892'],
    totalSales: 5400.00,
    applicationsCount: 78
  }
];

type TabType = 'employees' | 'suppliers' | 'categories' | 'promotions';

export default function Registrations() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('employees');
  const [searchTerm, setSearchTerm] = useState('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getRoleLabel = (role: string) => {
    const roles = {
      ADMIN: 'Administrador',
      SUPERVISOR: 'Supervisor',
      CASHIER: 'Operador de Caixa',
      STOCK: 'Estoquista'
    };
    return roles[role as keyof typeof roles] || role;
  };

  const getRoleBadgeVariant = (role: string) => {
    const variants = {
      admin: 'destructive',
      supervisor: 'default',
      cashier: 'secondary',
      stock: 'outline'
    };
    return variants[role as keyof typeof variants] || 'outline';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Central de Cadastros</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie funcionários, fornecedores, categorias e promoções
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
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="employees" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Funcionários
          </TabsTrigger>
          <TabsTrigger value="suppliers" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Fornecedores
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Categorias
          </TabsTrigger>
          <TabsTrigger value="promotions" className="flex items-center gap-2">
            <Percent className="h-4 w-4" />
            Promoções
          </TabsTrigger>
        </TabsList>

        {/* Funcionários */}
        <TabsContent value="employees" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar funcionários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary-hover">
              <UserPlus className="h-4 w-4 mr-2" />
              Novo Funcionário
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{mockEmployees.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ativos</p>
                    <p className="text-2xl font-bold text-success">
                      {mockEmployees.filter(e => e.status === 'active').length}
                    </p>
                  </div>
                  <Shield className="h-8 w-8 text-success" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Departamentos</p>
                    <p className="text-2xl font-bold">
                      {new Set(mockEmployees.map(e => e.department)).size}
                    </p>
                  </div>
                  <Building className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Folha Mensal</p>
                    <p className="text-xl font-bold text-primary">
                      {formatCurrency(mockEmployees.reduce((sum, e) => sum + e.salary, 0))}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Employees Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Funcionário</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Salário</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Desde {formatDate(employee.hireDate)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{employee.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{employee.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(employee.role) as any}>
                          {getRoleLabel(employee.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>
                        <span className="font-semibold text-success">
                          {formatCurrency(employee.salary)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                          {employee.status === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fornecedores */}
        <TabsContent value="suppliers" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar fornecedores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary-hover">
              <Plus className="h-4 w-4 mr-2" />
              Novo Fornecedor
            </Button>
          </div>

          {/* Suppliers Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{mockSuppliers.length}</p>
                  </div>
                  <Truck className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ativos</p>
                    <p className="text-2xl font-bold text-success">
                      {mockSuppliers.filter(s => s.status === 'active').length}
                    </p>
                  </div>
                  <Shield className="h-8 w-8 text-success" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Pedidos</p>
                    <p className="text-2xl font-bold">
                      {mockSuppliers.reduce((sum, s) => sum + s.totalOrders, 0)}
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Volume Total</p>
                    <p className="text-xl font-bold text-primary">
                      {formatCurrency(mockSuppliers.reduce((sum, s) => sum + s.totalValue, 0))}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Suppliers Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Pedidos</TableHead>
                    <TableHead>Volume</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSuppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{supplier.name}</p>
                          <p className="text-sm text-muted-foreground font-mono">
                            {supplier.cnpj}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{supplier.contact}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{supplier.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{supplier.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{supplier.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">{supplier.totalOrders}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-success">
                          {formatCurrency(supplier.totalValue)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={supplier.status === 'active' ? 'default' : 'secondary'}>
                          {supplier.status === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categorias */}
        <TabsContent value="categories" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar categorias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary-hover">
              <Plus className="h-4 w-4 mr-2" />
              Nova Categoria
            </Button>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <Badge variant={category.status === 'active' ? 'default' : 'secondary'}>
                      {category.status === 'active' ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">{category.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{category.productsCount} produtos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {formatDate(category.createdDate)}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Promoções */}
        <TabsContent value="promotions" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar promoções..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary-hover">
              <Plus className="h-4 w-4 mr-2" />
              Nova Promoção
            </Button>
          </div>

          {/* Promotions Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{mockPromotions.length}</p>
                  </div>
                  <Percent className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ativas</p>
                    <p className="text-2xl font-bold text-success">
                      {mockPromotions.filter(p => p.status === 'active').length}
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
                    <p className="text-sm font-medium text-muted-foreground">Aplicações</p>
                    <p className="text-2xl font-bold">
                      {mockPromotions.reduce((sum, p) => sum + p.applicationsCount, 0)}
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
                    <p className="text-sm font-medium text-muted-foreground">Vendas Promoc.</p>
                    <p className="text-xl font-bold text-primary">
                      {formatCurrency(mockPromotions.reduce((sum, p) => sum + p.totalSales, 0))}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Promotions Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockPromotions.map((promotion) => (
              <Card key={promotion.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{promotion.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive" className="text-lg font-bold">
                        -{promotion.discount}%
                      </Badge>
                      <Badge variant={promotion.status === 'active' ? 'default' : 'secondary'}>
                        {promotion.status === 'active' ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">{promotion.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Período</p>
                      <p className="font-medium">
                        {formatDate(promotion.startDate)} até {formatDate(promotion.endDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Produtos</p>
                      <p className="font-medium">{promotion.products.length} itens</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Aplicações</p>
                      <p className="text-xl font-bold">{promotion.applicationsCount}</p>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Vendas</p>
                      <p className="text-lg font-bold text-success">
                        {formatCurrency(promotion.totalSales)}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}