# Endpoints de Produtos - Documentação

Baseado na estrutura do backend Java Spring Boot, aqui estão os endpoints para produtos:

## Base URL
`http://localhost:8080/api`

## Endpoints de Produtos

### 1. Listar Produtos
```
GET /produto
GET /produto?page=0&size=10&search=termo&categoryId=1&active=true
```

### 2. Buscar Produto por ID
```
GET /produto/{id}
```

### 3. Criar Produto
```
POST /produto
Content-Type: application/json

{
  "nome": "string",
  "marca": "string", 
  "descricao": "string",
  "precoCusto": 0.00,
  "precoVenda": 0.00,
  "estoque": 0,
  "estoqueMinimo": 0,
  "categoriaId": 1,
  "codigoBarras": "string",
  "unidade": "UN",
  "peso": 0.000
}
```

### 4. Atualizar Produto
```
PUT /produto/{id}
Content-Type: application/json

{
  "nome": "string",
  "marca": "string", 
  "descricao": "string",
  "precoCusto": 0.00,
  "precoVenda": 0.00,
  "estoque": 0,
  "estoqueMinimo": 0,
  "categoriaId": 1,
  "codigoBarras": "string",
  "unidade": "UN",
  "peso": 0.000
}
```

### 5. Excluir Produto  
```
DELETE /produto/{id}
```

### 6. Atualizar Status do Produto
```
PATCH /produto/{id}/status
Content-Type: application/json

{
  "ativo": true
}
```

### 7. Atualizar Estoque
```
PATCH /produto/{id}/estoque  
Content-Type: application/json

{
  "estoque": 100
}
```

### 8. Atualizar Preço
```
PATCH /produto/{id}/preco
Content-Type: application/json

{
  "precoVenda": 29.90,
  "precoCusto": 15.00
}
```

## Resposta Típica (GET /produto/{id})
```json
{
  "idProduto": 1,
  "nome": "Produto Exemplo", 
  "marca": "Marca XYZ",
  "descricao": "Descrição do produto",
  "precoCusto": 15.00,
  "precoVenda": 29.90,
  "estoque": 100,
  "estoqueMinimo": 10,
  "status": "ATIVO",
  "categoria": {
    "id": 1,
    "nome": "Eletrônicos"
  },
  "codigoBarras": "1234567890123",
  "unidade": "UN", 
  "peso": 0.500,
  "dataCriacao": "2024-01-01T10:00:00",
  "dataAtualizacao": "2024-01-01T10:00:00"
}
```

## Resposta de Lista Paginada (GET /produto)
```json
{
  "content": [
    {
      "idProduto": 1,
      "nome": "Produto 1",
      // ... outros campos
    }
  ],
  "totalPages": 5,
  "totalElements": 50,
  "size": 10,
  "number": 0,
  "first": true,
  "last": false,
  "numberOfElements": 10
}
```