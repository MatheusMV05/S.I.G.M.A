import { apiRequest } from './api';

export interface UsuarioData {
  id?: number;
  username: string;
  password?: string;
  role: string;
  status: string;
  ultimoAcesso?: string;
  dataCriacao?: string;
  nome: string;
  email: string;
  telefone?: string;
  cpf?: string;
  matricula?: string;
  salario?: number;
  cargo: string;
  setor: string;
  departamento?: string;
  dataAdmissao?: string;
  dataContratacao?: string;
  turno?: string;
  tipoContrato?: string;
  cargaHorariaSemanal?: number;
  comissaoPercentual?: number;
  metaMensal?: number;
  idSupervisor?: number;
  nomeSupervisor?: string;
}

export interface UsuarioStats {
  total: number;
  ativos: number;
  admins: number;
  users: number;
}

class UserService {
  /**
   * Lista todos os usuários
   */
  async getAll(filters?: { role?: string; status?: string }): Promise<UsuarioData[]> {
    const params = new URLSearchParams();
    if (filters?.role) params.append('role', filters.role);
    if (filters?.status) params.append('status', filters.status);
    
    const queryString = params.toString();
    const url = queryString ? `/usuarios?${queryString}` : '/usuarios';
    
    return await apiRequest<UsuarioData[]>(url, { method: 'GET' });
  }

  /**
   * Busca um usuário por ID
   */
  async getById(id: number): Promise<UsuarioData> {
    return await apiRequest<UsuarioData>(`/usuarios/${id}`, { method: 'GET' });
  }

  /**
   * Cria um novo usuário
   */
  async create(usuario: UsuarioData): Promise<UsuarioData> {
    return await apiRequest<UsuarioData>('/usuarios', {
      method: 'POST',
      body: JSON.stringify(usuario),
    });
  }

  /**
   * Atualiza um usuário
   */
  async update(id: number, usuario: Partial<UsuarioData>): Promise<UsuarioData> {
    return await apiRequest<UsuarioData>(`/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(usuario),
    });
  }

  /**
   * Atualiza apenas o status de um usuário
   */
  async updateStatus(id: number, status: string): Promise<UsuarioData> {
    return await apiRequest<UsuarioData>(`/usuarios/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  /**
   * Deleta um usuário
   */
  async delete(id: number): Promise<void> {
    await apiRequest<void>(`/usuarios/${id}`, { method: 'DELETE' });
  }

  /**
   * Obtém estatísticas de usuários
   */
  async getStats(): Promise<UsuarioStats> {
    return await apiRequest<UsuarioStats>('/usuarios/stats', { method: 'GET' });
  }
}

export default new UserService();
