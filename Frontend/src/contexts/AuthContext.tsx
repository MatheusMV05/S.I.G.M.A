import React, { createContext, useContext, useState, useEffect } from 'react';

// Tipos de usuário do sistema
export type UserRole = 'admin' | 'supervisor' | 'cashier' | 'stock';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (requiredRole: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock de usuários para desenvolvimento
const mockUsers = [
  { id: '1', name: 'Administrador', email: 'admin@comprebem.com', role: 'admin' as UserRole },
  { id: '2', name: 'João Silva', email: 'supervisor@comprebem.com', role: 'supervisor' as UserRole },
  { id: '3', name: 'Maria Santos', email: 'caixa@comprebem.com', role: 'cashier' as UserRole },
  { id: '4', name: 'Pedro Costa', email: 'estoque@comprebem.com', role: 'stock' as UserRole },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar se há token armazenado
    const storedUser = localStorage.getItem('sigma_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulação de autenticação
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === '123456') { // Mock password
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('sigma_user', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
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

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      logout,
      hasPermission
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