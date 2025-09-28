import { apiRequest } from './api';
import type { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  User 
} from './types';

class AuthService {
  private static instance: AuthService;
  
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Realiza login do usuário
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Armazena os tokens no localStorage
    localStorage.setItem('auth_token', response.accessToken);
    localStorage.setItem('refresh_token', response.refreshToken);
    localStorage.setItem('user_data', JSON.stringify(response.user));

    return response;
  }

  /**
   * Realiza logout do usuário
   */
  async logout(): Promise<void> {
    try {
      await apiRequest('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      // Remove dados do localStorage independente do resultado da API
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
    }
  }

  /**
   * Registra um novo usuário
   */
  async register(userData: RegisterRequest): Promise<User> {
    return await apiRequest<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  /**
   * Renova o token de acesso
   */
  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      throw new Error('Token de refresh não encontrado');
    }

    const response = await apiRequest<{ accessToken: string }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    localStorage.setItem('auth_token', response.accessToken);
    return response.accessToken;
  }

  /**
   * Verifica se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    return !!token;
  }

  /**
   * Obtém dados do usuário atual
   */
  getCurrentUser(): User | null {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Atualiza perfil do usuário atual
   */
  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await apiRequest<User>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });

    // Atualiza dados no localStorage
    localStorage.setItem('user_data', JSON.stringify(response));
    return response;
  }

  /**
   * Altera senha do usuário atual
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await apiRequest('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({
        oldPassword,
        newPassword,
      }),
    });
  }

  /**
   * Solicita reset de senha
   */
  async requestPasswordReset(email: string): Promise<void> {
    await apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  /**
   * Confirma reset de senha
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        token,
        newPassword,
      }),
    });
  }

  /**
   * Verifica se o usuário tem determinada permissão
   */
  hasPermission(requiredRoles: string[]): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    return requiredRoles.includes(user.role);
  }

  /**
   * Verifica se o usuário tem permissão específica
   */
  hasSpecificPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.permissions) return false;

    return user.permissions.includes(permission);
  }
}

export const authService = AuthService.getInstance();