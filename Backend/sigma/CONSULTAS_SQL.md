# DOCUMENTAÇÃO DAS CONSULTAS SQL - PROJETO S.I.G.M.A

**Sistema Integrado de Gestão para Mercados e Atacados**  
**Disciplina**: Banco de Dados

---

## ÍNDICE

1. [Consultas com JOIN](#consultas-com-join)
2. [Consultas de Agregação](#consultas-de-agregação)
3. [Operações CRUD](#operações-crud)
4. [Consultas com Filtros Dinâmicos](#consultas-com-filtros-dinâmicos)
5. [Localização no Código](#localização-no-código)

---

## CONSULTAS COM JOIN

### **CONSULTA 1: Listagem de Produtos com Categoria (JOIN + Paginação + Filtros)**

**Descrição**: Busca produtos com informações de categoria, suportando paginação e múltiplos filtros dinâmicos.

**Nível de Complexidade**: MÉDIA-ALTA

**SQL**:
```sql
SELECT 
    p.id_produto,
    p.nome,
    p.marca,
    p.quant_em_estoque,
    p.valor_unitario,
    p.data_validade,
    p.descricao,
    p.estoque_minimo,
    p.estoque_maximo,
    p.preco_custo,
    p.status,
    p.codigo_barras,
    p.unidade,
    p.peso,
    p.data_criacao,
    p.data_atualizacao,
    c.id_categoria AS categoria_id,
    c.nome AS categoria_nome
FROM Produto p
LEFT JOIN Categoria c ON p.id_categoria = c.id_categoria
WHERE 1=1
    AND (p.nome LIKE ? OR p.marca LIKE ? OR p.codigo_barras LIKE ?)
    AND p.id_categoria = ?
    AND p.status = ?
ORDER BY p.nome
LIMIT ? OFFSET ?
```

**Parâmetros**:
- `?` - Termo de busca (3x para nome, marca e código de barras)
- `?` - ID da categoria (filtro opcional)
- `?` - Status do produto (ativo/inativo)
- `?` - Limite de registros (size)
- `?` - Deslocamento (page * size)

**Localização**: `Backend/sigma/src/main/java/com/project/sigma/repository/ProdutoRepository.java`  
**Método**: `findAllWithPagination(int page, int size, String search, Integer categoryId, String status)`

**Resultado**: Retorna produtos paginados com nome da categoria associada.

---

### **CONSULTA 2: Busca Detalhada de Clientes com Múltiplos JOINs**

**Descrição**: Consulta complexa que une informações de pessoa, cliente, telefone, CPF e CNPJ.

**Nível de Complexidade**: ALTA

**SQL**:
```sql
SELECT 
    p.id_pessoa,
    p.nome,
    p.rua,
    p.numero,
    p.bairro,
    p.cidade,
    c.email,
    c.ativo,
    c.ranke,
    c.total_gasto,
    c.data_ultima_compra,
    t.numero AS telefone,
    cf.cpf,
    cj.cnpj
FROM Pessoa p
JOIN Cliente c ON p.id_pessoa = c.id_pessoa
LEFT JOIN Telefone t ON p.id_pessoa = t.id_pessoa
LEFT JOIN cliente_fisica cf ON c.id_pessoa = cf.id_pessoa
LEFT JOIN cliente_juridico cj ON c.id_pessoa = cj.id_pessoa
WHERE (
    LOWER(p.nome) LIKE ? 
    OR LOWER(c.email) LIKE ? 
    OR LOWER(t.numero) LIKE ? 
    OR cf.cpf LIKE ? 
    OR cj.cnpj LIKE ?
)
AND c.ativo = ?
AND (cf.cpf IS NOT NULL OR cj.cnpj IS NOT NULL)
```

**Parâmetros**:
- `?` - Termo de busca em minúsculas (5x para diferentes campos)
- `?` - Status ativo do cliente (true/false)

**Localização**: `Backend/sigma/src/main/java/com/project/sigma/repository/ClienteRepository.java`  
**Método**: `search(String searchTerm, String tipoCliente, String status)`

**Resultado**: Retorna clientes com todos os dados relacionados (endereço, contato, documentos).

**Observação**: Esta consulta demonstra:
- **INNER JOIN** entre Pessoa e Cliente
- **LEFT JOIN** para dados opcionais (telefone, CPF, CNPJ)
- Lógica para diferenciar Pessoa Física e Jurídica
- Filtros dinâmicos em múltiplas tabelas

---

### **CONSULTA 3: Produto Específico com Categoria (JOIN Simples)**

**Descrição**: Busca um produto específico por ID com informações da categoria.

**Nível de Complexidade**: MÉDIA

**SQL**:
```sql
SELECT 
    p.id_produto,
    p.nome,
    p.marca,
    p.quant_em_estoque,
    p.valor_unitario,
    p.data_validade,
    p.descricao,
    p.estoque_minimo,
    p.estoque_maximo,
    p.preco_custo,
    p.status,
    p.codigo_barras,
    p.unidade,
    p.peso,
    p.data_criacao,
    p.data_atualizacao,
    c.id_categoria AS categoria_id,
    c.nome AS categoria_nome
FROM Produto p
LEFT JOIN Categoria c ON p.id_categoria = c.id_categoria
WHERE p.id_produto = ?
```

**Parâmetros**:
- `?` - ID do produto

**Localização**: `Backend/sigma/src/main/java/com/project/sigma/repository/ProdutoRepository.java`  
**Método**: `findByIdComplete(Integer id)`

**Resultado**: Retorna dados completos de um produto com categoria.

---

## CONSULTAS DE AGREGAÇÃO

### **CONSULTA 4: Dashboard - Total de Produtos**

**Descrição**: Conta o total de produtos cadastrados no sistema.

**Nível de Complexidade**: BAIXA

**SQL**:
```sql
SELECT COUNT(*) 
FROM Produto
```

**Localização**: `Backend/sigma/src/main/java/com/project/sigma/controller/ReportsController.java`  
**Método**: `getDashboard()`

**Resultado**: Retorna quantidade total de produtos.

---

### **CONSULTA 5: Dashboard - Total de Categorias**

**Descrição**: Conta o total de categorias cadastradas.

**Nível de Complexidade**: ⭐ BAIXA

**SQL**:
```sql
SELECT COUNT(*) 
FROM Categoria
```

**Localização**: `Backend/sigma/src/main/java/com/project/sigma/controller/ReportsController.java`  
**Método**: `getDashboard()`

**Resultado**: Retorna quantidade total de categorias.

---

### **CONSULTA 6: Dashboard - Produtos com Estoque Baixo**

**Descrição**: Conta produtos onde o estoque atual está abaixo do estoque mínimo.

**Nível de Complexidade**: ⭐⭐ MÉDIA

**SQL**:
```sql
SELECT COUNT(*) 
FROM Produto 
WHERE quant_em_estoque < estoque_minimo
```

**Localização**: `Backend/sigma/src/main/java/com/project/sigma/controller/ReportsController.java`  
**Método**: `getDashboard()`

**Resultado**: Retorna quantidade de produtos que precisam de reposição.

**Observação**: Útil para alertas de estoque e gestão de compras.

---

### **CONSULTA 7: Dashboard - Valor Total do Estoque**

**Descrição**: Calcula o valor total em estoque multiplicando preço unitário pela quantidade.

**Nível de Complexidade**: ⭐⭐ MÉDIA

**SQL**:
```sql
SELECT SUM(valor_unitario * quant_em_estoque) 
FROM Produto
```

**Localização**: `Backend/sigma/src/main/java/com/project/sigma/controller/ReportsController.java`  
**Método**: `getDashboard()`

**Resultado**: Retorna valor monetário total do inventário.

**Observação**: Demonstra uso de função de agregação (SUM) com cálculo aritmético.

---

### **CONSULTA 8: Contagem Total para Paginação**

**Descrição**: Conta registros totais considerando filtros aplicados (para paginação).

**Nível de Complexidade**: ⭐⭐⭐ MÉDIA-ALTA

**SQL**:
```sql
SELECT COUNT(*) 
FROM (
    SELECT p.id_produto
    FROM Produto p
    LEFT JOIN Categoria c ON p.id_categoria = c.id_categoria
    WHERE 1=1
        AND (p.nome LIKE ? OR p.marca LIKE ? OR p.codigo_barras LIKE ?)
        AND p.id_categoria = ?
        AND p.status = ?
) AS countQuery
```

**Parâmetros**: Mesmos da Consulta 1

**Localização**: `Backend/sigma/src/main/java/com/project/sigma/repository/ProdutoRepository.java`  
**Método**: `findAllWithPagination()` (parte da contagem)

**Resultado**: Total de registros que atendem aos filtros (para calcular total de páginas).

---

## OPERAÇÕES CRUD

### **CONSULTA 9: Inserção de Produto (INSERT)**

**Descrição**: Insere um novo produto no banco de dados.

**Nível de Complexidade**: ⭐⭐ MÉDIA

**SQL**:
```sql
INSERT INTO Produto (
    nome, 
    marca, 
    quant_em_estoque, 
    valor_unitario, 
    data_validade, 
    id_categoria,
    descricao, 
    estoque_minimo, 
    estoque_maximo, 
    preco_custo, 
    status, 
    codigo_barras, 
    unidade, 
    peso,
    data_criacao, 
    data_atualizacao
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
```

**Parâmetros**: 14 valores correspondentes aos campos

**Localização**: `Backend/sigma/src/main/java/com/project/sigma/repository/ProdutoRepository.java`  
**Método**: `save(Produto produto)`

**Resultado**: Novo produto criado com ID gerado automaticamente.

---

### **CONSULTA 10: Atualização de Produto (UPDATE)**

**Descrição**: Atualiza dados de um produto existente.

**Nível de Complexidade**: ⭐⭐ MÉDIA

**SQL**:
```sql
UPDATE Produto 
SET 
    nome = ?, 
    marca = ?, 
    quant_em_estoque = ?,
    valor_unitario = ?, 
    data_validade = ?, 
    id_categoria = ?,
    descricao = ?, 
    estoque_minimo = ?, 
    estoque_maximo = ?,
    preco_custo = ?, 
    status = ?, 
    codigo_barras = ?,
    unidade = ?, 
    peso = ?, 
    data_atualizacao = ?
WHERE id_produto = ?
```

**Parâmetros**: 15 valores + ID do produto

**Localização**: `Backend/sigma/src/main/java/com/project/sigma/repository/ProdutoRepository.java`  
**Método**: `update(Produto produto)`

**Resultado**: Produto atualizado.

---

### **CONSULTA 11: Exclusão de Produto (DELETE)**

**Descrição**: Remove um produto do banco de dados.

**Nível de Complexidade**: ⭐ BAIXA

**SQL**:
```sql
DELETE FROM Produto 
WHERE id_produto = ?
```

**Parâmetros**:
- `?` - ID do produto a ser excluído

**Localização**: `Backend/sigma/src/main/java/com/project/sigma/repository/ProdutoRepository.java`  
**Método**: `deleteById(Integer id)`

**Resultado**: Produto removido do sistema.

---

### **CONSULTA 12: Inserção de Categoria (INSERT)**

**Descrição**: Cria uma nova categoria.

**Nível de Complexidade**: ⭐⭐ MÉDIA

**SQL**:
```sql
INSERT INTO Categoria (nome, descricao, ativo, data_criacao, data_atualizacao) 
VALUES (?, ?, ?, NOW(), NOW())
```

**Parâmetros**:
- `?` - Nome da categoria
- `?` - Descrição da categoria
- `?` - Status ativo (true/false)

**Localização**: `Backend/sigma/src/main/java/com/project/sigma/repository/CategoriaRepository.java`  
**Método**: `salvar(Categoria categoria)`

**Resultado**: Nova categoria criada.

---

### **CONSULTA 13: Atualização de Categoria (UPDATE)**

**Descrição**: Atualiza dados de uma categoria.

**Nível de Complexidade**: ⭐⭐ MÉDIA

**SQL**:
```sql
UPDATE Categoria 
SET 
    nome = ?, 
    descricao = ?, 
    ativo = ?, 
    data_atualizacao = NOW()
WHERE id_categoria = ?
```

**Parâmetros**:
- `?` - Novo nome
- `?` - Nova descrição
- `?` - Novo status
- `?` - ID da categoria

**Localização**: `Backend/sigma/src/main/java/com/project/sigma/service/CategoriaService.java`  
**Método**: `atualizar()`

**Resultado**: Categoria atualizada.

---

### **CONSULTA 14: Exclusão de Categoria (DELETE)**

**Descrição**: Remove uma categoria do sistema.

**Nível de Complexidade**: ⭐ BAIXA

**SQL**:
```sql
DELETE FROM Categoria 
WHERE id_categoria = ?
```

**Parâmetros**:
- `?` - ID da categoria

**Localização**: `Backend/sigma/src/main/java/com/project/sigma/controller/CategoriaController.java`  
**Método**: `excluirCategoria()`

**Resultado**: Categoria removida (produtos associados ficam com categoria NULL).

---

### **CONSULTA 15: Inserção de Cliente/Pessoa (INSERT)**

**Descrição**: Cria uma nova pessoa no sistema.

**Nível de Complexidade**: ⭐⭐ MÉDIA

**SQL**:
```sql
INSERT INTO Pessoa (nome, rua, numero, bairro, cidade) 
VALUES (?, ?, ?, ?, ?)
```

**Parâmetros**:
- `?` - Nome completo
- `?` - Rua
- `?` - Número
- `?` - Bairro
- `?` - Cidade

**Localização**: `Backend/sigma/src/main/java/com/project/sigma/repository/PessoaRepository.java`  
**Método**: `salvar(Pessoa pessoa)`

**Resultado**: Nova pessoa criada com ID gerado.

---

### **CONSULTA 16: Atualização de Cliente/Pessoa (UPDATE)**

**Descrição**: Atualiza dados cadastrais de uma pessoa.

**Nível de Complexidade**: ⭐⭐ MÉDIA

**SQL**:
```sql
UPDATE Pessoa 
SET 
    nome = ?, 
    rua = ?, 
    numero = ?, 
    bairro = ?, 
    cidade = ? 
WHERE id_pessoa = ?
```

**Parâmetros**:
- `?` - Novos dados (5x)
- `?` - ID da pessoa

**Localização**: `Backend/sigma/src/main/java/com/project/sigma/repository/PessoaRepository.java`  
**Método**: `atualizar(Pessoa pessoa)`

**Resultado**: Dados da pessoa atualizados.

---

### **CONSULTA 17: Exclusão de Pessoa (DELETE)**

**Descrição**: Remove uma pessoa do sistema.

**Nível de Complexidade**: ⭐ BAIXA

**SQL**:
```sql
DELETE FROM Pessoa 
WHERE id_pessoa = ?
```

**Parâmetros**:
- `?` - ID da pessoa

**Localização**: `Backend/sigma/src/main/java/com/project/sigma/repository/PessoaRepository.java`  
**Método**: `deletarPorId(Long id)`

**Resultado**: Pessoa removida do sistema.

---

## CONSULTAS COM FILTROS DINÂMICOS

### **CONSULTA 18: Busca de Usuário por Login (Autenticação)**

**Descrição**: Busca usuário para autenticação no sistema.

**Nível de Complexidade**: ⭐⭐ MÉDIA

**SQL**:
```sql
SELECT 
    id_usuario, 
    nome, 
    username, 
    password, 
    role, 
    status 
FROM Usuario 
WHERE username = ?
```

**Parâmetros**:
- `?` - Nome de usuário (login)

**Localização**: `Backend/sigma/src/main/java/com/project/sigma/repository/UsuarioRepository.java`  
**Método**: `findByLogin(String login)`

**Resultado**: Dados do usuário para validação de credenciais.

**Observação**: Essencial para sistema de autenticação JWT.

---

### **CONSULTA 19: Verificação de Existência de Usuário**

**Descrição**: Verifica se um username já existe (evita duplicação).

**Nível de Complexidade**: ⭐ BAIXA

**SQL**:
```sql
SELECT COUNT(*) 
FROM Usuario 
WHERE username = ?
```

**Parâmetros**:
- `?` - Username a verificar

**Localização**: `Backend/sigma/src/main/java/com/project/sigma/repository/UsuarioRepository.java`  
**Método**: `existsByUsername(String username)`

**Resultado**: Quantidade (0 ou 1+) indicando se existe.

---

### **CONSULTA 20: Atualização Condicional de Telefone (UPDATE ou INSERT)**

**Descrição**: Atualiza telefone existente ou insere novo se não existir.

**Nível de Complexidade**: ⭐⭐⭐ MÉDIA-ALTA

**SQL (UPDATE)**:
```sql
UPDATE Telefone 
SET numero = ? 
WHERE id_pessoa = ?
```

**SQL (INSERT - se UPDATE retornar 0 linhas)**:
```sql
INSERT INTO Telefone (id_pessoa, numero) 
VALUES (?, ?)
```

**Parâmetros**:
- `?` - Número de telefone
- `?` - ID da pessoa

**Localização**: `Backend/sigma/src/main/java/com/project/sigma/repository/ClienteRepository.java`  
**Método**: `atualizar()` (lógica condicional)

**Resultado**: Telefone atualizado ou criado.

**Observação**: Demonstra lógica condicional (tenta UPDATE, se falhar faz INSERT).

---

## LOCALIZAÇÃO NO CÓDIGO

### Estrutura de Arquivos com Consultas SQL

```
Backend/sigma/src/main/java/com/project/sigma/
│
├── repository/
│   ├── ProdutoRepository.java          [CONSULTAS] 1, 3, 8, 9, 10, 11
│   ├── ClienteRepository.java          [CONSULTAS] 2, 20
│   ├── CategoriaRepository.java        [CONSULTAS] 12
│   ├── PessoaRepository.java          [CONSULTAS] 15, 16, 17
│   └── UsuarioRepository.java         [CONSULTAS] 18, 19
│
├── controller/
│   ├── ReportsController.java         [CONSULTAS] 4, 5, 6, 7
│   └── CategoriaController.java       [CONSULTAS] 14
│
└── service/
    └── CategoriaService.java          [CONSULTAS] 13
```

---

## RESUMO ESTATÍSTICO

### Distribuição de Consultas por Complexidade

| Complexidade | Quantidade | Consultas |
|--------------|------------|-----------|
| BAIXA | 6 | 4, 5, 11, 14, 17, 19 |
| MÉDIA | 9 | 3, 6, 7, 9, 10, 12, 13, 15, 16, 18 |
| MÉDIA-ALTA | 3 | 1, 8, 20 |
| ALTA | 2 | 2 |

### Distribuição por Tipo de Operação

| Tipo | Quantidade | Descrição |
|------|------------|-----------|
| **SELECT com JOIN** | 3 | Consultas 1, 2, 3 |
| **SELECT com Agregação** | 5 | Consultas 4, 5, 6, 7, 8, 19 |
| **INSERT** | 4 | Consultas 9, 12, 15, 20 |
| **UPDATE** | 5 | Consultas 10, 13, 16, 20 |
| **DELETE** | 3 | Consultas 11, 14, 17 |

### Critérios Cumpridos

[OK] **Pelo menos 4 consultas**: 20 consultas implementadas  
[OK] **Pelo menos 1 JOIN**: 3 consultas com JOIN (sendo 1 com múltiplos JOINs)  
[OK] **Diferentes níveis de complexidade**: De baixa a alta complexidade  
[OK] **SQL explícito**: Todas usando JdbcTemplate (não JPA)  
[OK] **CRUD completo**: Implementado para 4 tabelas diferentes

---

## DESTAQUES TÉCNICOS

### Características Avançadas Implementadas

1. **Paginação Dinâmica**: Queries 1 e 8 (LIMIT/OFFSET)
2. **Filtros Múltiplos**: Queries 1 e 2 (WHERE dinâmico com múltiplas condições)
3. **Múltiplos JOINs**: Query 2 (JOIN + 3x LEFT JOIN)
4. **Funções de Agregação**: Queries 4-8 (COUNT, SUM)
5. **Cálculos Aritméticos**: Query 7 (SUM com multiplicação)
6. **Lógica Condicional**: Query 20 (UPDATE ou INSERT baseado em resultado)
7. **Timestamps Automáticos**: Uso de NOW() em várias queries
8. **Busca LIKE em Múltiplos Campos**: Queries 1 e 2
9. **LOWER() para Case-Insensitive**: Query 2
10. **Subconsultas**: Query 8 (COUNT com subquery)

---

## CONCLUSÃO

Este documento comprova que o projeto **S.I.G.M.A** implementa:

- [OK] **20 consultas SQL explícitas** (muito além das 4 obrigatórias)
- [OK] **3 consultas com JOIN** (incluindo múltiplos JOINs)
- [OK] **CRUD completo para 4 tabelas** (Produto, Categoria, Pessoa, Cliente)
- [OK] **Diferentes níveis de complexidade** (baixa, média, média-alta, alta)
- [OK] **Uso de JDBC explícito** (JdbcTemplate com SQL manual)
- [OK] **Consultas de agregação** (COUNT, SUM)
- [OK] **Paginação e filtros dinâmicos**

**Todas as consultas estão prontas para demonstração e avaliação.**

---

**Data**: 2025  
**Sistema**: S.I.G.M.A - Sistema Integrado de Gestão para Mercados e Atacados