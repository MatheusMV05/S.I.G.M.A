import { apiRequest } from './api';
import type { 
  Employee, 
  CreateEmployeeRequest, 
  PaginatedResponse 
} from './types';

class EmployeeService {
  private static instance: EmployeeService;
  
  public static getInstance(): EmployeeService {
    if (!EmployeeService.instance) {
      EmployeeService.instance = new EmployeeService();
    }
    return EmployeeService.instance;
  }

  /**
   * Busca funcionários com paginação e filtros
   */
  async getEmployees(params?: {
    page?: number;
    size?: number;
    search?: string;
    department?: string;
    position?: string;
    active?: boolean;
  }): Promise<PaginatedResponse<Employee>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page !== undefined) queryParams.set('page', params.page.toString());
    if (params?.size !== undefined) queryParams.set('size', params.size.toString());
    if (params?.search) queryParams.set('search', params.search);
    if (params?.department) queryParams.set('department', params.department);
    if (params?.position) queryParams.set('position', params.position);
    if (params?.active !== undefined) queryParams.set('active', params.active.toString());

    const queryString = queryParams.toString();
    const endpoint = `/employees${queryString ? `?${queryString}` : ''}`;

    return await apiRequest<PaginatedResponse<Employee>>(endpoint);
  }

  /**
   * Busca funcionário por ID
   */
  async getEmployeeById(id: string): Promise<Employee> {
    return await apiRequest<Employee>(`/employees/${id}`);
  }

  /**
   * Busca funcionário por CPF
   */
  async getEmployeeByDocument(document: string): Promise<Employee> {
    return await apiRequest<Employee>(`/employees/document/${document}`);
  }

  /**
   * Cria um novo funcionário
   */
  async createEmployee(employeeData: CreateEmployeeRequest): Promise<Employee> {
    return await apiRequest<Employee>('/employees', {
      method: 'POST',
      body: JSON.stringify(employeeData),
    });
  }

  /**
   * Atualiza um funcionário existente
   */
  async updateEmployee(id: string, employeeData: Partial<CreateEmployeeRequest>): Promise<Employee> {
    return await apiRequest<Employee>(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employeeData),
    });
  }

  /**
   * Exclui um funcionário
   */
  async deleteEmployee(id: string): Promise<void> {
    await apiRequest<void>(`/employees/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Ativa/desativa um funcionário
   */
  async toggleEmployeeStatus(id: string, active: boolean): Promise<Employee> {
    return await apiRequest<Employee>(`/employees/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ active }),
    });
  }

  /**
   * Busca funcionários ativos por departamento
   */
  async getEmployeesByDepartment(department: string): Promise<Employee[]> {
    return await apiRequest<Employee[]>(`/employees/department/${department}`);
  }

  /**
   * Busca todos os departamentos
   */
  async getDepartments(): Promise<string[]> {
    return await apiRequest<string[]>('/employees/departments');
  }

  /**
   * Busca todos os cargos
   */
  async getPositions(): Promise<string[]> {
    return await apiRequest<string[]>('/employees/positions');
  }

  /**
   * Atualiza salário de um funcionário
   */
  async updateEmployeeSalary(id: string, salary: number, effectiveDate: string): Promise<Employee> {
    return await apiRequest<Employee>(`/employees/${id}/salary`, {
      method: 'PATCH',
      body: JSON.stringify({ salary, effectiveDate }),
    });
  }

  /**
   * Busca histórico salarial de um funcionário
   */
  async getEmployeeSalaryHistory(id: string): Promise<Array<{
    id: string;
    salary: number;
    effectiveDate: string;
    createdAt: string;
  }>> {
    return await apiRequest(`/employees/${id}/salary-history`);
  }

  /**
   * Busca aniversariantes do mês
   */
  async getBirthdayEmployees(month?: number): Promise<Employee[]> {
    const currentMonth = month || new Date().getMonth() + 1;
    return await apiRequest<Employee[]>(`/employees/birthdays?month=${currentMonth}`);
  }

  /**
   * Busca funcionários admitidos recentemente
   */
  async getRecentHires(days = 30): Promise<Employee[]> {
    return await apiRequest<Employee[]>(`/employees/recent-hires?days=${days}`);
  }

  /**
   * Valida CPF
   */
  async validateDocument(document: string): Promise<{ valid: boolean; message?: string }> {
    return await apiRequest<{ valid: boolean; message?: string }>('/employees/validate-document', {
      method: 'POST',
      body: JSON.stringify({ document }),
    });
  }

  /**
   * Busca estatísticas dos funcionários
   */
  async getEmployeesStats(): Promise<{
    totalEmployees: number;
    activeEmployees: number;
    inactiveEmployees: number;
    employeesByDepartment: Record<string, number>;
    employeesByPosition: Record<string, number>;
    averageSalary: number;
    averageServiceTime: number;
  }> {
    return await apiRequest('/employees/stats');
  }

  /**
   * Exporta lista de funcionários
   */
  async exportEmployees(filters?: {
    department?: string;
    position?: string;
    active?: boolean;
  }): Promise<Blob> {
    const queryParams = new URLSearchParams();
    
    if (filters?.department) queryParams.set('department', filters.department);
    if (filters?.position) queryParams.set('position', filters.position);
    if (filters?.active !== undefined) queryParams.set('active', filters.active.toString());

    const queryString = queryParams.toString();
    const endpoint = `/employees/export${queryString ? `?${queryString}` : ''}`;

    return await apiRequest<Blob>(endpoint, {
      headers: {
        ...await this.getHeaders(),
        'Accept': 'text/csv',
      },
    });
  }

  /**
   * Atualiza foto do funcionário
   */
  async updateEmployeePhoto(id: string, photo: File): Promise<Employee> {
    const formData = new FormData();
    formData.append('photo', photo);

    return await apiRequest<Employee>(`/employees/${id}/photo`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });
  }

  private async getHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }
}

export const employeeService = EmployeeService.getInstance();