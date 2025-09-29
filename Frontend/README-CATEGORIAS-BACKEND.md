# 🏷️ Integração de Categorias com Backend Java

Este documento descreve a implementação da integração das categorias com o backend Java Spring Boot do projeto SIGMA.

## 📋 Resumo das Implementações

### ✅ O que foi implementado:

1. **Serviço Backend para Categorias** (`categoryBackendService.ts`)
   - Adaptado para a API Java Spring Boot
   - Endpoints compatíveis com `/api/categorias`
   - Transformação de dados entre frontend e backend

2. **Hooks React Query** (`useCategoriesBackend.ts`)
   - Gerenciamento de estado com cache
   - Mutações para CRUD completo
   - Invalidação automática de cache

3. **Página de Gerenciamento** (`CategoriesManagementBackend.tsx`)
   - Interface moderna com Grid/List view
   - Paginação integrada
   - Estados de loading e erro
   - Toast notifications

4. **Tipos TypeScript** (`javaApiTypes.ts`)
   - Definições compatíveis com a API Java
   - Adaptadores para conversão de dados
   - Type safety completo

## 🔧 Estrutura dos Endpoints

### Backend Java Esperado:
```
GET    /api/categorias           - Listar com paginação
GET    /api/categorias/{id}      - Buscar por ID  
POST   /api/categorias           - Criar categoria
PUT    /api/categorias/{id}      - Atualizar categoria
DELETE /api/categorias/{id}      - Excluir categoria
PATCH  /api/categorias/{id}/status - Ativar/Desativar
GET    /api/categorias/all       - Todas sem paginação
```

### Formato de Dados:

**Request (Criar/Atualizar):**
```json
{
  "nome": "string",
  "descricao": "string",
  "ativo": boolean
}
```

**Response:**
```json
{
  "id_categoria": number,
  "nome": "string", 
  "descricao": "string",
  "ativo": boolean,
  "data_criacao": "string",
  "data_atualizacao": "string"
}
```

**Paginação:**
```json
{
  "content": [...],
  "totalElements": number,
  "totalPages": number,
  "size": number,
  "number": number,
  "first": boolean,
  "last": boolean,
  "empty": boolean
}
```

## 🚀 Como Usar

### 1. Importar o Hook
```typescript
import { useCategoriesBackend } from '@/hooks/useCategoriesBackend';
```

### 2. Usar na Página
```typescript
const { data, isLoading, error } = useCategoriesBackend({
  page: 0,
  size: 10,
  search: "termo",
  ativo: true
});
```

### 3. Criar Categoria
```typescript
const createMutation = useCreateCategoryBackend();

const handleCreate = async () => {
  await createMutation.mutateAsync({
    name: "Nova Categoria",
    description: "Descrição",
    active: true
  });
};
```

## ⚙️ Configuração

### Ativar Backend Java
No arquivo `categoryService.ts`, a flag `USE_JAVA_BACKEND` controla qual API usar:
```typescript
const USE_JAVA_BACKEND = true; // Pode ser configurado via env
```

### Variável de Ambiente
Adicione ao `.env`:
```
VITE_API_URL=http://localhost:8080
```

## 🔄 Rotas Atualizadas

- `/categories` - Nova implementação com backend Java
- `/categories-mock` - Implementação original com dados mock

## 🎯 Benefícios da Nova Implementação

1. **Integração Real**: Conecta diretamente com o backend Java
2. **Performance**: Cache inteligente com React Query
3. **UX Melhorada**: Loading states e error handling
4. **Type Safety**: TypeScript completo
5. **Escalabilidade**: Paginação e busca otimizadas

## 🛠️ Backend Java Necessário

### Controller Exemplo:
```java
@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {
    
    @GetMapping
    public Page<CategoriaDTO> listarCategorias(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false) String search,
        @RequestParam(required = false) Boolean ativo
    ) {
        // Implementação
    }
    
    @PostMapping
    public CategoriaDTO criarCategoria(@RequestBody CategoriaDTO categoria) {
        // Implementação  
    }
    
    // Outros endpoints...
}
```

### Modelo Exemplo:
```java
@Entity
public class Categoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_categoria;
    
    private String nome;
    private String descricao;
    private Boolean ativo;
    
    @CreationTimestamp
    private LocalDateTime data_criacao;
    
    @UpdateTimestamp
    private LocalDateTime data_atualizacao;
    
    // Getters e Setters
}
```

## 🔍 Próximos Passos

1. **Verificar Endpoints**: Confirmar se o backend tem todos os endpoints
2. **Teste de Integração**: Verificar comunicação frontend-backend
3. **Validações**: Implementar validações de dados
4. **Hierarquia**: Adicionar suporte a categorias pai/filho se necessário
5. **Produtos**: Integrar com gestão de produtos

## 🐛 Troubleshooting

### Problemas Comuns:

1. **CORS**: Configurar no backend Spring Boot
2. **Autenticação**: Verificar headers JWT
3. **Tipos de Dados**: Conferir formato dos campos
4. **Paginação**: Validar estrutura de resposta

### Logs Úteis:
```javascript
// Verificar requisições no Network tab
// Logs do React Query no console
// Verificar estado dos hooks
```

## 📝 Notas de Desenvolvimento

- A implementação mantém compatibilidade com a API genérica
- Os adaptadores transformam dados automaticamente
- Cache é invalidado automaticamente nas mutações
- Estados de loading são gerenciados pelos hooks
- Error handling está integrado com toast notifications

Esta implementação fornece uma base sólida para a gestão de categorias integrada com o backend Java Spring Boot.