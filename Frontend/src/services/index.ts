// Configuração base da API
export { API_BASE_URL, getAuthHeaders, apiRequest, refreshToken } from './api';

// Tipos
export * from './types';

// Importar serviços
import { authService } from './authService';
import { productJavaService } from './productJavaService'; // Mudança: usar productJavaService
import { categoryService } from './categoryService';
import { categoryBackendService } from './categoryBackendService';
import { supplierService } from './supplierService';
import { customerService } from './customerService';
import { salesService } from './salesService';
import { stockService } from './stockService';
import { promotionService } from './promotionService';
import { employeeService } from './employeeService';
import { reportsService } from './reportsService';

// Exportar serviços individualmente
export { authService } from './authService';
export { productJavaService as productService } from './productJavaService'; // Usar productJavaService
export { categoryService } from './categoryService';
export { categoryBackendService } from './categoryBackendService';
export { supplierService } from './supplierService';
export { customerService } from './customerService';
export { salesService } from './salesService';
export { stockService } from './stockService';
export { promotionService } from './promotionService';
export { employeeService } from './employeeService';
export { reportsService } from './reportsService';

// Exportar tipos e enums do employeeService
export { 
  StatusFuncionario, 
  TurnoTrabalho, 
  TipoContrato,
  type Funcionario,
  type CreateFuncionarioRequest,
  type EstatisticasSetor
} from './employeeService';

// Objeto com todos os serviços para facilitar importação
export const services = {
  auth: authService,
  products: productJavaService, // Usar productJavaService
  categories: categoryService,
  categoriesBackend: categoryBackendService,
  suppliers: supplierService,
  customers: customerService,
  sales: salesService,
  stock: stockService,
  promotions: promotionService,
  employees: employeeService,
  reports: reportsService,
};