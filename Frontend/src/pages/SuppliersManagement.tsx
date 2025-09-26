import React, { useState } from 'react';
import { DesktopOnlyPage } from '@/components/DesktopOnlyPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Truck,
  Plus,
  Search,
  Edit,
  Eye,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Building,
  Calendar,
  Package,
  DollarSign,
  FileText,
  Save,
  X,
  Filter,
  Download,
  Upload
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Mock data para fornecedores
const mockSuppliers = [
  {
    id: '1',
    name: 'Distribuidora Alimentos Brasil Ltda',
    cnpj: '12.345.678/0001-90',
    phone: ['(11) 3333-4444', '(11) 99999-1111'],
    email: 'contato@distralimentos.com.br',
    address: {
      street: 'Rua Industrial',
      number: '123',
      neighborhood: 'Vila Industrial',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    contact: 'Carlos Roberto Silva',
    category: 'Alimentos',
    status: 'active',
    contractDate: '2024-01-10',
    totalOrders: 45,
    totalValue: 125000.00,
    lastOrder: '2024-12-05',
    orders: [
      {
        id: 'PED001',
        date: '2024-12-05',
        total: 2500.00,
        status: 'delivered',
        products: [
          { name: 'Arroz Branco 5kg', quantity: 50, unitPrice: 12.50 },
          { name: 'Feijão Preto 1kg', quantity: 30, unitPrice: 7.80 },
          { name: 'Açúcar Cristal 1kg', quantity: 40, unitPrice: 3.20 }
        ]
      },
      {
        id: 'PED002',
        date: '2024-11-28',
        total: 1800.00,
        status: 'delivered',
        products: [
          { name: 'Óleo de Soja 900ml', quantity: 25, unitPrice: 6.80 },
          { name: 'Farinha de Trigo 1kg', quantity: 35, unitPrice: 4.50 }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Bebidas Premium Distribuidora',
    cnpj: '98.765.432/0001-21',
    phone: ['(11) 2222-3333'],
    email: 'vendas@bebidaspremium.com.br',
    address: {
      street: 'Av. das Bebidas',
      number: '456',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '04567-890'
    },
    contact: 'Ana Maria Santos',
    category: 'Bebidas',
    status: 'active',
    contractDate: '2024-02-15',
    totalOrders: 28,
    totalValue: 85000.00,
    lastOrder: '2024-12-03',
    orders: [
      {
        id: 'PED003',
        date: '2024-12-03',
        total: 3200.00,
        status: 'delivered',
        products: [
          { name: 'Refrigerante Cola 2L', quantity: 60, unitPrice: 8.90 },
          { name: 'Água Mineral 500ml', quantity: 100, unitPrice: 1.50 },
          { name: 'Suco de Laranja 1L', quantity: 24, unitPrice: 6.50 }
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'Laticínios do Vale Ltda',
    cnpj: '11.222.333/0001-44',
    phone: ['(11) 4444-5555', '(11) 98888-7777'],
    email: 'comercial@laticiniosdovale.com.br',
    address: {
      street: 'Estrada do Leite',
      number: '789',
      neighborhood: 'Rural',
      city: 'Campinas',
      state: 'SP',
      zipCode: '13000-000'
    },
    contact: 'João Pedro Oliveira',
    category: 'Laticínios',
    status: 'active',
    contractDate: '2024-03-20',
    totalOrders: 32,
    totalValue: 95000.00,
    lastOrder: '2024-12-06',
    orders: [
      {
        id: 'PED004',
        date: '2024-12-06',
        total: 2800.00,
        status: 'delivered',
        products: [
          { name: 'Leite Integral 1L', quantity: 80, unitPrice: 4.20 },
          { name: 'Queijo Mussarela 500g', quantity: 20, unitPrice: 18.90 },
          { name: 'Iogurte Natural 170g', quantity: 60, unitPrice: 3.50 }
        ]
      }
    ]
  }
];

interface Supplier {
  id: string;
  name: string;
  cnpj: string;
  phone: string[];
  email: string;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  contact: string;
  category: string;
  status: string;
  contractDate: string;
  totalOrders: number;
  totalValue: number;
  lastOrder: string;
  orders: any[];
}

export default function SuppliersManagement() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Supplier>>({});
  const [editMode, setEditMode] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const filteredSuppliers = mockSuppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.cnpj.includes(searchTerm.replace(/\D/g, ''))
  );

  const handleEdit = (supplier: Supplier) => {
    setFormData(supplier);
    setEditMode(true);
    setIsDialogOpen(true);
  };

  const handleNew = () => {
    setFormData({
      name: '',
      cnpj: '',
      phone: [''],
      email: '',
      address: {
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: ''
      },
      contact: '',
      category: '',
      status: 'active'
    });
    setEditMode(false);
    setIsDialogOpen(true);
  };

  const handleDetails = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsDetailsOpen(true);
  };

  const handleSave = () => {
    // Aqui seria feita a chamada para a API
    console.log('Salvando fornecedor:', formData);
    setIsDialogOpen(false);
    setFormData({});
  };

  const addPhoneField = () => {
    if (formData.phone) {
      setFormData({
        ...formData,
        phone: [...formData.phone, '']
      });
    }
  };

  const updatePhoneField = (index: number, value: string) => {
    if (formData.phone) {
      const newPhones = [...formData.phone];
      newPhones[index] = value;
      setFormData({
        ...formData,
        phone: newPhones
      });
    }
  };

  const removePhoneField = (index: number) => {
    if (formData.phone && formData.phone.length > 1) {
      const newPhones = formData.phone.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        phone: newPhones
      });
    }
  };

  return (
    <DesktopOnlyPage
      title="Gestão de Fornecedores"
      description="Sistema de gerenciamento de fornecedores com contratos e histórico de compras."
      features={[
        "Cadastro completo de fornecedores (PF e PJ)",
        "Gestão de contratos e condições comerciais",
        "Histórico de compras e entregas",
        "Avaliação de performance dos fornecedores",
        "Controle de documentação e certificações",
        "Relatórios de compras por fornecedor",
        "Gestão de prazos de pagamento"
      ]}
    >
      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Fornecedores</h1>
          <p className="text-muted-foreground mt-1">
            Sistema de gerenciamento de fornecedores com contratos e histórico de compras.
            Gerencie todos os fornecedores e acompanhe histórico de pedidos
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
          <Button onClick={handleNew} className="bg-primary hover:bg-primary-hover">
            <Plus className="h-4 w-4 mr-2" />
            Novo Fornecedor
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Fornecedores</p>
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
                <p className="text-sm font-medium text-muted-foreground">Fornecedores Ativos</p>
                <p className="text-2xl font-bold text-success">
                  {mockSuppliers.filter(s => s.status === 'active').length}
                </p>
              </div>
              <Building className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Pedidos</p>
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

      {/* Filtros e Busca */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou CNPJ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabela de Fornecedores */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome da Empresa</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Último Pedido</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{supplier.name}</p>
                      <p className="text-sm text-muted-foreground">{supplier.contact}</p>
                      <Badge variant="outline" className="text-xs">
                        {supplier.category}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">{formatCNPJ(supplier.cnpj)}</span>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {supplier.phone.map((phone, index) => (
                        <div key={index} className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          <span>{phone}</span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span>{supplier.address.city}, {supplier.address.state}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={supplier.status === 'active' ? 'default' : 'secondary'}>
                      {supplier.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm">{formatDate(supplier.lastOrder)}</p>
                      <p className="text-xs text-muted-foreground">
                        {supplier.totalOrders} pedidos
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDetails(supplier)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEdit(supplier)}
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
                            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o fornecedor "{supplier.name}"? 
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de Cadastro/Edição */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editMode ? 'Editar Fornecedor' : 'Novo Fornecedor'}
            </DialogTitle>
            <DialogDescription>
              {editMode ? 'Altere os dados do fornecedor' : 'Cadastre um novo fornecedor'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dados Básicos */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dados da Empresa</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Empresa *</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Nome completo da empresa"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ *</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj || ''}
                  onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
                  placeholder="00.000.000/0000-00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Pessoa de Contato</Label>
                <Input
                  id="contact"
                  value={formData.contact || ''}
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                  placeholder="Nome do responsável"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="contato@empresa.com.br"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select 
                  value={formData.category || ''} 
                  onValueChange={(value) => setFormData({...formData, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alimentos">Alimentos</SelectItem>
                    <SelectItem value="Bebidas">Bebidas</SelectItem>
                    <SelectItem value="Laticínios">Laticínios</SelectItem>
                    <SelectItem value="Limpeza">Limpeza</SelectItem>
                    <SelectItem value="Higiene">Higiene</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Telefones */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Telefones</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={addPhoneField}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Adicionar
                  </Button>
                </div>
                {formData.phone?.map((phone, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={phone}
                      onChange={(e) => updatePhoneField(index, e.target.value)}
                      placeholder="(11) 99999-9999"
                    />
                    {formData.phone && formData.phone.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removePhoneField(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Endereço */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Endereço</h3>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="street">Rua/Avenida</Label>
                  <Input
                    id="street"
                    value={formData.address?.street || ''}
                    onChange={(e) => setFormData({
                      ...formData, 
                      address: {...formData.address, street: e.target.value}
                    })}
                    placeholder="Nome da rua"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number">Número</Label>
                  <Input
                    id="number"
                    value={formData.address?.number || ''}
                    onChange={(e) => setFormData({
                      ...formData, 
                      address: {...formData.address, number: e.target.value}
                    })}
                    placeholder="123"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input
                  id="neighborhood"
                  value={formData.address?.neighborhood || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    address: {...formData.address, neighborhood: e.target.value}
                  })}
                  placeholder="Nome do bairro"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={formData.address?.city || ''}
                    onChange={(e) => setFormData({
                      ...formData, 
                      address: {...formData.address, city: e.target.value}
                    })}
                    placeholder="Nome da cidade"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Select 
                    value={formData.address?.state || ''} 
                    onValueChange={(value) => setFormData({
                      ...formData, 
                      address: {...formData.address, state: value}
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="UF" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SP">SP</SelectItem>
                      <SelectItem value="RJ">RJ</SelectItem>
                      <SelectItem value="MG">MG</SelectItem>
                      <SelectItem value="RS">RS</SelectItem>
                      <SelectItem value="PR">PR</SelectItem>
                      <SelectItem value="SC">SC</SelectItem>
                      {/* Adicionar outros estados conforme necessário */}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">CEP</Label>
                <Input
                  id="zipCode"
                  value={formData.address?.zipCode || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    address: {...formData.address, zipCode: e.target.value}
                  })}
                  placeholder="00000-000"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary-hover">
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Detalhes */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Fornecedor</DialogTitle>
            <DialogDescription>
              Informações completas e histórico de pedidos
            </DialogDescription>
          </DialogHeader>
          
          {selectedSupplier && (
            <div className="space-y-6">
              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Dados da Empresa</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Nome</Label>
                      <p className="font-medium">{selectedSupplier.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">CNPJ</Label>
                      <p className="font-mono">{formatCNPJ(selectedSupplier.cnpj)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Contato</Label>
                      <p>{selectedSupplier.contact}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">E-mail</Label>
                      <p>{selectedSupplier.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Telefones</Label>
                      <div className="space-y-1">
                        {selectedSupplier.phone.map((phone, index) => (
                          <p key={index}>{phone}</p>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Categoria</Label>
                      <Badge variant="outline">{selectedSupplier.category}</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Endereço e Estatísticas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Endereço Completo</Label>
                      <div className="space-y-1">
                        <p>{selectedSupplier.address.street}, {selectedSupplier.address.number}</p>
                        <p>{selectedSupplier.address.neighborhood}</p>
                        <p>{selectedSupplier.address.city}, {selectedSupplier.address.state}</p>
                        <p>CEP: {selectedSupplier.address.zipCode}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Total de Pedidos</Label>
                        <p className="text-xl font-bold">{selectedSupplier.totalOrders}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Volume Total</Label>
                        <p className="text-xl font-bold text-success">
                          {formatCurrency(selectedSupplier.totalValue)}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Contrato Desde</Label>
                      <p>{formatDate(selectedSupplier.contractDate)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Último Pedido</Label>
                      <p>{formatDate(selectedSupplier.lastOrder)}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Histórico de Pedidos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Histórico de Pedidos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedSupplier.orders.map((order) => (
                      <Card key={order.id} className="border-l-4 border-l-primary">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-4">
                              <div>
                                <p className="font-semibold">Pedido {order.id}</p>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(order.date)}
                                </p>
                              </div>
                              <Badge variant="default">
                                {order.status === 'delivered' ? 'Entregue' : 'Pendente'}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-success">
                                {formatCurrency(order.total)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {order.products.length} produtos
                              </p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Produtos:</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                              {order.products.map((product, index) => (
                                <div key={index} className="p-2 bg-muted/30 rounded">
                                  <p className="text-sm font-medium">{product.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {product.quantity}x {formatCurrency(product.unitPrice)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
    </DesktopOnlyPage>
  );
}