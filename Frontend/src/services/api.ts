// Configuração base da API
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Headers padrão para as requisições
export const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Função utilitária para fazer requisições HTTP
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: getAuthHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      // Log mais detalhado para debugging
      console.error(`HTTP ${response.status} on ${endpoint}`);
      console.error('Headers sent:', config.headers);
      console.error('Token present:', !!localStorage.getItem('auth_token'));
      
      // Tentar extrair mensagem de erro do backend
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        // Se não conseguir parsear JSON, usar mensagens padrão
      }
      
      if (response.status === 403) {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          throw new Error('Token de autenticação não encontrado. Faça login novamente.');
        } else {
          throw new Error('Acesso negado. Token pode ter expirado. Faça login novamente.');
        }
      }
      
      if (response.status === 409) {
        // Conflito - mensagem do backend já está em errorMessage
        throw new Error(errorMessage);
      }
      
      if (response.status === 404) {
        throw new Error(errorMessage || 'Recurso não encontrado.');
      }
      
      if (response.status === 400) {
        throw new Error(errorMessage || 'Dados inválidos.');
      }
      
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return response as unknown as T;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
};

// Tipos de resposta padrão da API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
  timestamp: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Interceptor para renovar token automaticamente
export const refreshToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  const data = await response.json();
  localStorage.setItem('auth_token', data.accessToken);
  
  return data.accessToken;
};