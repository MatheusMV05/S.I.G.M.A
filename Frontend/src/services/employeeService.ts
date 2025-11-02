import { apiRequest } from './api';

// Enums baseados no backend
export enum StatusFuncionario {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO'
}

export enum TurnoTrabalho {
  MANHA = 'MANHA',
  TARDE = 'TARDE',
  NOITE = 'NOITE',
  INTEGRAL = 'INTEGRAL'
}

export enum TipoContrato {
  CLT = 'CLT',
  PJ = 'PJ',
  ESTAGIO = 'ESTAGIO',
  TEMPORARIO = 'TEMPORARIO',
  AUTONOMO = 'AUTONOMO'
}

// Interface completa do Funcionário (DTO do backend)
export interface Funcionario {
  id_pessoa: number; // PK - referência à tabela Pessoa
  matricula: string;
  cargo: string;
  setor: string;
  salario: number;
  data_admissao: string;
  id_supervisor?: number;
  status: StatusFuncionario;
  
  // Novos campos de RH
  turno: TurnoTrabalho;
  tipo_contrato: TipoContrato;
  carga_horaria_semanal: number;
  data_desligamento?: string;
  motivo_desligamento?: string;
  beneficios?: string;
  observacoes?: string;
  foto_url?: string;
  data_ultima_promocao?: string;
  comissao_percentual: number;
  meta_mensal: number;
  
  // Dados da pessoa (do JOIN)
  nome: string;
  cpf: string;
  data_nascimento?: string;
  rua?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  email?: string;
  
  // Telefones (array)
  telefones: string[];
  
  // Campos calculados
  meses_empresa?: number;
  anos_empresa?: number;
  vendas_mes_atual?: number;
  valor_vendas_mes_atual?: number;
  usuario_sistema?: string;
  perfil_sistema?: string;
  nome_supervisor?: string;
}

// Request para criar funcionário
export interface CreateFuncionarioRequest {
  // Dados da Pessoa
  nome: string;
  cpf: string;
  data_nascimento?: string;
  rua?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  email?: string;
  telefone: string; // Backend espera telefone singular (obrigatório)
  
  // Dados do Funcionário
  matricula: string;
  cargo: string;
  setor: string;
  salario: number;
  data_admissao: string;
  id_supervisor?: number;
  turno?: TurnoTrabalho;
  tipo_contrato?: TipoContrato;
  carga_horaria_semanal?: number;
  comissao_percentual?: number;
  meta_mensal?: number;
  beneficios?: string;
  observacoes?: string;
  foto_url?: string;
}

// Estatísticas por setor
export interface EstatisticasSetor {
  setor: string;
  total_funcionarios: number;
  funcionarios_ativos: number;
  funcionarios_inativos: number;
  salario_medio: number;
  salario_total: number;
}

class EmployeeService {
  private static instance: EmployeeService;
  
  public static getInstance(): EmployeeService {
    if (!EmployeeService.instance) {
      EmployeeService.instance = new EmployeeService();
    }
    return EmployeeService.instance;
  }

  /**
   * Busca todos os funcionários com filtros opcionais
   * Endpoint: GET /api/funcionarios?cargo=&setor=&status=
   */
  async getEmployees(params?: {
    cargo?: string;
    setor?: string;
    status?: StatusFuncionario;
  }): Promise<Funcionario[]> {
    const queryParams = new URLSearchParams();
    
    if (params?.cargo) queryParams.set('cargo', params.cargo);
    if (params?.setor) queryParams.set('setor', params.setor);
    if (params?.status) queryParams.set('status', params.status);

    const queryString = queryParams.toString();
    const endpoint = `/funcionarios${queryString ? `?${queryString}` : ''}`;

    return await apiRequest<Funcionario[]>(endpoint);
  }

  /**
   * Busca apenas funcionários ativos (para dropdowns)
   * Endpoint: GET /api/funcionarios/ativos
   */
  async getActiveEmployees(): Promise<Funcionario[]> {
    return await apiRequest<Funcionario[]>('/funcionarios/ativos');
  }

  /**
   * Busca funcionário por ID
   * Endpoint: GET /api/funcionarios/{id}
   */
  async getEmployeeById(id: number): Promise<Funcionario> {
    return await apiRequest<Funcionario>(`/funcionarios/${id}`);
  }

  /**
   * Busca funcionário por matrícula
   * Endpoint: GET /api/funcionarios/matricula/{matricula}
   */
  async getEmployeeByMatricula(matricula: string): Promise<Funcionario> {
    return await apiRequest<Funcionario>(`/funcionarios/matricula/${matricula}`);
  }

  /**
   * Cria um novo funcionário
   * Endpoint: POST /api/funcionarios
   */
  async createEmployee(employeeData: CreateFuncionarioRequest): Promise<Funcionario> {
    return await apiRequest<Funcionario>('/funcionarios', {
      method: 'POST',
      body: JSON.stringify(employeeData),
    });
  }

  /**
   * Atualiza um funcionário existente
   * Endpoint: PUT /api/funcionarios/{id}
   */
  async updateEmployee(id: number, employeeData: Partial<CreateFuncionarioRequest>): Promise<Funcionario> {
    return await apiRequest<Funcionario>(`/funcionarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employeeData),
    });
  }

  /**
   * Exclui um funcionário
   * Endpoint: DELETE /api/funcionarios/{id}
   */
  async deleteEmployee(id: number): Promise<void> {
    await apiRequest<void>(`/funcionarios/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Ativa/desativa um funcionário
   * Endpoint: PATCH /api/funcionarios/{id}/status
   */
  async toggleEmployeeStatus(id: number): Promise<Funcionario> {
    return await apiRequest<Funcionario>(`/funcionarios/${id}/status`, {
      method: 'PATCH',
    });
  }

  /**
   * Busca estatísticas agrupadas por setor
   * Endpoint: GET /api/funcionarios/stats/setor
   */
  async getStatsByDepartment(): Promise<EstatisticasSetor[]> {
    return await apiRequest<EstatisticasSetor[]>('/funcionarios/stats/setor');
  }

  /**
   * Busca funcionários por turno
   * Endpoint personalizado (pode criar no controller se necessário)
   */
  async getEmployeesByShift(turno: TurnoTrabalho): Promise<Funcionario[]> {
    return await apiRequest<Funcionario[]>(`/funcionarios?turno=${turno}`);
  }

  /**
   * Busca setores únicos
   */
  async getDepartments(): Promise<string[]> {
    try {
      const employees = await this.getActiveEmployees();
      return Array.from(new Set(employees.map(emp => emp.setor))).sort();
    } catch (error) {
      console.error('Error fetching departments:', error);
      return [];
    }
  }

  /**
   * Busca cargos únicos
   */
  async getPositions(): Promise<string[]> {
    try {
      const employees = await this.getActiveEmployees();
      return Array.from(new Set(employees.map(emp => emp.cargo))).sort();
    } catch (error) {
      console.error('Error fetching positions:', error);
      return [];
    }
  }

  /**
   * Formata enum de turno para exibição
   */
  formatShift(turno: TurnoTrabalho): string {
    const shifts = {
      MANHA: 'Manhã (06:00 - 14:00)',
      TARDE: 'Tarde (14:00 - 22:00)',
      NOITE: 'Noite (22:00 - 06:00)',
      INTEGRAL: 'Integral (08:00 - 18:00)'
    };
    return shifts[turno] || turno;
  }

  /**
   * Formata enum de tipo de contrato para exibição
   */
  formatContractType(tipo: TipoContrato): string {
    const types = {
      CLT: 'CLT - Consolidação das Leis do Trabalho',
      PJ: 'PJ - Pessoa Jurídica',
      ESTAGIO: 'Estágio',
      TEMPORARIO: 'Temporário',
      AUTONOMO: 'Autônomo'
    };
    return types[tipo] || tipo;
  }

  /**
   * Calcula tempo de empresa em formato legível
   */
  calculateServiceTime(dataAdmissao: string): string {
    const admissionDate = new Date(dataAdmissao);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - admissionDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const anos = Math.floor(diffDays / 365);
    const meses = Math.floor((diffDays % 365) / 30);
    
    if (anos > 0) {
      return meses > 0 ? `${anos} ano(s) e ${meses} mês(es)` : `${anos} ano(s)`;
    }
    return `${meses} mês(es)`;
  }
}

export const employeeService = EmployeeService.getInstance();