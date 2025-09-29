// Configuração base da API
export { API_BASE_URL, getAuthHeaders, apiRequest, refreshToken } from './api';

// Tipos
export * from './types';

// Importar serviços
import { authService } from './authService';
import { productService } from './productService';
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
export { productService } from './productService';
export { categoryService } from './categoryService';
export { categoryBackendService } from './categoryBackendService';
export { supplierService } from './supplierService';
export { customerService } from './customerService';
export { salesService } from './salesService';
export { stockService } from './stockService';
export { promotionService } from './promotionService';
export { employeeService } from './employeeService';
export { reportsService } from './reportsService';

// Objeto com todos os serviços para facilitar importação
export const services = {
  auth: authService,
  products: productService,
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