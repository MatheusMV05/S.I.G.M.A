# Documentação dos Endpoints - Produtos

## Endpoints do Backend Java (Spring Boot)

### Base URL
```
http://localhost:8080/api
```

### Autenticação
Todas as requisições devem incluir o header:
```
Authorization: Bearer {token}
```

### Endpoints de Produtos

#### 1. Listar Produtos (GET)
```
GET /produto?page=0&size=10&search=termo&categoriaId=1&status=ATIVO
```

**Parâmetros de Query:**
- `page` (opcional): Número da página (começando em 0)
- `size` (opcional): Tamanho da página (padrão: 10)
- `search` (opcional): Termo de busca no nome do produto
- `categoriaId` (opcional): ID da categoria para filtrar
- `status` (opcional): ATIVO ou INATIVO

**Resposta:**
```json
{
  "content": [
    {
      "id_produto": 1,
      "nome": "Produto Exemplo",
      "marca": "Marca Exemplo",
      "descricao": "Descrição do produto",
      "preco_custo": 10.50,
      "preco_venda": 15.00,
      "estoque": 100,
      "estoque_minimo": 10,
      "status": "ATIVO",
      "categoria": {
        "id_categoria": 1,
        "nome": "Eletrônicos"
      },
      "codigo_barras": "1234567890123",
      "unidade": "UN",
      "peso": 0.5,
      "data_criacao": "2023-01-01T00:00:00",
      "data_atualizacao": "2023-01-01T00:00:00"
    }
  ],
  "totalElements": 100,
  "totalPages": 10,
  "size": 10,
  "number": 0,
  "first": true,
  "last": false,
  "empty": false
}
```

#### 2. Buscar Produto por ID (GET)
```
GET /produto/{id}
```

**Resposta:** Objeto do produto (mesmo formato do array acima)

#### 3. Criar Produto (POST)
```
POST /produto
Content-Type: application/json

{
  "nome": "Novo Produto",
  "marca": "Marca",
  "descricao": "Descrição opcional",
  "preco_custo": 10.50,
  "preco_venda": 15.00,
  "estoque": 100,
  "estoque_minimo": 10,
  "categoria_id": 1,
  "codigo_barras": "1234567890123",
  "unidade": "UN",
  "peso": 0.5
}
```

#### 4. Atualizar Produto (PUT)
```
PUT /produto/{id}
Content-Type: application/json

{
  "nome": "Produto Atualizado",
  "marca": "Nova Marca",
  "descricao": "Nova descrição",
  "preco_custo": 12.00,
  "preco_venda": 18.00,
  "estoque": 150,
  "estoque_minimo": 15,
  "categoria_id": 2,
  "codigo_barras": "9876543210987",
  "unidade": "KG",
  "peso": 1.2,
  "status": "ATIVO"
}
```

#### 5. Excluir Produto (DELETE)
```
DELETE /produto/{id}
```

#### 6. Alterar Status do Produto (PATCH)
```
PATCH /produto/{id}/status
Content-Type: application/json

{
  "status": "INATIVO"
}
```

#### 7. Atualizar Estoque (PATCH)
```
PATCH /produto/{id}/estoque
Content-Type: application/json

{
  "estoque": 200
}
```

#### 8. Produtos com Estoque Baixo (GET)
```
GET /produto/estoque-baixo
```

## Funcionalidades Implementadas no Frontend

### ✅ Funcionalidades Prontas:
1. **Listagem de Produtos** - Com paginação, filtros e busca
2. **Visualização Detalhada** - Modal com todas as informações
3. **Adicionar Produto** - Modal com formulário em 2 etapas
4. **Editar Produto** - Modal pré-preenchido com dados atuais
5. **Excluir Produto** - Modal de confirmação com detalhes
6. **Filtros** - Por categoria e status
7. **Busca** - Por nome do produto
8. **Visualização** - Tabela e cards
9. **Export CSV** - Exportação dos dados
10. **Indicadores** - Estatísticas e alertas

### 📋 Campos do Formulário:
- Nome do produto (obrigatório)
- Marca (obrigatório)
- Descrição (opcional)
- Categoria (obrigatório)
- Preço de custo (obrigatório)
- Preço de venda (obrigatório)
- Estoque inicial (obrigatório)
- Estoque mínimo (obrigatório)
- Unidade de medida (opcional)
- Código de barras (opcional)
- Peso (opcional)

### 🔔 Alertas e Validações:
- Margem de lucro automática
- Alerta de estoque baixo
- Validação de campos obrigatórios
- Confirmação de exclusão detalhada
- Feedback visual de operações

### 🎨 Interface:
- Design responsivo
- Modo claro/escuro compatível
- Animações suaves
- Indicadores de carregamento
- Mensagens de sucesso/erro via toast

## Como Usar:

1. **Adicionar Produto**: Clique em "Novo Produto" → Preencha o formulário em 2 etapas → Clique em "Criar Produto"

2. **Editar Produto**: Clique no ícone de editar (lápis) → Modifique os campos → Clique em "Salvar Alterações"

3. **Excluir Produto**: Clique no ícone de lixeira → Confirme a exclusão no modal

4. **Filtrar**: Use os filtros de categoria e status, ou a busca por nome

5. **Visualizar**: Clique no ícone de olho para ver detalhes completos