# SIGMA - Estrutura de APIs Frontend

Este documento descreve a estrutura de APIs criada para integração com o backend Java Spring Boot.

## 📁 Estrutura de Arquivos

```
src/
├── services/
│   ├── api.ts                  # Configuração base da API
│   ├── types.ts               # Tipos TypeScript
│   ├── authService.ts         # Serviço de autenticação
│   ├── productService.ts      # Serviço de produtos
│   ├── categoryService.ts     # Serviço de categorias
│   ├── supplierService.ts     # Serviço de fornecedores
│   ├── customerService.ts     # Serviço de clientes
│   ├── salesService.ts        # Serviço de vendas (POS)
│   ├── stockService.ts        # Serviço de estoque
│   ├── promotionService.ts    # Serviço de promoções
│   ├── employeeService.ts     # Serviço de funcionários
│   ├── reportsService.ts      # Serviço de relatórios
│   └── index.ts              # Exportações centralizadas
├── hooks/
│   ├── useAuth.ts            # Hooks para autenticação
│   ├── useProducts.ts        # Hooks para produtos
│   └── ...                   # Outros hooks
└── env.d.ts                  # Definições de variáveis de ambiente
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```env
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=SIGMA
VITE_APP_VERSION=1.0.0
VITE_ENV=development
```

### Dependências Necessárias

As seguintes dependências estão sendo utilizadas:
- `@tanstack/react-query`: Para gerenciamento de estado do servidor
- `fetch API`: Para requisições HTTP (nativa do browser)

## 📡 Serviços Disponíveis

### 1. AuthService (`authService`)
- **Login/Logout**: Autenticação de usuários
- **Registro**: Criação de novos usuários
- **Perfil**: Gerenciamento de perfil do usuário
- **Permissões**: Verificação de permissões e roles

### 2. ProductService (`productService`)
- **CRUD**: Criar, ler, atualizar, deletar produtos
- **Busca**: Por ID, código de barras, nome
- **Estoque**: Controle de estoque, produtos em baixa
- **Importação/Exportação**: CSV de produtos

### 3. CategoryService (`categoryService`)
- **CRUD**: Gerenciamento de categorias
- **Hierarquia**: Suporte a categorias e subcategorias
- **Árvore**: Visualização em árvore das categorias

### 4. SupplierService (`supplierService`)
- **CRUD**: Gerenciamento de fornecedores
- **Validação**: Validação de CNPJ
- **Integração**: Busca dados por CNPJ na Receita Federal

### 5. CustomerService (`customerService`)
- **CRUD**: Gerenciamento de clientes
- **Histórico**: Histórico de compras
- **Estatísticas**: Estatísticas do cliente
- **Validação**: CPF/CNPJ

### 6. SalesService (`salesService`)
- **POS**: Sistema de ponto de venda
- **Pagamentos**: Múltiplos métodos de pagamento
- **Cancelamentos**: Controle de cancelamentos
- **Recibos**: Geração de cupons e recibos

### 7. StockService (`stockService`)
- **Movimentações**: Entrada, saída, ajustes
- **Inventário**: Controle de inventário
- **Relatórios**: Relatórios de movimentação
- **Perdas**: Controle de perdas

### 8. PromotionService (`promotionService`)
- **CRUD**: Gerenciamento de promoções
- **Tipos**: Percentual, valor fixo, leve X pague Y
- **Aplicação**: Cálculo automático de descontos
- **Estatísticas**: Performance das promoções

### 9. EmployeeService (`employeeService`)
- **CRUD**: Gerenciamento de funcionários
- **Departamentos**: Organização por departamentos
- **Salários**: Histórico salarial
- **Aniversários**: Controle de aniversariantes

### 10. ReportsService (`reportsService`)
- **Dashboard**: KPIs e métricas principais
- **Vendas**: Relatórios de vendas por período
- **Financeiro**: Relatórios financeiros
- **Estoque**: Relatórios de inventário
- **Agendamento**: Relatórios recorrentes

## 🎯 Como Usar

### Exemplo com Serviços Diretos

```typescript
import { productService } from '@/services';

// Buscar produtos
const products = await productService.getProducts({
  page: 0,
  size: 20,
  search: 'notebook'
});

// Criar produto
const newProduct = await productService.createProduct({
  name: 'Notebook Dell',
  barcode: '1234567890',
  price: 2500.00,
  // ... outros campos
});
```

### Exemplo com React Query Hooks

```typescript
import { useProducts, useCreateProduct } from '@/hooks/useProducts';

function ProductsList() {
  const { data: products, isLoading } = useProducts({ page: 0, size: 20 });
  const createProductMutation = useCreateProduct();

  const handleCreateProduct = (productData) => {
    createProductMutation.mutate(productData, {
      onSuccess: () => {
        console.log('Produto criado com sucesso!');
      }
    });
  };

  // ... resto do componente
}
```

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação:

```typescript
import { authService } from '@/services';

// Login
const response = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});

// O token é armazenado automaticamente no localStorage
// Todas as requisições subsequentes incluirão o token automaticamente
```

## 🚨 Tratamento de Erros

Todos os serviços incluem tratamento de erros:

```typescript
try {
  const product = await productService.getProductById('123');
} catch (error) {
  console.error('Erro ao buscar produto:', error.message);
}
```

## 📋 Tipos TypeScript

Todos os tipos estão definidos em `types.ts`:

```typescript
import type { Product, CreateProductRequest } from '@/services/types';
```

## 🔄 Próximos Passos

1. **Configurar variáveis de ambiente** no arquivo `.env`
2. **Instalar dependências** necessárias
3. **Configurar React Query** no componente raiz
4. **Implementar nos componentes** existentes
5. **Testar conexão** com o backend

## 📞 Endpoints Esperados no Backend

A estrutura pressupõe os seguintes endpoints no Spring Boot:

### Autenticação
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/register`
- `POST /api/auth/refresh`

### Produtos
- `GET /api/products`
- `POST /api/products`
- `GET /api/products/{id}`
- `PUT /api/products/{id}`
- `DELETE /api/products/{id}`

### E assim por diante para cada módulo...

## 💡 Dicas

1. **Cache Inteligente**: O React Query gerencia cache automaticamente
2. **Refetch Automático**: Dados são atualizados quando a janela ganha foco
3. **Otimistic Updates**: Atualizações otimistas para melhor UX
4. **Error Boundaries**: Implemente para capturar erros globalmente
5. **Loading States**: Todos os hooks fornecem estados de loading