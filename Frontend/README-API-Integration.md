# 🚀 Guia de Integração das APIs - SIGMA

Este documento explica como integrar o frontend React com o backend Java Spring Boot usando a estrutura de APIs criada.

## 📁 Estrutura de Arquivos

```
src/
├── services/           # Serviços de API
│   ├── api.ts         # Configuração base
│   ├── types.ts       # Tipos TypeScript
│   ├── authService.ts # Autenticação
│   ├── productService.ts
│   ├── categoryService.ts
│   └── ...
├── hooks/             # React Query Hooks
│   ├── useAuth.ts
│   ├── useProducts.ts
│   ├── useCategories.ts
│   └── ...
└── examples/          # Exemplos de integração
```

## 🛠️ Configuração Inicial

### 1. Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```env
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=SIGMA
VITE_APP_VERSION=1.0.0
VITE_ENV=development
```

### 2. Configuração do Backend

Certifique-se de que seu backend Spring Boot está rodando na porta 8080 com as seguintes rotas:

```
http://localhost:8080/api/auth/login
http://localhost:8080/api/auth/logout
http://localhost:8080/api/products
http://localhost:8080/api/categories
http://localhost:8080/api/customers
...
```

## 📝 Como Usar as APIs

### 1. Autenticação

```tsx
import { useAuth, useLogin, useLogout } from '@/hooks/useAuth';

function LoginComponent() {
  const login = useLogin();
  const logout = useLogout();
  
  const handleLogin = async (email: string, password: string) => {
    try {
      await login.mutateAsync({ email, password });
      // Login realizado com sucesso
    } catch (error) {
      // Tratar erro
    }
  };
}
```

### 2. Listagem de Produtos

```tsx
import { useProducts } from '@/hooks/useProducts';

function ProductsList() {
  const { data: productsData, isLoading, error } = useProducts({
    page: 0,
    size: 20,
    search: 'arroz',
    active: true
  });

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  const products = productsData?.content || [];

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>Preço: R$ {product.price}</p>
          <p>Estoque: {product.stock}</p>
        </div>
      ))}
    </div>
  );
}
```

### 3. Criar/Editar Produto

```tsx
import { useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';

function ProductForm({ productId = null }) {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const handleSubmit = async (productData) => {
    try {
      if (productId) {
        await updateProduct.mutateAsync({ id: productId, data: productData });
      } else {
        await createProduct.mutateAsync(productData);
      }
      // Sucesso - lista será atualizada automaticamente
    } catch (error) {
      // Tratar erro
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos do formulário */}
    </form>
  );
}
```

### 4. Dashboard com KPIs

```tsx
import { useDashboardKPIs } from '@/hooks/useReports';

function Dashboard() {
  const { data: kpis, isLoading } = useDashboardKPIs();

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div>
      <div>Receita Hoje: R$ {kpis?.todayRevenue}</div>
      <div>Vendas Hoje: {kpis?.todaySales}</div>
      <div>Ticket Médio: R$ {kpis?.averageTicket}</div>
    </div>
  );
}
```

## 🔄 Migrando Páginas Existentes

### Passo 1: Substitua os dados mockados

**ANTES:**
```tsx
const [products, setProducts] = useState(mockProducts);
```

**DEPOIS:**
```tsx
const { data: productsData, isLoading, error } = useProducts();
const products = productsData?.content || [];
```

### Passo 2: Adicione estados de carregamento

```tsx
if (isLoading) {
  return <Skeleton className="h-8 w-full" />;
}

if (error) {
  return (
    <Alert variant="destructive">
      <AlertDescription>
        Erro ao carregar dados: {error.message}
      </AlertDescription>
    </Alert>
  );
}
```

### Passo 3: Use mutations para operações CRUD

```tsx
const createMutation = useCreateProduct();
const updateMutation = useUpdateProduct();
const deleteMutation = useDeleteProduct();

// Substituir funções locais por mutations
const handleCreate = (data) => createMutation.mutate(data);
const handleUpdate = (id, data) => updateMutation.mutate({ id, data });
const handleDelete = (id) => deleteMutation.mutate(id);
```

### Passo 4: Implemente paginação real

```tsx
const [page, setPage] = useState(0);
const { data } = useProducts({ page, size: 20 });

// Controles de paginação
<Button onClick={() => setPage(page - 1)} disabled={page === 0}>
  Anterior
</Button>
<Button onClick={() => setPage(page + 1)} disabled={page >= data?.totalPages - 1}>
  Próximo
</Button>
```

## 🎯 Endpoints da API

### Autenticação
- `POST /auth/login` - Login do usuário
- `POST /auth/logout` - Logout do usuário
- `POST /auth/refresh` - Renovar token
- `POST /auth/forgot-password` - Solicitar reset de senha

### Produtos
- `GET /products` - Listar produtos (com paginação e filtros)
- `GET /products/{id}` - Buscar produto por ID
- `POST /products` - Criar produto
- `PUT /products/{id}` - Atualizar produto
- `DELETE /products/{id}` - Excluir produto
- `GET /products/low-stock` - Produtos com estoque baixo

### Categorias
- `GET /categories` - Listar categorias
- `GET /categories/tree` - Árvore de categorias
- `POST /categories` - Criar categoria
- `PUT /categories/{id}` - Atualizar categoria

### Vendas
- `GET /sales` - Listar vendas
- `POST /sales` - Criar venda
- `PATCH /sales/{id}/cancel` - Cancelar venda
- `GET /sales/today` - Vendas de hoje

### Estoque
- `GET /stock/movements` - Movimentações de estoque
- `POST /stock/movements` - Criar movimentação
- `GET /stock/low-stock` - Produtos com estoque baixo

### Relatórios
- `GET /reports/dashboard` - KPIs do dashboard
- `GET /reports/sales` - Relatório de vendas
- `GET /reports/inventory` - Relatório de inventário

## 🔧 Tratamento de Erros

```tsx
// Interceptor global de erros
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutos
      onError: (error) => {
        console.error('Erro na consulta:', error);
        // Mostrar toast de erro
      },
    },
    mutations: {
      onError: (error) => {
        console.error('Erro na mutação:', error);
        // Mostrar toast de erro
      },
    },
  },
});
```

## 🚨 Estados de Loading e Error

### Loading States
```tsx
// Skeleton para lista
{isLoading && (
  <div className="space-y-2">
    {Array.from({ length: 5 }).map((_, i) => (
      <Skeleton key={i} className="h-12 w-full" />
    ))}
  </div>
)}

// Spinner para botão
<Button disabled={mutation.isPending}>
  {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
  Salvar
</Button>
```

### Error States
```tsx
// Alert de erro
{error && (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>
      {error.message}
      <Button variant="outline" size="sm" onClick={refetch}>
        Tentar novamente
      </Button>
    </AlertDescription>
  </Alert>
)}
```

## 📱 Responsividade

Todos os hooks e serviços são compatíveis com componentes móveis e desktop. Use os mesmos hooks em ambas as versões.

## 🎨 Personalização

### Customizar URLs da API
```tsx
// services/api.ts
export const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:8080/api';
```

### Customizar tempos de cache
```tsx
// hooks/useProducts.ts
const { data } = useProducts(params, {
  staleTime: 10 * 60 * 1000, // 10 minutos
  refetchInterval: 30 * 1000,  // 30 segundos
});
```

## 📈 Otimizações

### 1. Prefetch de dados importantes
```tsx
const queryClient = useQueryClient();

// Prefetch próxima página
const prefetchNextPage = () => {
  queryClient.prefetchQuery({
    queryKey: ['products', { page: currentPage + 1 }],
    queryFn: () => productService.getProducts({ page: currentPage + 1 }),
  });
};
```

### 2. Invalidação seletiva
```tsx
// Invalidar apenas listas de produtos após criar/editar
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['products', 'list'] });
}
```

### 3. Otimistic Updates
```tsx
const updateProduct = useMutation({
  mutationFn: productService.updateProduct,
  onMutate: async (newData) => {
    // Cancelar queries em andamento
    await queryClient.cancelQueries(['products', id]);
    
    // Snapshot do valor anterior
    const previousProduct = queryClient.getQueryData(['products', id]);
    
    // Atualizar otimisticamente
    queryClient.setQueryData(['products', id], newData);
    
    return { previousProduct };
  },
  onError: (err, newData, context) => {
    // Reverter em caso de erro
    queryClient.setQueryData(['products', id], context.previousProduct);
  },
});
```

## ✅ Checklist de Migração

- [ ] Configurar variáveis de ambiente
- [ ] Testar conexão com backend
- [ ] Substituir dados mockados por hooks
- [ ] Adicionar estados de loading/error
- [ ] Implementar paginação real
- [ ] Testar operações CRUD
- [ ] Configurar tratamento de erros global
- [ ] Otimizar performance com cache
- [ ] Testar em dispositivos móveis
- [ ] Documentar mudanças para a equipe

## 🔗 Links Úteis

- [React Query Documentation](https://tanstack.com/query/latest)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Axios Documentation](https://axios-http.com/docs/intro)

---

**✨ Pronto!** Sua aplicação agora está integrada com APIs reais do backend Java Spring Boot!

Para dúvidas ou suporte, consulte os exemplos na pasta `src/examples/` ou abra uma issue no repositório.