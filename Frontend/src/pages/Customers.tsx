import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { DesktopOnlyPage } from '@/components/DesktopOnlyPage';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  User,
  Building,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Filter,
  Download,
  Upload,
  Eye,
  UserPlus,
  Users,
  Star,
  CreditCard,
  FileText
} from 'lucide-react';

// Tipos
type CustomerType = 'individual' | 'business';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: CustomerType;
  document: string; // CPF ou CNPJ
  address: {
    street: string;
    number: string;
    city: string;
    state: string;
    zipCode: string;
  };
  registrationDate: string;
  lastPurchase?: string;
  totalPurchases: number;
  totalSpent: number;
  status: 'active' | 'inactive';
  notes?: string;
  birthDate?: string;
  companyInfo?: {
    tradeName?: string;
    stateRegistration?: string;
    municipalRegistration?: string;
  };
}

// Mock data para clientes
const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'João Silva Santos',
    email: 'joao.silva@email.com',
    phone: '(11) 99999-1234',
    type: 'individual',
    document: '123.456.789-01',
    address: {
      street: 'Rua das Flores, 123',
      number: '123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    registrationDate: '2024-01-15',
    lastPurchase: '2024-12-18',
    totalPurchases: 45,
    totalSpent: 2850.75,
    status: 'active',
    birthDate: '1985-03-22',
    notes: 'Cliente frequente, gosta de promoções'
  },
  {
    id: '2',
    name: 'Maria Oliveira Costa',
    email: 'maria.costa@email.com',
    phone: '(11) 88888-5678',
    type: 'individual',
    document: '987.654.321-09',
    address: {
      street: 'Av. Principal, 456',
      number: '456',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '09876-543'
    },
    registrationDate: '2024-02-20',
    lastPurchase: '2024-12-19',
    totalPurchases: 28,
    totalSpent: 1650.30,
    status: 'active',
    birthDate: '1990-07-15'
  },
  {
    id: '3',
    name: 'Empresa ABC Comércio Ltda',
    email: 'contato@empresaabc.com.br',
    phone: '(11) 3333-4444',
    type: 'business',
    document: '12.345.678/0001-90',
    address: {
      street: 'Rua Comercial, 789',
      number: '789',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '12345-678'
    },
    registrationDate: '2024-03-10',
    lastPurchase: '2024-12-15',
    totalPurchases: 12,
    totalSpent: 8750.90,
    status: 'active',
    companyInfo: {
      tradeName: 'ABC Comércio',
      stateRegistration: '123.456.789.012',
      municipalRegistration: '987654321'
    },
    notes: 'Compras mensais de grande volume'
  },
  {
    id: '4',
    name: 'Pedro Mendes',
    email: 'pedro.mendes@email.com',
    phone: '(11) 77777-9999',
    type: 'individual',
    document: '555.666.777-88',
    address: {
      street: 'Rua Secundária, 321',
      number: '321',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '54321-987'
    },
    registrationDate: '2024-11-05',
    totalPurchases: 3,
    totalSpent: 185.50,
    status: 'active',
    birthDate: '1978-12-03'
  }
];

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    name: '',
    email: '',
    phone: '',
    type: 'individual',
    document: '',
    address: {
      street: '',
      number: '',
      city: '',
      state: '',
      zipCode: ''
    },
    status: 'active',
    notes: '',
    birthDate: '',
    companyInfo: {
      tradeName: '',
      stateRegistration: '',
      municipalRegistration: ''
    }
  });

  // Filtros
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.document.includes(searchTerm.replace(/\D/g, '')) ||
                         customer.phone.includes(searchTerm.replace(/\D/g, ''));
    const matchesType = selectedType === 'all' || customer.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || customer.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Estatísticas
  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    individuals: customers.filter(c => c.type === 'individual').length,
    businesses: customers.filter(c => c.type === 'business').length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
    averageTicket: customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.reduce((sum, c) => sum + c.totalPurchases, 0) || 0
  };

  const handleAddCustomer = () => {
    const customer: Customer = {
      ...newCustomer as Customer,
      id: Date.now().toString(),
      registrationDate: new Date().toISOString().split('T')[0],
      totalPurchases: 0,
      totalSpent: 0
    };
    setCustomers([...customers, customer]);
    setNewCustomer({
      name: '',
      email: '',
      phone: '',
      type: 'individual',
      document: '',
      address: {
        street: '',
        number: '',
        city: '',
        state: '',
        zipCode: ''
      },
      status: 'active',
      notes: '',
      birthDate: '',
      companyInfo: {
        tradeName: '',
        stateRegistration: '',
        municipalRegistration: ''
      }
    });
    setIsAddDialogOpen(false);
  };

  const handleEditCustomer = (customer: Customer) => {
    const index = customers.findIndex(c => c.id === customer.id);
    if (index !== -1) {
      const updatedCustomers = [...customers];
      updatedCustomers[index] = customer;
      setCustomers(updatedCustomers);
      setEditingCustomer(null);
    }
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers(customers.filter(c => c.id !== customerId));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDocument = (document: string, type: CustomerType) => {
    if (type === 'individual') {
      // CPF: 000.000.000-00
      return document.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      // CNPJ: 00.000.000/0000-00
      return document.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
  };

  const getCustomerTier = (totalSpent: number) => {
    if (totalSpent >= 5000) return { tier: 'Gold', color: 'bg-yellow-500' };
    if (totalSpent >= 2000) return { tier: 'Silver', color: 'bg-gray-400' };
    return { tier: 'Bronze', color: 'bg-orange-600' };
  };

  return (
    <DesktopOnlyPage
      title="Gestão de Clientes"
      description="Sistema de gerenciamento de clientes com histórico de compras e análises."
      features={[
        "Cadastro completo de clientes (PF e PJ)",
        "Histórico detalhado de compras",
        "Segmentação por tipo e status",
        "Análise de comportamento de compra",
        "Relatórios de fidelidade e retenção",
        "Gestão de dados de contato e endereço",
        "Notas e observações personalizadas"
      ]}
    >
      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Clientes</h1>
          <p className="text-muted-foreground mt-1">
            Sistema de gerenciamento de clientes com histórico de compras e análises.
            Gerencie sua base de clientes e histórico de compras
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
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-primary hover:bg-primary-hover">
                <UserPlus className="h-4 w-4 mr-2" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
                <DialogDescription>
                  Preencha as informações do cliente abaixo
                </DialogDescription>
              </DialogHeader>
              <CustomerForm
                customer={newCustomer}
                onChange={setNewCustomer}
                onSubmit={handleAddCustomer}
                onCancel={() => setIsAddDialogOpen(false)}
                isEditing={false}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
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
                <p className="text-2xl font-bold text-success">{stats.active}</p>
              </div>
              <User className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pessoa Física</p>
                <p className="text-2xl font-bold text-blue-500">{stats.individuals}</p>
              </div>
              <User className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pessoa Jurídica</p>
                <p className="text-2xl font-bold text-purple-500">{stats.businesses}</p>
              </div>
              <Building className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Receita Total</p>
                <p className="text-xl font-bold text-success">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ticket Médio</p>
                <p className="text-xl font-bold text-primary">{formatCurrency(stats.averageTicket)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, e-mail, documento ou telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="individual">Pessoa Física</SelectItem>
                <SelectItem value="business">Pessoa Jurídica</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Histórico</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => {
                const tier = getCustomerTier(customer.totalSpent);
                const daysSinceLastPurchase = customer.lastPurchase 
                  ? Math.floor((new Date().getTime() - new Date(customer.lastPurchase).getTime()) / (1000 * 60 * 60 * 24))
                  : null;
                
                return (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Cliente desde {formatDate(customer.registrationDate)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          <span>{customer.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-mono text-sm">{formatDocument(customer.document, customer.type)}</p>
                        {customer.type === 'business' && customer.companyInfo?.tradeName && (
                          <p className="text-xs text-muted-foreground">{customer.companyInfo.tradeName}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={customer.type === 'individual' ? 'default' : 'outline'}>
                        {customer.type === 'individual' ? (
                          <>
                            <User className="h-3 w-3 mr-1" />
                            PF
                          </>
                        ) : (
                          <>
                            <Building className="h-3 w-3 mr-1" />
                            PJ
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-medium">{customer.totalPurchases} compras</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-semibold text-success">
                            {formatCurrency(customer.totalSpent)}
                          </span>
                        </div>
                        {customer.lastPurchase && (
                          <p className="text-xs text-muted-foreground">
                            Última compra há {daysSinceLastPurchase} {daysSinceLastPurchase === 1 ? 'dia' : 'dias'}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                        {customer.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${tier.color}`}></div>
                        <Badge variant="outline" className="text-xs">
                          {tier.tier}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingCustomer(customer)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir Cliente</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o cliente "{customer.name}"? 
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteCustomer(customer.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Customer Dialog */}
      {editingCustomer && (
        <Dialog open={!!editingCustomer} onOpenChange={() => setEditingCustomer(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Cliente</DialogTitle>
              <DialogDescription>
                Altere as informações do cliente abaixo
              </DialogDescription>
            </DialogHeader>
            <CustomerForm
              customer={editingCustomer}
              onChange={(customer) => setEditingCustomer(customer as Customer)}
              onSubmit={() => handleEditCustomer(editingCustomer)}
              onCancel={() => setEditingCustomer(null)}
              isEditing={true}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Customer Details Dialog */}
      {selectedCustomer && (
        <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes do Cliente</DialogTitle>
              <DialogDescription>
                Visualize as informações do cliente abaixo
              </DialogDescription>
            </DialogHeader>
            <CustomerDetails customer={selectedCustomer} />
          </DialogContent>
        </Dialog>
      )}
    </div>
    </DesktopOnlyPage>
  );
}

// Componente do formulário de cliente
const CustomerForm = ({ 
  customer, 
  onChange, 
  onSubmit, 
  onCancel, 
  isEditing 
}: {
  customer: Partial<Customer>;
  onChange: (customer: Partial<Customer>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isEditing: boolean;
}) => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
          <TabsTrigger value="address">Endereço</TabsTrigger>
          <TabsTrigger value="additional">Informações Adicionais</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo de Cliente</Label>
            <Select 
              value={customer.type} 
              onValueChange={(value) => onChange({ ...customer, type: value as CustomerType })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Pessoa Física</SelectItem>
                <SelectItem value="business">Pessoa Jurídica</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                {customer.type === 'business' ? 'Razão Social' : 'Nome Completo'}
              </Label>
              <Input
                id="name"
                value={customer.name || ''}
                onChange={(e) => onChange({ ...customer, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="document">
                {customer.type === 'business' ? 'CNPJ' : 'CPF'}
              </Label>
              <Input
                id="document"
                value={customer.document || ''}
                onChange={(e) => onChange({ ...customer, document: e.target.value })}
                placeholder={customer.type === 'business' ? '00.000.000/0000-00' : '000.000.000-00'}
              />
            </div>
          </div>

          {customer.type === 'business' && (
            <div className="space-y-2">
              <Label htmlFor="tradeName">Nome Fantasia</Label>
              <Input
                id="tradeName"
                value={customer.companyInfo?.tradeName || ''}
                onChange={(e) => onChange({ 
                  ...customer, 
                  companyInfo: { 
                    ...customer.companyInfo, 
                    tradeName: e.target.value 
                  } 
                })}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={customer.email || ''}
                onChange={(e) => onChange({ ...customer, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={customer.phone || ''}
                onChange={(e) => onChange({ ...customer, phone: e.target.value })}
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          {customer.type === 'individual' && (
            <div className="space-y-2">
              <Label htmlFor="birthDate">Data de Nascimento</Label>
              <Input
                id="birthDate"
                type="date"
                value={customer.birthDate || ''}
                onChange={(e) => onChange({ ...customer, birthDate: e.target.value })}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="address" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="street">Endereço</Label>
              <Input
                id="street"
                value={customer.address?.street || ''}
                onChange={(e) => onChange({ 
                  ...customer, 
                  address: { ...customer.address!, street: e.target.value } 
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="number">Número</Label>
              <Input
                id="number"
                value={customer.address?.number || ''}
                onChange={(e) => onChange({ 
                  ...customer, 
                  address: { ...customer.address!, number: e.target.value } 
                })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zipCode">CEP</Label>
              <Input
                id="zipCode"
                value={customer.address?.zipCode || ''}
                onChange={(e) => onChange({ 
                  ...customer, 
                  address: { ...customer.address!, zipCode: e.target.value } 
                })}
                placeholder="00000-000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={customer.address?.city || ''}
                onChange={(e) => onChange({ 
                  ...customer, 
                  address: { ...customer.address!, city: e.target.value } 
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                value={customer.address?.state || ''}
                onChange={(e) => onChange({ 
                  ...customer, 
                  address: { ...customer.address!, state: e.target.value } 
                })}
                placeholder="SP"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="additional" className="space-y-4">
          {customer.type === 'business' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stateRegistration">Inscrição Estadual</Label>
                <Input
                  id="stateRegistration"
                  value={customer.companyInfo?.stateRegistration || ''}
                  onChange={(e) => onChange({ 
                    ...customer, 
                    companyInfo: { 
                      ...customer.companyInfo, 
                      stateRegistration: e.target.value 
                    } 
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="municipalRegistration">Inscrição Municipal</Label>
                <Input
                  id="municipalRegistration"
                  value={customer.companyInfo?.municipalRegistration || ''}
                  onChange={(e) => onChange({ 
                    ...customer, 
                    companyInfo: { 
                      ...customer.companyInfo, 
                      municipalRegistration: e.target.value 
                    } 
                  })}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={customer.status} 
              onValueChange={(value) => onChange({ ...customer, status: value as 'active' | 'inactive' })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={customer.notes || ''}
              onChange={(e) => onChange({ ...customer, notes: e.target.value })}
              placeholder="Observações sobre o cliente..."
              rows={4}
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={onSubmit} className="bg-primary hover:bg-primary-hover">
          {isEditing ? 'Salvar Alterações' : 'Cadastrar Cliente'}
        </Button>
      </div>
    </div>
  );
};

// Componente de detalhes do cliente
const CustomerDetails = ({ customer }: { customer: Customer }) => {
  const tier = getCustomerTier(customer.totalSpent);
  const averagePerPurchase = customer.totalPurchases > 0 ? customer.totalSpent / customer.totalPurchases : 0;
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDocument = (document: string, type: CustomerType) => {
    if (type === 'individual') {
      return document.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      return document.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
  };

  function getCustomerTier(totalSpent: number) {
    if (totalSpent >= 5000) return { tier: 'Gold', color: 'bg-yellow-500' };
    if (totalSpent >= 2000) return { tier: 'Silver', color: 'bg-gray-400' };
    return { tier: 'Bronze', color: 'bg-orange-600' };
  }

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-semibold">{customer.name}</h3>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${tier.color}`}></div>
              <Badge variant="outline">{tier.tier}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <Badge variant={customer.type === 'individual' ? 'default' : 'outline'}>
              {customer.type === 'individual' ? (
                <>
                  <User className="h-3 w-3 mr-1" />
                  Pessoa Física
                </>
              ) : (
                <>
                  <Building className="h-3 w-3 mr-1" />
                  Pessoa Jurídica
                </>
              )}
            </Badge>
            <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
              {customer.status === 'active' ? 'Ativo' : 'Inativo'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Documento</p>
              <p className="font-mono font-medium">{formatDocument(customer.document, customer.type)}</p>
            </div>
            {customer.type === 'individual' && customer.birthDate && (
              <div>
                <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                <p>{formatDate(customer.birthDate)}</p>
              </div>
            )}
            {customer.type === 'business' && customer.companyInfo?.tradeName && (
              <div>
                <p className="text-sm text-muted-foreground">Nome Fantasia</p>
                <p>{customer.companyInfo.tradeName}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Cliente desde</p>
              <p>{formatDate(customer.registrationDate)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contato
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">E-mail</p>
              <p>{customer.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Telefone</p>
              <p>{customer.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Endereço</p>
              <p>{customer.address.street}, {customer.address.number}</p>
              <p>{customer.address.city} - {customer.address.state}</p>
              <p>CEP: {customer.address.zipCode}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Purchase History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Histórico de Compras
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Total de Compras</p>
              <p className="text-2xl font-bold">{customer.totalPurchases}</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Gasto</p>
              <p className="text-2xl font-bold text-success">{formatCurrency(customer.totalSpent)}</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Ticket Médio</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(averagePerPurchase)}</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Última Compra</p>
              <p className="text-lg font-bold">
                {customer.lastPurchase ? formatDate(customer.lastPurchase) : 'Nunca'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Info */}
      {customer.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Observações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{customer.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

function getCustomerTier(totalSpent: number) {
  if (totalSpent >= 5000) return { tier: 'Gold', color: 'bg-yellow-500' };
  if (totalSpent >= 2000) return { tier: 'Silver', color: 'bg-gray-400' };
  return { tier: 'Bronze', color: 'bg-orange-600' };
}