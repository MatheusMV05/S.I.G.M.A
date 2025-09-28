import React, { createContext, useContext, useState, useEffect } from 'react';

// Tipos de usuário do sistema
export type UserRole = 'admin' | 'manager' | 'supervisor' | 'cashier' | 'stock';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  permissions?: string[];
}

// Definição de permissões por perfil
export const rolePermissions = {
  admin: [
    'Acesso Completo',
    'Gerenciamento de Usuários',
    'Relatórios Financeiros',
    'Relatórios de Vendas',
    'Relatórios de Estoque',
    'Ajustes de Preços',
    'Gerenciamento de Promoções',
    'Configurações do Sistema',
    'Backup e Restauração'
  ],
  manager: [
    'Gerenciamento de Estoque',
    'Cadastro de Produtos',
    'Controle de Estoque',
    'Escalas de Funcionários',
    'Aprovação de Férias',
    'Permissões Básicas',
    'Relatórios de Vendas',
    'Relatórios de Desempenho',
    'Relatórios de Perdas'
  ],
  supervisor: [
    'Relatórios de Estoque',
    'Relatórios de Vendas',
    'Aprovação de Cancelamentos',
    'Aprovação de Devoluções',
    'Fechamento de Caixa',
    'Consulta de Produtos',
    'Atendimento ao Cliente'
  ],
  cashier: [
    'Registro de Vendas',
    'Cancelamento Simples',
    'Consulta de Preços',
    'Disponibilidade de Produtos',
    'Atendimento ao Cliente',
    'Processamento de Pagamentos'
  ],
  stock: [
    'Entrada de Estoque',
    'Saída de Estoque',
    'Consulta de Inventário',
    'Relatório de Perdas',
    'Recebimento de Produtos',
    'Contagem de Estoque'
  ]
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (requiredRole: UserRole[]) => boolean;
  hasSpecificPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock de usuários para desenvolvimento
const mockUsers = [
  { 
    id: '1', 
    name: 'Carlos Oliveira', 
    email: 'admin@comprebem.com', 
    role: 'admin' as UserRole,
    department: 'Administração',
    permissions: rolePermissions.admin
  },
  { 
    id: '2', 
    name: 'Amanda Silva', 
    email: 'gerente@comprebem.com', 
    role: 'manager' as UserRole,
    department: 'Gerência',
    permissions: rolePermissions.manager
  },
  { 
    id: '3', 
    name: 'João Santos', 
    email: 'supervisor@comprebem.com', 
    role: 'supervisor' as UserRole,
    department: 'Supervisão',
    permissions: rolePermissions.supervisor
  },
  { 
    id: '4', 
    name: 'Maria Costa', 
    email: 'caixa@comprebem.com', 
    role: 'cashier' as UserRole,
    department: 'Caixa',
    permissions: rolePermissions.cashier
  },
  { 
    id: '5', 
    name: 'Pedro Lima', 
    email: 'estoque@comprebem.com', 
    role: 'stock' as UserRole,
    department: 'Estoque',
    permissions: rolePermissions.stock
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Simular verificação de token/sessão
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Verificar se há token armazenado
        const storedUser = localStorage.getItem('sigma_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simular delay de autenticação no servidor
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulação de autenticação
      const foundUser = mockUsers.find(u => u.email === email);
      
      // Senhas específicas para cada usuário (para demonstração)
      const validCredentials = {
        'admin@comprebem.com': '123456',
        'gerente@comprebem.com': '123456',
        'supervisor@comprebem.com': '123456',
        'caixa@comprebem.com': '123456',
        'estoque@comprebem.com': '123456'
      };
      
      if (foundUser && validCredentials[email as keyof typeof validCredentials] === password) {
        // Simular carregamento adicional do perfil do usuário
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setUser(foundUser);
        setIsAuthenticated(true);
        localStorage.setItem('sigma_user', JSON.stringify(foundUser));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro durante o login:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('sigma_user');
  };

  const hasPermission = (requiredRoles: UserRole[]): boolean => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  };

  const hasSpecificPermission = (permission: string): boolean => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission) || user.permissions.includes('full_access');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      hasPermission,
      hasSpecificPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}