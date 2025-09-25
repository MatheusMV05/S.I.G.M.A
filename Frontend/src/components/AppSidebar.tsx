import React from 'react';
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
} from 'lucide-react';

// Definição dos itens de menu com permissões
const menuItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'supervisor', 'cashier', 'stock'] as UserRole[],
  },
  {
    title: 'Ponto de Venda',
    url: '/pos',
    icon: ShoppingCart,
    roles: ['cashier', 'admin'] as UserRole[],
  },
  {
    title: 'Produtos',
    url: '/products',
    icon: Package,
    roles: ['admin', 'stock'] as UserRole[],
  },
  {
    title: 'Estoque',
    url: '/inventory',
    icon: Warehouse,
    roles: ['admin', 'stock'] as UserRole[],
  },
];

const managementItems = [
  {
    title: 'Clientes',
    url: '/customers',
    icon: Users,
    roles: ['admin'] as UserRole[],
  },
  {
    title: 'Fornecedores',
    url: '/suppliers',
    icon: Building2,
    roles: ['admin'] as UserRole[],
  },
  {
    title: 'Funcionários',
    url: '/employees',
    icon: UserCheck,
    roles: ['admin'] as UserRole[],
  },
  {
    title: 'Categorias',
    url: '/categories',
    icon: Tag,
    roles: ['admin'] as UserRole[],
  },
  {
    title: 'Promoções',
    url: '/promotions',
    icon: Percent,
    roles: ['admin'] as UserRole[],
  },
];

const reportItems = [
  {
    title: 'Relatórios',
    url: '/reports',
    icon: BarChart3,
    roles: ['admin', 'supervisor'] as UserRole[],
  },
];

export function AppSidebar() {
  const { user, logout, hasPermission } = useAuth();
  const { state } = useSidebar();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const isCollapsed = state === 'collapsed';

  const handleLogout = () => {
    logout();
  };

  // Filtrar itens baseado nas permissões do usuário
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
                      className={({ isActive }) => 
                        isActive 
                          ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
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

        {/* Cadastros Gerais - Apenas para Admin */}
        {hasPermission(['admin']) && (
          <SidebarGroup>
            <SidebarGroupLabel>Cadastros</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filterItems(managementItems).map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url}
                        className={({ isActive }) => 
                          isActive 
                            ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
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

        {/* Relatórios - Admin e Supervisor */}
        {hasPermission(['admin', 'supervisor']) && (
          <SidebarGroup>
            <SidebarGroupLabel>Análises</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filterItems(reportItems).map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url}
                        className={({ isActive }) => 
                          isActive 
                            ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
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
        {!isCollapsed && user && (
          <div className="mb-4 p-3 bg-sidebar-accent rounded-lg">
            <p className="text-sm font-medium text-sidebar-accent-foreground">
              {user.name}
            </p>
            <p className="text-xs text-sidebar-accent-foreground/70 capitalize">
              {user.role === 'admin' ? 'Administrador' : 
               user.role === 'supervisor' ? 'Supervisor' :
               user.role === 'cashier' ? 'Operador de Caixa' : 'Estoquista'}
            </p>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground"
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span>Sair</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}