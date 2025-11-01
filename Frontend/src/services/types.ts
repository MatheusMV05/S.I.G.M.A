// ============== TYPES DE API ==============
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

// ============== TYPES DE AUTENTICAÇÃO ==============
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  permissions?: string[];
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

export type UserRole = 'ADMIN' | 'MANAGER' | 'SUPERVISOR' | 'CASHIER' | 'STOCK';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  expiresIn: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  department?: string;
}

// ============== TYPES DE PRODUTOS ==============
export interface Product {
  id: string;
  name: string;
  description?: string;
  barcode: string;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  maxStock: number;
  categoryId: string;
  category?: Category;
  supplierId: string;
  supplier?: Supplier;
  brand?: string;
  unit: string; // unidade de medida
  weight?: number;
  dimensions?: ProductDimensions;
  images?: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  barcode: string;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  maxStock: number;
  categoryId: string;
  supplierId: string;
  brand?: string;
  unit: string;
  weight?: number;
  dimensions?: ProductDimensions;
}

// ============== TYPES DE CATEGORIAS ==============
export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  parent?: Category;
  children?: Category[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  parentId?: string;
}

// ============== TYPES DE FORNECEDORES ==============
export interface Supplier {
  id: string;
  name: string;
  tradeName?: string;
  document: string; // CNPJ
  email: string;
  phone: string;
  address: Address;
  contactPerson?: string;
  paymentTerms?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface CreateSupplierRequest {
  name: string;
  tradeName?: string;
  document: string;
  email: string;
  phone: string;
  address: Address;
  contactPerson?: string;
  paymentTerms?: string;
}

// ============== TYPES DE CLIENTES ==============
export type CustomerType = 'individual' | 'business';

export type CustomerClassification = 'DIAMANTE' | 'PLATINA' | 'OURO' | 'PRATA' | 'BRONZE';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: CustomerType;
  document: string; // CPF ou CNPJ
  address: Address; // Tornamos obrigatório, pois a UI espera
  registrationDate: string;
  lastPurchase?: string;
  totalPurchases: number;
  totalSpent: number;
  status: 'active' | 'inactive';
  classificacao?: CustomerClassification; // Classificação VIP: DIAMANTE ≥R$10k, PLATINA ≥R$5k, OURO ≥R$2k, PRATA ≥R$500, BRONZE <R$500
  notes?: string;
  birthDate?: string;
  companyInfo?: {
    tradeName?: string;
    stateRegistration?: string;
    municipalRegistration?: string;
  };
  // Campos que a API de lista não retorna, mas getById pode retornar
  createdAt?: string; 
  updatedAt?: string;
}

export interface CreateCustomerRequest {
  name: string;
  email: string;
  phone: string;
  type: CustomerType;
  document: string;
  address: Address;
  status: 'active' | 'inactive';
  notes?: string;
  birthDate?: string;
  companyInfo?: {
    tradeName?: string;
    stateRegistration?: string;
    municipalRegistration?: string;
  };
}

// ============== TYPES DE VENDAS ==============
export interface Sale {
  id: string;
  saleNumber: string;
  customerId?: string;
  customer?: Customer;
  cashierId: string;
  cashier: User;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: SaleStatus;
  saleDate: string;
  notes?: string;
}

export interface SaleItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export type PaymentMethod = 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'CHECK';
export type SaleStatus = 'COMPLETED' | 'CANCELLED' | 'PENDING';

export interface CreateSaleRequest {
  customerId?: string;
  items: CreateSaleItemRequest[];
  discount: number;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface CreateSaleItemRequest {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
}

// ============== TYPES DE ESTOQUE ==============
export interface StockMovement {
  id: string;
  productId: string;
  product: Product;
  type: StockMovementType;
  quantity: number;
  reason: string;
  userId: string;
  user: User;
  createdAt: string;
}

export type StockMovementType = 'IN' | 'OUT' | 'ADJUSTMENT' | 'LOSS' | 'RETURN';

export interface CreateStockMovementRequest {
  productId: string;
  type: StockMovementType;
  quantity: number;
  reason: string;
}

// ============== TYPES DE PROMOÇÕES ==============
export interface Promotion {
  id: string;
  name: string;
  description?: string;
  type: PromotionType;
  value: number; // percentual ou valor fixo
  startDate: string;
  endDate: string;
  products?: Product[];
  categories?: Category[];
  minQuantity?: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PromotionType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'BUY_X_GET_Y';

export interface CreatePromotionRequest {
  name: string;
  description?: string;
  type: PromotionType;
  value: number;
  startDate: string;
  endDate: string;
  productIds?: string[];
  categoryIds?: string[];
  minQuantity?: number;
}

// ============== TYPES DE RELATÓRIOS ==============
export interface DashboardKPIs {
  todayRevenue: number;
  yesterdayRevenue: number;
  monthRevenue: number;
  averageTicket: number;
  totalProducts: number;
  lowStockProducts: number;
  totalCustomers: number;
  todaySales: number;
}

export interface SalesReport {
  period: string;
  totalSales: number;
  totalRevenue: number;
  averageTicket: number;
  topProducts: TopProduct[];
  salesByPaymentMethod: SalesByPaymentMethod[];
  salesByHour: SalesByHour[];
}

export interface TopProduct {
  productId: string;
  productName: string;
  quantity: number;
  revenue: number;
}

export interface SalesByPaymentMethod {
  paymentMethod: PaymentMethod;
  count: number;
  total: number;
}

export interface SalesByHour {
  hour: number;
  sales: number;
  revenue: number;
}

export interface InventoryReport {
  totalProducts: number;
  totalValue: number;
  lowStockProducts: Product[];
  topValueProducts: Product[];
  stockMovementsSummary: StockMovementsSummary[];
}

export interface StockMovementsSummary {
  type: StockMovementType;
  count: number;
  quantity: number;
}

// ============== TYPES DE FUNCIONÁRIOS ==============
export interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  document: string; // CPF
  position: string;
  department: string;
  salary?: number;
  hireDate: string;
  birthDate?: string;
  address?: Address;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  phone?: string;
  document: string;
  position: string;
  department: string;
  salary?: number;
  hireDate: string;
  birthDate?: string;
  address?: Address;
}