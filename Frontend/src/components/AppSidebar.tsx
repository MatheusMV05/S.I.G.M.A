import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { SigmaLogo } from '@/components/SigmaLogo';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Warehouse,
  Users,
  BarChart3,
  LogOut,
  Building2,
  Tag,
  UserCheck,
  Percent,
  UserCog,
  User,
  UserCircle,
  Key,
  Shield,
  Eye,
  EyeOff,
  ChevronUp,
  PieChart,
  Briefcase,
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

// Definição dos itens de menu com permissões
const menuItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
    roles: ['ADMIN', 'MANAGER', 'SUPERVISOR', 'CASHIER', 'STOCK'] as UserRole[],
  },
  {
    title: 'Ponto de Venda',
    url: '/pos',
    icon: ShoppingCart,
    roles: ['ADMIN', 'MANAGER', 'SUPERVISOR', 'CASHIER'] as UserRole[],
  },
  {
    title: 'Produtos',
    url: '/products',
    icon: Package,
    roles: ['ADMIN', 'MANAGER', 'STOCK'] as UserRole[],
  },
  {
    title: 'Movimentações',
    url: '/inventory',
    icon: Warehouse,
    roles: ['ADMIN', 'MANAGER', 'SUPERVISOR', 'STOCK'] as UserRole[],
  },
];

const managementItems = [
  {
    title: 'Clientes',
    url: '/customers',
    icon: Users,
    roles: ['ADMIN', 'MANAGER', 'SUPERVISOR'] as UserRole[],
  },
  {
    title: 'Fornecedores',
    url: '/suppliers',
    icon: Building2,
    roles: ['ADMIN', 'MANAGER'] as UserRole[],
  },
  {
    title: 'Funcionários',
    url: '/employees',
    icon: UserCheck,
    roles: ['ADMIN', 'MANAGER'] as UserRole[],
  },
  {
    title: 'RH',
    url: '/rh',
    icon: Briefcase,
    roles: ['ADMIN', 'MANAGER'] as UserRole[],
  },
  {
    title: 'Categorias',
    url: '/categories',
    icon: Tag,
    roles: ['ADMIN', 'MANAGER'] as UserRole[],
  },
  {
    title: 'Promoções',
    url: '/promotions',
    icon: Percent,
    roles: ['ADMIN'] as UserRole[],
  },
];

const systemItems = [
  {
    title: 'Usuários',
    url: '/users',
    icon: UserCog,
    roles: ['ADMIN'] as UserRole[],
  },
];

const reportItems = [
  {
    title: 'Insights',
    url: '/insights',
    icon: BarChart3,
    roles: ['ADMIN', 'MANAGER', 'SUPERVISOR'] as UserRole[],
  },
  {
    title: 'Comportamento do Cliente',
    url: '/charts',
    icon: PieChart,
    roles: ['ADMIN', 'MANAGER', 'SUPERVISOR'] as UserRole[],
  },
];

export function AppSidebar() {
  const { user, logout, hasPermission } = useAuth();
  const { state, isMobile } = useSidebar();
  const location = useLocation();
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    department: user?.department || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const isActive = (path: string) => location.pathname === path;
  const isCollapsed = state === 'collapsed' && !isMobile;

  const handleLogout = () => {
    logout();
  };

  const handleSaveProfile = () => {
    console.log('Salvando dados do perfil:', profileData);
    setIsProfileDialogOpen(false);
  };

  const handleChangePassword = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('A nova senha e a confirmação não coincidem.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    console.log('Trocando senha do usuário:', user?.id);
    
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setIsPasswordDialogOpen(false);
    alert('Senha alterada com sucesso!');
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Administrador';
      case 'MANAGER': return 'Gerente';
      case 'SUPERVISOR': return 'Supervisor';
      case 'CASHIER': return 'Operador de Caixa';
      case 'STOCK': return 'Estoquista';
      default: return 'Usuário';
    }
  };

  const filterItems = (items: typeof menuItems) => {
    return items.filter(item => hasPermission(item.roles));
  };

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <SigmaLogo 
          size="lg" 
          showText={!isCollapsed}
          variant="default"
          hideTextCompletely={isCollapsed}
        />
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Menu Principal */}
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filterItems(menuItems).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={
                        isActive(item.url) 
                          ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-4 border-sidebar-primary"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Cadastros Gerais - Admin e Gerente */}
        {hasPermission(['ADMIN', 'MANAGER']) && (
          <SidebarGroup>
            <SidebarGroupLabel>Cadastros</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filterItems(managementItems).map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url}
                        className={
                          isActive(item.url) 
                            ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-4 border-sidebar-primary"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Insights e Análises - Admin, Gerente e Supervisor */}
        {hasPermission(['ADMIN', 'MANAGER', 'SUPERVISOR']) && (
          <SidebarGroup>
            <SidebarGroupLabel>Análises</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filterItems(reportItems).map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url}
                        className={
                          isActive(item.url) 
                            ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-4 border-sidebar-primary"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Sistema - Apenas Admin */}
        {hasPermission(['ADMIN']) && (
          <SidebarGroup>
            <SidebarGroupLabel>Sistema</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filterItems(systemItems).map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url}
                        className={
                          isActive(item.url) 
                            ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-4 border-sidebar-primary"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        {user && (
          <div className="space-y-3">
            {/* Menu do Usuário */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start p-3 bg-sidebar-accent rounded-lg hover:bg-sidebar-accent/80 ${isCollapsed ? 'px-2' : ''}`}
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  {!isCollapsed && (
                    <div className="flex-1 text-left ml-3">
                      <p className="text-sm font-medium text-sidebar-accent-foreground truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-sidebar-accent-foreground/70">
                        {getRoleLabel(user.role)}
                      </p>
                    </div>
                  )}
                  {!isCollapsed && (
                    <ChevronUp className="h-4 w-4 text-sidebar-accent-foreground/50 flex-shrink-0" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent 
                align={isCollapsed ? "center" : "start"} 
                side={isCollapsed ? "right" : "top"}
                className="w-56"
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={() => setIsProfileDialogOpen(true)}>
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Minha Conta</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => setIsPasswordDialogOpen(true)}>
                  <Key className="mr-2 h-4 w-4" />
                  <span>Trocar Senha</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </SidebarFooter>

      {/* Dialog de Edição do Perfil */}
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCircle className="h-5 w-5" />
              Minha Conta
            </DialogTitle>
            <DialogDescription>
              Edite suas informações pessoais e de conta
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Informações do Perfil */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{user?.name}</p>
                  <Badge variant="secondary" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    {getRoleLabel(user?.role || '')}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Formulário de Edição */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  placeholder="Seu nome completo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  placeholder="seu@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Departamento</Label>
                <Input
                  id="department"
                  value={profileData.department}
                  onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                  placeholder="Seu departamento"
                  disabled
                />
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setIsProfileDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleSaveProfile}>
                Salvar Alterações
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Trocar Senha */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Trocar Senha
            </DialogTitle>
            <DialogDescription>
              Digite sua senha atual e defina uma nova senha segura
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Informações de Segurança */}
            <div className="bg-muted/20 p-4 rounded-lg border border-muted/40">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Dicas de Segurança
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Use pelo menos 6 caracteres</li>
                <li>• Combine letras, números e símbolos</li>
                <li>• Não reutilize senhas antigas</li>
              </ul>
            </div>

            {/* Formulário de Trocar Senha */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Senha Atual</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    placeholder="Digite sua senha atual"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    placeholder="Digite sua nova senha"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    placeholder="Confirme sua nova senha"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsPasswordDialogOpen(false);
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleChangePassword}>
                Alterar Senha
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
}