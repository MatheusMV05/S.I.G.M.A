import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { DesktopOnlyPage } from '@/components/DesktopOnlyPage';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
  Users,
  Plus,
  Search,
  Edit,
  Eye,
  Trash2,
  UserCheck,
  UserX,
  Shield,
  ShieldCheck,
  Crown,
  Briefcase,
  UserCog,
  Package,
  Save,
  X,
  Filter,
  Star,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useAuth, UserRole, rolePermissions } from '@/contexts/AuthContext';

// Mock data expandido para todos os usuários
const mockAllUsers = [
  {
    id: '1',
    name: 'Carlos Oliveira',
    email: 'admin@comprebem.com',
    role: 'admin' as UserRole,
    department: 'Administração',
    status: 'active',
    lastLogin: '2024-12-02T10:30:00',
    createdAt: '2024-01-15T09:00:00',
    permissions: rolePermissions.admin,
    phone: '(11) 99999-0001',
    salary: 8000.00,
    hireDate: '2024-01-15'
  },
  {
    id: '2',
    name: 'Amanda Silva',
    email: 'gerente@comprebem.com',
    role: 'manager' as UserRole,
    department: 'Gerência',
    status: 'active',
    lastLogin: '2024-12-02T09:15:00',
    createdAt: '2024-02-01T09:00:00',
    permissions: rolePermissions.manager,
    phone: '(11) 99999-0002',
    salary: 6000.00,
    hireDate: '2024-02-01'
  },
  {
    id: '3',
    name: 'João Santos',
    email: 'supervisor@comprebem.com',
    role: 'supervisor' as UserRole,
    department: 'Supervisão',
    status: 'active',
    lastLogin: '2024-12-02T08:45:00',
    createdAt: '2024-03-10T09:00:00',
    permissions: rolePermissions.supervisor,
    phone: '(11) 99999-0003',
    salary: 4500.00,
    hireDate: '2024-03-10'
  },
  {
    id: '4',
    name: 'Maria Costa',
    email: 'caixa@comprebem.com',
    role: 'cashier' as UserRole,
    department: 'Caixa',
    status: 'active',
    lastLogin: '2024-12-01T18:30:00',
    createdAt: '2024-04-20T09:00:00',
    permissions: rolePermissions.cashier,
    phone: '(11) 99999-0004',
    salary: 2800.00,
    hireDate: '2024-04-20'
  },
  {
    id: '5',
    name: 'Pedro Lima',
    email: 'estoque@comprebem.com',
    role: 'stock' as UserRole,
    department: 'Estoque',
    status: 'active',
    lastLogin: '2024-12-02T07:00:00',
    createdAt: '2024-05-05T09:00:00',
    permissions: rolePermissions.stock,
    phone: '(11) 99999-0005',
    salary: 2500.00,
    hireDate: '2024-05-05'
  },
  {
    id: '6',
    name: 'Ana Ferreira',
    email: 'caixa2@comprebem.com',
    role: 'cashier' as UserRole,
    department: 'Caixa',
    status: 'inactive',
    lastLogin: '2024-11-28T17:30:00',
    createdAt: '2024-06-15T09:00:00',
    permissions: rolePermissions.cashier,
    phone: '(11) 99999-0006',
    salary: 2800.00,
    hireDate: '2024-06-15'
  }
];

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: string;
  lastLogin: string;
  createdAt: string;
  permissions: string[];
  phone: string;
  salary: number;
  hireDate: string;
}

export default function UserManagement() {
  const { user, hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [editMode, setEditMode] = useState(false);

  // Verificar se o usuário tem permissão para gerenciar usuários
  if (!hasPermission(['admin'])) {
    return (
      <div className="p-6">
        <div className="text-center">
          <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Acesso Restrito</h2>
          <p className="text-muted-foreground">
            Apenas administradores podem acessar a gestão de usuários.
          </p>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getRoleBadge = (role: UserRole) => {
    const roleConfig = {
      admin: { label: 'Administrador', variant: 'default' as const, icon: Crown },
      manager: { label: 'Gerente', variant: 'secondary' as const, icon: Briefcase },
      supervisor: { label: 'Supervisor', variant: 'outline' as const, icon: UserCog },
      cashier: { label: 'Operador Caixa', variant: 'outline' as const, icon: UserCheck },
      stock: { label: 'Estoquista', variant: 'outline' as const, icon: Package }
    };
    
    return roleConfig[role] || roleConfig.cashier;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Ativo', variant: 'default' as const, icon: UserCheck },
      inactive: { label: 'Inativo', variant: 'secondary' as const, icon: UserX },
      suspended: { label: 'Suspenso', variant: 'destructive' as const, icon: AlertTriangle }
    };
    
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
  };

  const filteredUsers = mockAllUsers.filter(userData => {
    const matchesSearch = userData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         userData.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         userData.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || userData.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || userData.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleEdit = (userData: User) => {
    setFormData(userData);
    setEditMode(true);
    setIsDialogOpen(true);
  };

  const handleNew = () => {
    setFormData({
      name: '',
      email: '',
      role: 'cashier',
      department: '',
      status: 'active',
      phone: '',
      salary: 0,
      hireDate: '',
      permissions: rolePermissions.cashier
    });
    setEditMode(false);
    setIsDialogOpen(true);
  };

  const handleDetails = (userData: User) => {
    setSelectedUser(userData);
    setIsDetailsOpen(true);
  };

  const handleSave = () => {
    const finalData = {
      ...formData,
      permissions: rolePermissions[formData.role as UserRole] || [],
      createdAt: editMode ? formData.createdAt : new Date().toISOString(),
      lastLogin: editMode ? formData.lastLogin : null
    };

    console.log('Salvando usuário:', finalData);
    setIsDialogOpen(false);
    setFormData({});
  };

  const getUserStats = () => {
    return {
      total: mockAllUsers.length,
      active: mockAllUsers.filter(u => u.status === 'active').length,
      admins: mockAllUsers.filter(u => u.role === 'admin').length,
      managers: mockAllUsers.filter(u => u.role === 'manager').length,
      supervisors: mockAllUsers.filter(u => u.role === 'supervisor').length,
      cashiers: mockAllUsers.filter(u => u.role === 'cashier').length,
      stockers: mockAllUsers.filter(u => u.role === 'stock').length
    };
  };

  const stats = getUserStats();

  return (
    <DesktopOnlyPage
      title="Gestão de Usuários"
      description="Sistema de gerenciamento de usuários, permissões e controle de acesso."
      features={[
        "Cadastro e edição de usuários do sistema",
        "Controle de permissões por função",
        "Gerenciamento de status (ativo/inativo)",
        "Histórico de acessos e atividades",
        "Relatórios de usuários e departamentos",
        "Configurações avançadas de segurança",
        "Auditoria de ações administrativas"
      ]}
    >
      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Usuários</h1>
          <p className="text-muted-foreground mt-1">
            Sistema de gerenciamento de usuários, permissões e controle de acesso.
            Gerencie contas de usuário e permissões do sistema
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleNew} className="bg-primary hover:bg-primary-hover">
            <Plus className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Ativos</p>
              <p className="text-2xl font-bold text-success">{stats.active}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Crown className="h-6 w-6 mx-auto mb-1 text-yellow-500" />
              <p className="text-xs text-muted-foreground">Admins</p>
              <p className="text-lg font-bold">{stats.admins}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Briefcase className="h-6 w-6 mx-auto mb-1 text-blue-500" />
              <p className="text-xs text-muted-foreground">Gerentes</p>
              <p className="text-lg font-bold">{stats.managers}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <UserCog className="h-6 w-6 mx-auto mb-1 text-purple-500" />
              <p className="text-xs text-muted-foreground">Supervisores</p>
              <p className="text-lg font-bold">{stats.supervisors}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <UserCheck className="h-6 w-6 mx-auto mb-1 text-green-500" />
              <p className="text-xs text-muted-foreground">Caixas</p>
              <p className="text-lg font-bold">{stats.cashiers}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Package className="h-6 w-6 mx-auto mb-1 text-orange-500" />
              <p className="text-xs text-muted-foreground">Estoque</p>
              <p className="text-lg font-bold">{stats.stockers}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Perfis</SelectItem>
            <SelectItem value="admin">Administrador</SelectItem>
            <SelectItem value="manager">Gerente</SelectItem>
            <SelectItem value="supervisor">Supervisor</SelectItem>
            <SelectItem value="cashier">Operador Caixa</SelectItem>
            <SelectItem value="stock">Estoquista</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="inactive">Inativos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabela de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Usuários do Sistema ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Último Acesso</TableHead>
                <TableHead>Salário</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((userData) => {
                const roleInfo = getRoleBadge(userData.role);
                const statusInfo = getStatusBadge(userData.status);
                const RoleIcon = roleInfo.icon;
                const StatusIcon = statusInfo.icon;
                
                return (
                  <TableRow key={userData.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{userData.name}</p>
                        <p className="text-sm text-muted-foreground">{userData.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={roleInfo.variant}>
                        <RoleIcon className="h-3 w-3 mr-1" />
                        {roleInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell>{userData.department}</TableCell>
                    <TableCell>
                      <Badge variant={statusInfo.variant}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {formatDateTime(userData.lastLogin)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-success">
                        {formatCurrency(userData.salary)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDetails(userData)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(userData)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {userData.id !== user?.id && (
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
                                  Tem certeza que deseja excluir o usuário "{userData.name}"? 
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
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de Cadastro/Edição */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editMode ? 'Editar Usuário' : 'Novo Usuário'}
            </DialogTitle>
            <DialogDescription>
              {editMode ? 'Altere os dados do usuário' : 'Cadastre um novo usuário no sistema'}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
              <TabsTrigger value="access">Acesso e Permissões</TabsTrigger>
              <TabsTrigger value="employment">Dados Funcionais</TabsTrigger>
            </TabsList>

            {/* Dados Básicos */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ex: João da Silva"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="joao@comprebem.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Perfil de Acesso *</Label>
                    <Select 
                      value={formData.role || 'cashier'} 
                      onValueChange={(value) => setFormData({...formData, role: value as UserRole, permissions: rolePermissions[value as UserRole]})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador/Dono</SelectItem>
                        <SelectItem value="manager">Gerente</SelectItem>
                        <SelectItem value="supervisor">Supervisor</SelectItem>
                        <SelectItem value="cashier">Operador de Caixa</SelectItem>
                        <SelectItem value="stock">Estoquista</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Departamento</Label>
                    <Input
                      id="department"
                      value={formData.department || ''}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      placeholder="Ex: Caixa, Estoque, Gerência"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={formData.status || 'active'} 
                      onValueChange={(value) => setFormData({...formData, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                        <SelectItem value="suspended">Suspenso</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Acesso e Permissões */}
            <TabsContent value="access" className="space-y-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Permissões do Perfil</h3>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(formData.permissions || []).map((permission) => (
                        <div key={permission} className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-success" />
                          <span className="text-sm">{permission}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted/20 rounded-lg">
                  <h4 className="font-medium mb-2">Descrição do Perfil:</h4>
                  <div className="text-sm text-muted-foreground">
                    {formData.role === 'admin' && (
                      <p>Acesso total ao sistema. Pode criar, editar e remover usuários. Acompanha relatórios financeiros, de vendas e de estoque. Aprova mudanças críticas.</p>
                    )}
                    {formData.role === 'manager' && (
                      <p>Gerência de Estoque e Funcionários. Cadastra produtos, controla entrada e saída, cria escalas, aprova férias. Visualiza relatórios de vendas e desempenho.</p>
                    )}
                    {formData.role === 'supervisor' && (
                      <p>Consulta relatórios de estoque e vendas. Autoriza cancelamentos e devoluções. Auxilia no fechamento de caixa. Não gerencia funcionários.</p>
                    )}
                    {formData.role === 'cashier' && (
                      <p>Registra vendas. Realiza cancelamentos simples. Consulta preços e disponibilidade de produtos. Não tem acesso a relatórios de estoque.</p>
                    )}
                    {formData.role === 'stock' && (
                      <p>Dá entrada e saída de mercadorias. Consulta saldo de estoque. Reporta perdas. Não cadastra novos produtos nem altera preços.</p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Dados Funcionais */}
            <TabsContent value="employment" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hireDate">Data de Contratação</Label>
                    <Input
                      id="hireDate"
                      type="date"
                      value={formData.hireDate || ''}
                      onChange={(e) => setFormData({...formData, hireDate: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salary">Salário</Label>
                    <Input
                      id="salary"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.salary || ''}
                      onChange={(e) => setFormData({...formData, salary: parseFloat(e.target.value) || 0})}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {editMode && (
                    <>
                      <div className="space-y-2">
                        <Label>Data de Criação</Label>
                        <p className="text-sm text-muted-foreground">
                          {formData.createdAt ? formatDateTime(formData.createdAt) : '--'}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>Último Acesso</Label>
                        <p className="text-sm text-muted-foreground">
                          {formData.lastLogin ? formatDateTime(formData.lastLogin) : 'Nunca acessou'}
                        </p>
                      </div>
                    </>
                  )}
                </div>
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
              Salvar Usuário
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Detalhes */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Usuário</DialogTitle>
            <DialogDescription>
              Informações completas e histórico de acesso
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-8">
              {/* Informações Básicas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {(() => {
                      const RoleIcon = getRoleBadge(selectedUser.role).icon;
                      return <RoleIcon className="h-5 w-5" />;
                    })()}
                    {selectedUser.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Email em linha separada para acomodar tamanhos variáveis */}
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">E-mail</Label>
                    <p className="font-medium text-sm break-all bg-muted/20 px-3 py-2 rounded-md border">{selectedUser.email}</p>
                  </div>
                  
                  {/* Outros campos em grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Telefone</Label>
                      <p className="font-medium">{selectedUser.phone}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Departamento</Label>
                      <p className="font-medium">{selectedUser.department}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Status</Label>
                      <Badge variant={getStatusBadge(selectedUser.status).variant}>
                        {getStatusBadge(selectedUser.status).label}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Data de Contratação</Label>
                      <p className="font-medium">{formatDate(selectedUser.hireDate)}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Salário</Label>
                      <p className="font-medium text-success">{formatCurrency(selectedUser.salary)}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Último Acesso</Label>
                      <p className="font-medium">{formatDateTime(selectedUser.lastLogin)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Permissões */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5" />
                    Permissões e Acesso
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-sm text-muted-foreground">Perfil de Acesso</Label>
                      <Badge variant={getRoleBadge(selectedUser.role).variant} className="ml-2">
                        {getRoleBadge(selectedUser.role).label}
                      </Badge>
                    </div>
                    
                    <div className="space-y-4">
                      <Label className="text-sm text-muted-foreground block">Permissões Ativas</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedUser.permissions.map((permission) => (
                          <div key={permission} className="flex items-center gap-3 p-3 bg-muted/30 rounded-md border border-muted/20">
                            <ShieldCheck className="h-4 w-4 text-success" />
                            <span className="text-sm">{permission}</span>
                          </div>
                        ))}
                      </div>
                    </div>
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