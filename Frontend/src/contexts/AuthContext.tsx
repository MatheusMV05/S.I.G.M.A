import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services';
import type { User, UserRole } from '@/services/types';

// Re-exportar tipos para manter compatibilidade
export type { User, UserRole } from '@/services/types';

// Definição de permissões por perfil (mantido para compatibilidade com sistema legado)
export const rolePermissions = {
  ADMIN: [
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
  MANAGER: [
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
  SUPERVISOR: [
    'Relatórios de Estoque',
    'Relatórios de Vendas',
    'Aprovação de Cancelamentos',
    'Aprovação de Devoluções',
    'Fechamento de Caixa',
    'Consulta de Produtos',
    'Atendimento ao Cliente'
  ],
  CASHIER: [
    'Registro de Vendas',
    'Cancelamento Simples',
    'Consulta de Preços',
    'Disponibilidade de Produtos',
    'Atendimento ao Cliente',
    'Processamento de Pagamentos'
  ],
  STOCK: [
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
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
  hasSpecificPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Verificar se há usuário logado
        if (authService.isAuthenticated()) {
          const currentUser = authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            setIsAuthenticated(true);
          } else {
            // Token existe mas usuário não, fazer logout
            await authService.logout();
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        // Em caso de erro, fazer logout para garantir estado limpo
        await authService.logout();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await authService.login({ username, password });
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error('Erro durante o login:', error);
      setUser(null);
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch (error) {
      console.error('Erro durante o logout:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  const hasPermission = (requiredRoles: UserRole[]): boolean => {
    return authService.hasPermission(requiredRoles);
  };

  const hasSpecificPermission = (permission: string): boolean => {
    return authService.hasSpecificPermission(permission);
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