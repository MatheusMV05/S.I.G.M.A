import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { DesktopOnlyPage } from '@/components/DesktopOnlyPage';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  AlertTriangle
} from 'lucide-react';
import { useAuth, UserRole, rolePermissions } from '@/contexts/AuthContext';
import { useUsers } from '@/hooks/useUsers';
import { UsuarioData } from '@/services/userService';
import { useNotifications } from '@/contexts/NotificationContext';

// Mapeamento de roles do backend para o frontend
const roleMap: Record<string, UserRole> = {
  'ADMIN': 'ADMIN',
  'USER': 'CASHIER', // Mapeando USER do backend para CASHIER do frontend
};

const reverseRoleMap: Record<UserRole, string> = {
  'ADMIN': 'ADMIN',
  'MANAGER': 'USER',
  'SUPERVISOR': 'USER',
  'CASHIER': 'USER',
  'STOCK': 'USER',
};

export default function UserManagement() {
  const { user, hasPermission } = useAuth();
  const { addNotification } = useNotifications();
  const { 
    users, 
    stats, 
    loading, 
    createUser, 
    updateUser, 
    deleteUser, 
    refresh 
  } = useUsers();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<UsuarioData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<UsuarioData>>({});
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Verificar se o usuário tem permissão para gerenciar usuários
  if (!hasPermission(['ADMIN'])) {
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

  const formatDate = (dateString: string) => {
    if (!dateString) return '--';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'Nunca acessou';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getTimeSinceLastAccess = (dateString: string) => {
    if (!dateString) return { text: 'Nunca acessou', variant: 'secondary' as const };
    
    const now = new Date();
    const lastAccess = new Date(dateString);
    const diffMs = now.getTime() - lastAccess.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMinutes < 1) {
      return { text: 'Agora mesmo', variant: 'default' as const };
    } else if (diffMinutes < 60) {
      return { text: `${diffMinutes} min atrás`, variant: 'default' as const };
    } else if (diffHours < 24) {
      return { text: `${diffHours}h atrás`, variant: 'default' as const };
    } else if (diffDays === 1) {
      return { text: 'Ontem', variant: 'secondary' as const };
    } else if (diffDays < 7) {
      return { text: `${diffDays} dias atrás`, variant: 'secondary' as const };
    } else {
      return { text: formatDate(dateString), variant: 'outline' as const };
    }
  };

  const getRoleBadge = (role: string) => {
    // Mapear role do backend para exibição
    const displayRole = roleMap[role] || 'CASHIER';
    
    const roleConfig = {
      ADMIN: { label: 'Administrador', variant: 'default' as const, icon: Crown },
      MANAGER: { label: 'Gerente', variant: 'secondary' as const, icon: Briefcase },
      SUPERVISOR: { label: 'Supervisor', variant: 'outline' as const, icon: UserCog },
      CASHIER: { label: 'Usuário', variant: 'outline' as const, icon: UserCheck },
      STOCK: { label: 'Estoquista', variant: 'outline' as const, icon: Package }
    };
    
    return roleConfig[displayRole] || roleConfig.CASHIER;
  };

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status?.toUpperCase();
    const statusConfig = {
      ATIVO: { label: 'Ativo', variant: 'default' as const, icon: UserCheck },
      INATIVO: { label: 'Inativo', variant: 'secondary' as const, icon: UserX },
      SUSPENDED: { label: 'Suspenso', variant: 'destructive' as const, icon: AlertTriangle }
    };
    
    return statusConfig[normalizedStatus as keyof typeof statusConfig] || statusConfig.ATIVO;
  };

  const filteredUsers = users.filter(userData => {
    const matchesSearch = userData.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         userData.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         userData.setor?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Mapear o filtro do frontend para o backend
    let backendRole = roleFilter;
    if (roleFilter !== 'all') {
      const displayRole = roleFilter.toUpperCase() as UserRole;
      backendRole = reverseRoleMap[displayRole] || 'USER';
    }
    
    const matchesRole = roleFilter === 'all' || userData.role === backendRole;
    const matchesStatus = statusFilter === 'all' || userData.status?.toUpperCase() === statusFilter.toUpperCase();
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleEdit = (userData: UsuarioData) => {
    setFormData(userData);
    setEditMode(true);
    setIsDialogOpen(true);
  };

  const handleNew = () => {
    setFormData({
      username: '',
      password: '',
      role: 'USER',
      status: 'ATIVO',
      nome: '',
      email: '',
      cargo: '',
      setor: '',
      salario: 0,
    });
    setEditMode(false);
    setIsDialogOpen(true);
  };

  const handleDetails = (userData: UsuarioData) => {
    setSelectedUser(userData);
    setIsDetailsOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (editMode && formData.id) {
        await updateUser(formData.id, formData);
        addNotification({
          type: 'success',
          title: 'Sucesso',
          message: 'Usuário atualizado com sucesso!',
          priority: 'medium'
        });
      } else {
        // Criar novo usuário requer ID do funcionário
        if (!formData.id) {
          addNotification({
            type: 'error',
            title: 'Erro',
            message: 'É necessário selecionar um funcionário',
            priority: 'high'
          });
          return;
        }
        await createUser(formData as UsuarioData);
        addNotification({
          type: 'success',
          title: 'Sucesso',
          message: 'Usuário criado com sucesso!',
          priority: 'medium'
        });
      }
      setIsDialogOpen(false);
      setFormData({});
      refresh();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erro ao salvar usuário';
      addNotification({
        type: 'error',
        title: 'Erro',
        message: errorMsg,
        priority: 'high'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      addNotification({
        type: 'success',
        title: 'Sucesso',
        message: 'Usuário excluído com sucesso!',
        priority: 'medium'
      });
      refresh();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erro ao excluir usuário';
      addNotification({
        type: 'error',
        title: 'Erro',
        message: errorMsg,
        priority: 'high'
      });
    }
  };

  const getUserStats = () => {
    if (stats) {
      return {
        total: stats.total,
        active: stats.ativos,
        admins: stats.admins,
        users: stats.users,
      };
    }
    
    return {
      total: users.length,
      active: users.filter(u => u.status === 'ATIVO').length,
      admins: users.filter(u => u.role === 'ADMIN').length,
      users: users.filter(u => u.role === 'USER').length,
    };
  };

  const calculatedStats = getUserStats();

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{calculatedStats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Ativos</p>
              <p className="text-2xl font-bold text-success">{calculatedStats.active}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Crown className="h-6 w-6 mx-auto mb-1 text-yellow-500" />
              <p className="text-xs text-muted-foreground">Admins</p>
              <p className="text-lg font-bold">{calculatedStats.admins}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <UserCheck className="h-6 w-6 mx-auto mb-1 text-blue-500" />
              <p className="text-xs text-muted-foreground">Usuários</p>
              <p className="text-lg font-bold">{calculatedStats.users}</p>
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
            <SelectItem value="cashier">Usuário</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="ATIVO">Ativos</SelectItem>
            <SelectItem value="INATIVO">Inativos</SelectItem>
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Carregando usuários...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhum usuário encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((userData) => {
                  const roleInfo = getRoleBadge(userData.role);
                  const statusInfo = getStatusBadge(userData.status);
                  const lastAccessInfo = getTimeSinceLastAccess(userData.ultimoAcesso || '');
                  const RoleIcon = roleInfo.icon;
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <TableRow key={userData.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{userData.nome}</p>
                          <p className="text-sm text-muted-foreground">{userData.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={roleInfo.variant}>
                          <RoleIcon className="h-3 w-3 mr-1" />
                          {roleInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>{userData.setor || '--'}</TableCell>
                      <TableCell>
                        <Badge variant={statusInfo.variant}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <Badge variant={lastAccessInfo.variant} className="w-fit text-xs">
                            {lastAccessInfo.text}
                          </Badge>
                          {userData.ultimoAcesso && (
                            <span className="text-xs text-muted-foreground mt-1">
                              {formatDateTime(userData.ultimoAcesso)}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-success">
                          {userData.salario 
                            ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(userData.salario)
                            : '--'
                          }
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
                          {String(userData.id) !== String(user?.id) && (
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
                                    Tem certeza que deseja excluir o usuário "{userData.nome}"? 
                                    Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction 
                                    className="bg-destructive hover:bg-destructive/90"
                                    onClick={() => handleDelete(userData.id!)}
                                  >
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
                })
              )}
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
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      value={formData.nome || ''}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      placeholder="Ex: João da Silva"
                      disabled={editMode}
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
                      disabled={editMode}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={formData.telefone || ''}
                      onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                      placeholder="(11) 99999-9999"
                      disabled={editMode}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username *</Label>
                    <Input
                      id="username"
                      value={formData.username || ''}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      placeholder="usuario.sistema"
                      disabled={editMode}
                    />
                  </div>

                  {!editMode && (
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password || ''}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        placeholder="Mínimo 6 caracteres"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="role">Perfil de Acesso *</Label>
                    <Select 
                      value={formData.role || 'USER'} 
                      onValueChange={(value) => setFormData({...formData, role: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADMIN">Administrador</SelectItem>
                        <SelectItem value="USER">Usuário</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={formData.status || 'ATIVO'} 
                      onValueChange={(value) => setFormData({...formData, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ATIVO">Ativo</SelectItem>
                        <SelectItem value="INATIVO">Inativo</SelectItem>
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
                      {(rolePermissions[formData.role === 'ADMIN' ? 'ADMIN' : 'CASHIER'] || []).map((permission) => (
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
                    {formData.role === 'ADMIN' && (
                      <p>Acesso total ao sistema. Pode criar, editar e remover usuários. Acompanha relatórios financeiros, de vendas e de estoque. Aprova mudanças críticas.</p>
                    )}
                    {formData.role === 'USER' && (
                      <p>Acesso básico ao sistema. Pode realizar operações cotidianas como vendas, consultas e movimentações de estoque conforme seu cargo.</p>
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
                    <Label htmlFor="cargo">Cargo</Label>
                    <Input
                      id="cargo"
                      value={formData.cargo || ''}
                      onChange={(e) => setFormData({...formData, cargo: e.target.value})}
                      placeholder="Ex: Gerente, Caixa, Estoquista"
                      disabled={editMode}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="setor">Setor/Departamento</Label>
                    <Input
                      id="setor"
                      value={formData.setor || ''}
                      onChange={(e) => setFormData({...formData, setor: e.target.value})}
                      placeholder="Ex: Vendas, Estoque, Administrativo"
                      disabled={editMode}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dataAdmissao">Data de Admissão</Label>
                    <Input
                      id="dataAdmissao"
                      type="date"
                      value={formData.dataAdmissao || ''}
                      onChange={(e) => setFormData({...formData, dataAdmissao: e.target.value})}
                      disabled={editMode}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salario">Salário</Label>
                    <Input
                      id="salario"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.salario || ''}
                      onChange={(e) => setFormData({...formData, salario: parseFloat(e.target.value) || 0})}
                      placeholder="0.00"
                      disabled={editMode}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {editMode && (
                    <>
                      <div className="space-y-2">
                        <Label>Matrícula</Label>
                        <p className="text-sm text-muted-foreground">
                          {formData.matricula || '--'}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>CPF</Label>
                        <p className="text-sm text-muted-foreground">
                          {formData.cpf || '--'}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>Último Acesso</Label>
                        <p className="text-sm text-muted-foreground">
                          {formData.ultimoAcesso ? formatDateTime(formData.ultimoAcesso) : 'Nunca acessou'}
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
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSave} 
              className="bg-primary hover:bg-primary-hover"
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Salvando...' : 'Salvar Usuário'}
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
                    {selectedUser.nome}
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
                      <Label className="text-sm text-muted-foreground">Username</Label>
                      <p className="font-medium">{selectedUser.username}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Telefone</Label>
                      <p className="font-medium">{selectedUser.telefone || '--'}</p>
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
                      <Label className="text-sm text-muted-foreground">Cargo</Label>
                      <p className="font-medium">{selectedUser.cargo || '--'}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Setor</Label>
                      <p className="font-medium">{selectedUser.setor || '--'}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Matrícula</Label>
                      <p className="font-medium">{selectedUser.matricula || '--'}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Data de Admissão</Label>
                      <p className="font-medium">{selectedUser.dataAdmissao ? formatDate(selectedUser.dataAdmissao) : '--'}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Salário</Label>
                      <p className="font-medium text-success">
                        {selectedUser.salario 
                          ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedUser.salario)
                          : '--'
                        }
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Último Acesso</Label>
                      <p className="font-medium">{formatDateTime(selectedUser.ultimoAcesso || '')}</p>
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
                        {(rolePermissions[selectedUser.role === 'ADMIN' ? 'ADMIN' : 'CASHIER'] || []).map((permission) => (
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