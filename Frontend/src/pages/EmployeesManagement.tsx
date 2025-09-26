import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
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
  DollarSign,
  Clock,
  Shield,
  Save,
  X,
  User,
  Briefcase,
  Home,
  Key,
  Download,
  Upload,
  UserCheck
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Mock data para funcionários
const mockEmployees = [
  {
    id: '1',
    registration: 'FUNC001',
    name: 'João Silva Santos',
    email: 'joao.silva@comprebem.com',
    phone: ['(11) 99999-1234', '(11) 3333-4444'],
    address: {
      street: 'Rua das Flores',
      number: '123',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    position: 'Gerente Geral',
    department: 'Administração',
    salary: 5500.00,
    shift: 'Manhã',
    hireDate: '2024-01-15',
    supervisor: null,
    status: 'active',
    hasSystemAccess: true,
    systemRole: 'admin',
    userId: 'user1'
  },
  {
    id: '2',
    registration: 'FUNC002',
    name: 'Maria Oliveira Costa',
    email: 'maria.costa@comprebem.com',
    phone: ['(11) 88888-5678'],
    address: {
      street: 'Av. Paulista',
      number: '456',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100'
    },
    position: 'Supervisora de Vendas',
    department: 'Vendas',
    salary: 3800.00,
    shift: 'Tarde',
    hireDate: '2024-02-20',
    supervisor: 'FUNC001',
    status: 'active',
    hasSystemAccess: true,
    systemRole: 'supervisor',
    userId: 'user2'
  },
  {
    id: '3',
    registration: 'FUNC003',
    name: 'Pedro Mendes Lima',
    email: 'pedro.lima@comprebem.com',
    phone: ['(11) 77777-9999'],
    address: {
      street: 'Rua dos Trabalhadores',
      number: '789',
      neighborhood: 'Vila Operária',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '05678-901'
    },
    position: 'Operador de Caixa',
    department: 'Vendas',
    salary: 2200.00,
    shift: 'Manhã',
    hireDate: '2024-03-10',
    supervisor: 'FUNC002',
    status: 'active',
    hasSystemAccess: true,
    systemRole: 'cashier',
    userId: 'user3'
  },
  {
    id: '4',
    registration: 'FUNC004',
    name: 'Ana Carolina Souza',
    email: 'ana.souza@comprebem.com',
    phone: ['(11) 66666-8888'],
    address: {
      street: 'Rua do Estoque',
      number: '321',
      neighborhood: 'Industrial',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '08765-432'
    },
    position: 'Estoquista',
    department: 'Estoque',
    salary: 2400.00,
    shift: 'Integral',
    hireDate: '2024-04-05',
    supervisor: 'FUNC001',
    status: 'active',
    hasSystemAccess: true,
    systemRole: 'stock',
    userId: 'user4'
  },
  {
    id: '5',
    registration: 'FUNC005',
    name: 'Carlos Roberto Ferreira',
    email: 'carlos.ferreira@comprebem.com',
    phone: ['(11) 55555-7777'],
    address: {
      street: 'Av. dos Funcionários',
      number: '654',
      neighborhood: 'Comercial',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '04321-098'
    },
    position: 'Auxiliar de Limpeza',
    department: 'Serviços Gerais',
    salary: 1800.00,
    shift: 'Noite',
    hireDate: '2024-05-12',
    supervisor: 'FUNC001',
    status: 'active',
    hasSystemAccess: false,
    systemRole: null,
    userId: null
  }
];

interface Employee {
  id: string;
  registration: string;
  name: string;
  email: string;
  phone: string[];
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  position: string;
  department: string;
  salary: number;
  shift: string;
  hireDate: string;
  supervisor: string | null;
  status: string;
  hasSystemAccess: boolean;
  systemRole: string | null;
  userId: string | null;
}

export default function EmployeesManagement() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Employee>>({});
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

  const getPositionBadgeVariant = (position: string) => {
    if (position.includes('Gerente')) return 'destructive';
    if (position.includes('Supervisor')) return 'default';
    if (position.includes('Operador')) return 'secondary';
    return 'outline';
  };

  const getSystemRoleLabel = (role: string | null) => {
    const roles = {
      admin: 'Administrador',
      supervisor: 'Supervisor',
      cashier: 'Operador de Caixa',
      stock: 'Estoquista'
    };
    return role ? roles[role as keyof typeof roles] || role : 'Sem acesso';
  };

  const getSupervisorName = (supervisorId: string | null) => {
    if (!supervisorId) return 'Sem supervisor';
    const supervisor = mockEmployees.find(emp => emp.registration === supervisorId);
    return supervisor ? supervisor.name : 'Não encontrado';
  };

  const filteredEmployees = mockEmployees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.registration.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (employee: Employee) => {
    setFormData(employee);
    setEditMode(true);
    setIsDialogOpen(true);
  };

  const handleNew = () => {
    const nextId = (mockEmployees.length + 1).toString();
    const nextRegistration = `FUNC${nextId.padStart(3, '0')}`;
    
    setFormData({
      registration: nextRegistration,
      name: '',
      email: '',
      phone: [''],
      address: {
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: ''
      },
      position: '',
      department: '',
      salary: 0,
      shift: '',
      supervisor: null,
      status: 'active',
      hasSystemAccess: false,
      systemRole: null,
      userId: null
    });
    setEditMode(false);
    setIsDialogOpen(true);
  };

  const handleDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDetailsOpen(true);
  };

  const handleSave = () => {
    // Aqui seria feita a chamada para a API
    console.log('Salvando funcionário:', formData);
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Funcionários</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie funcionários, cargos, salários e acessos ao sistema
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
            Novo Funcionário
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Funcionários</p>
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
                <p className="text-sm font-medium text-muted-foreground">Funcionários Ativos</p>
                <p className="text-2xl font-bold text-success">
                  {mockEmployees.filter(e => e.status === 'active').length}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-success" />
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

      {/* Filtros e Busca */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou matrícula..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabela de Funcionários */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Matrícula</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Setor</TableHead>
                <TableHead>Salário</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Acesso Sistema</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{employee.name}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{employee.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono font-medium">{employee.registration}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPositionBadgeVariant(employee.position) as any}>
                      {employee.position}
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
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {employee.hasSystemAccess ? (
                        <>
                          <Shield className="h-4 w-4 text-success" />
                          <span className="text-sm text-success">
                            {getSystemRoleLabel(employee.systemRole)}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-muted-foreground">Sem acesso</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDetails(employee)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEdit(employee)}
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
                              Tem certeza que deseja excluir o funcionário "{employee.name}"? 
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
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editMode ? 'Editar Funcionário' : 'Novo Funcionário'}
            </DialogTitle>
            <DialogDescription>
              {editMode ? 'Altere os dados do funcionário' : 'Cadastre um novo funcionário'}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
              <TabsTrigger value="professional">Dados Profissionais</TabsTrigger>
              <TabsTrigger value="hierarchy">Hierarquia</TabsTrigger>
              <TabsTrigger value="system">Acesso ao Sistema</TabsTrigger>
            </TabsList>

            {/* Dados Pessoais */}
            <TabsContent value="personal" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dados Básicos */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informações Básicas
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Nome completo do funcionário"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="funcionario@comprebem.com"
                    />
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
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Endereço
                  </h3>
                  
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
            </TabsContent>

            {/* Dados Profissionais */}
            <TabsContent value="professional" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Informações do Cargo
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="registration">Matrícula *</Label>
                    <Input
                      id="registration"
                      value={formData.registration || ''}
                      onChange={(e) => setFormData({...formData, registration: e.target.value})}
                      placeholder="FUNC001"
                      disabled={editMode}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Cargo *</Label>
                    <Select 
                      value={formData.position || ''} 
                      onValueChange={(value) => setFormData({...formData, position: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o cargo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Gerente Geral">Gerente Geral</SelectItem>
                        <SelectItem value="Supervisora de Vendas">Supervisor de Vendas</SelectItem>
                        <SelectItem value="Operador de Caixa">Operador de Caixa</SelectItem>
                        <SelectItem value="Estoquista">Estoquista</SelectItem>
                        <SelectItem value="Auxiliar de Limpeza">Auxiliar de Limpeza</SelectItem>
                        <SelectItem value="Atendente">Atendente</SelectItem>
                        <SelectItem value="Repositor">Repositor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Setor *</Label>
                    <Select 
                      value={formData.department || ''} 
                      onValueChange={(value) => setFormData({...formData, department: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o setor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Administração">Administração</SelectItem>
                        <SelectItem value="Vendas">Vendas</SelectItem>
                        <SelectItem value="Estoque">Estoque</SelectItem>
                        <SelectItem value="Serviços Gerais">Serviços Gerais</SelectItem>
                        <SelectItem value="Atendimento">Atendimento</SelectItem>
                        <SelectItem value="Segurança">Segurança</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Remuneração e Horário
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salário (R$) *</Label>
                    <Input
                      id="salary"
                      type="number"
                      step="0.01"
                      value={formData.salary || ''}
                      onChange={(e) => setFormData({...formData, salary: parseFloat(e.target.value) || 0})}
                      placeholder="2000.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shift">Turno de Trabalho *</Label>
                    <Select 
                      value={formData.shift || ''} 
                      onValueChange={(value) => setFormData({...formData, shift: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o turno" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manhã">Manhã (06:00 - 14:00)</SelectItem>
                        <SelectItem value="Tarde">Tarde (14:00 - 22:00)</SelectItem>
                        <SelectItem value="Noite">Noite (22:00 - 06:00)</SelectItem>
                        <SelectItem value="Integral">Integral (08:00 - 18:00)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hireDate">Data de Admissão</Label>
                    <Input
                      id="hireDate"
                      type="date"
                      value={formData.hireDate || ''}
                      onChange={(e) => setFormData({...formData, hireDate: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Hierarquia */}
            <TabsContent value="hierarchy" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Estrutura Hierárquica
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="supervisor">Supervisor</Label>
                  <Select 
                    value={formData.supervisor || ''} 
                    onValueChange={(value) => {
                      setFormData(prev => ({
                        ...prev, 
                        supervisor: value === '' ? null : value
                      }));
                    }}
                  >
                    <SelectTrigger id="supervisor">
                      <SelectValue placeholder="Selecione o supervisor (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Sem supervisor</SelectItem>
                      {mockEmployees
                        .filter(emp => {
                          // Filtro simples e seguro
                          if (!emp || !emp.registration || !emp.name || !emp.position) return false;
                          
                          // Não incluir o próprio funcionário
                          if (formData.registration && emp.registration === formData.registration) return false;
                          
                          // Apenas cargos de supervisão
                          return emp.position.includes('Gerente') || emp.position.includes('Supervisor');
                        })
                        .map(supervisor => (
                          <SelectItem key={supervisor.registration} value={supervisor.registration}>
                            {supervisor.name} ({supervisor.position})
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Dica:</strong> O supervisor é responsável por gerenciar este funcionário 
                    e pode ter acesso a relatórios de desempenho e outras informações relevantes.
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Acesso ao Sistema */}
            <TabsContent value="system" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Permissões do Sistema
                </h3>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="hasSystemAccess"
                    checked={formData.hasSystemAccess || false}
                    onCheckedChange={(checked) => setFormData({
                      ...formData, 
                      hasSystemAccess: checked,
                      systemRole: checked ? formData.systemRole : null,
                      userId: checked ? formData.userId : null
                    })}
                  />
                  <Label htmlFor="hasSystemAccess">
                    Permitir acesso ao sistema S.I.G.M.A
                  </Label>
                </div>

                {formData.hasSystemAccess && (
                  <div className="space-y-4 pl-6">
                    <div className="space-y-2">
                      <Label htmlFor="systemRole">Nível de Acesso</Label>
                      <Select 
                        value={formData.systemRole || ''} 
                        onValueChange={(value) => setFormData({...formData, systemRole: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o nível de acesso" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrador (Acesso total)</SelectItem>
                          <SelectItem value="supervisor">Supervisor (Vendas e relatórios)</SelectItem>
                          <SelectItem value="cashier">Operador de Caixa (PDV apenas)</SelectItem>
                          <SelectItem value="stock">Estoquista (Inventário apenas)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="userId">ID de Usuário</Label>
                      <Input
                        id="userId"
                        value={formData.userId || ''}
                        onChange={(e) => setFormData({...formData, userId: e.target.value})}
                        placeholder="user_id_unico"
                      />
                      <p className="text-xs text-muted-foreground">
                        ID único para login no sistema. Será usado junto com a senha.
                      </p>
                    </div>

                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-medium mb-2">Permissões por Nível:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li><strong>Administrador:</strong> Acesso completo a todos os módulos</li>
                        <li><strong>Supervisor:</strong> Vendas, clientes, relatórios e equipe</li>
                        <li><strong>Operador de Caixa:</strong> Apenas sistema PDV</li>
                        <li><strong>Estoquista:</strong> Apenas controle de inventário</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Funcionário</DialogTitle>
            <DialogDescription>
              Informações completas do funcionário
            </DialogDescription>
          </DialogHeader>
          
          {selectedEmployee && (
            <div className="space-y-6">
              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Dados Pessoais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Nome</Label>
                      <p className="font-medium">{selectedEmployee.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">E-mail</Label>
                      <p>{selectedEmployee.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Telefones</Label>
                      <div className="space-y-1">
                        {selectedEmployee.phone.map((phone, index) => (
                          <p key={index}>{phone}</p>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Endereço</Label>
                      <div className="space-y-1">
                        <p>{selectedEmployee.address.street}, {selectedEmployee.address.number}</p>
                        <p>{selectedEmployee.address.neighborhood}</p>
                        <p>{selectedEmployee.address.city}, {selectedEmployee.address.state}</p>
                        <p>CEP: {selectedEmployee.address.zipCode}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Dados Profissionais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Matrícula</Label>
                      <p className="font-mono font-medium">{selectedEmployee.registration}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Cargo</Label>
                      <Badge variant={getPositionBadgeVariant(selectedEmployee.position) as any}>
                        {selectedEmployee.position}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Setor</Label>
                      <p>{selectedEmployee.department}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Salário</Label>
                      <p className="text-lg font-semibold text-success">
                        {formatCurrency(selectedEmployee.salary)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Turno</Label>
                      <p>{selectedEmployee.shift}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Data de Admissão</Label>
                      <p>{formatDate(selectedEmployee.hireDate)}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Hierarquia e Sistema */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Hierarquia
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Supervisor</Label>
                      <p>{getSupervisorName(selectedEmployee.supervisor)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                      <Badge variant={selectedEmployee.status === 'active' ? 'default' : 'secondary'}>
                        {selectedEmployee.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Acesso ao Sistema
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Possui Acesso</Label>
                      <div className="flex items-center gap-2">
                        {selectedEmployee.hasSystemAccess ? (
                          <>
                            <Shield className="h-4 w-4 text-success" />
                            <span className="text-success font-medium">Sim</span>
                          </>
                        ) : (
                          <span className="text-muted-foreground">Não</span>
                        )}
                      </div>
                    </div>
                    {selectedEmployee.hasSystemAccess && (
                      <>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Nível de Acesso</Label>
                          <p className="font-medium">{getSystemRoleLabel(selectedEmployee.systemRole)}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">ID de Usuário</Label>
                          <p className="font-mono">{selectedEmployee.userId}</p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}