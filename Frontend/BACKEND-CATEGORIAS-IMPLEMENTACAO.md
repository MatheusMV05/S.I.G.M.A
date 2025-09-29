# BACKEND - IMPLEMENTAÇÃO COMPLETA DE CATEGORIAS

## 🎯 OBJETIVO
Implementar os endpoints restantes no Spring Boot para que o sistema de categorias funcione completamente com o frontend já desenvolvido.

## 📋 STATUS ATUAL

### ✅ JÁ IMPLEMENTADO:
```java
GET /api/categorias           - Lista todas as categorias
GET /api/categorias/{id}      - Busca categoria por ID
```

### ❌ FALTA IMPLEMENTAR:
```java
POST   /api/categorias           - Criar nova categoria
PUT    /api/categorias/{id}      - Atualizar categoria existente  
DELETE /api/categorias/{id}      - Excluir categoria
PATCH  /api/categorias/{id}/status - Ativar/desativar categoria
```

## 🏗️ ESTRUTURA NECESSÁRIA

### 1. Modelo JPA (Categoria Entity)
```java
@Entity
@Table(name = "categorias")
public class Categoria {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_categoria")
    private Long idCategoria;
    
    @Column(name = "nome", nullable = false, length = 100)
    @NotBlank(message = "Nome é obrigatório")
    private String nome;
    
    @Column(name = "descricao", length = 500)
    private String descricao;
    
    @Column(name = "ativo", nullable = false)
    private Boolean ativo = true;
    
    @Column(name = "data_criacao")
    @CreationTimestamp
    private LocalDateTime dataCriacao;
    
    @Column(name = "data_atualizacao")
    @UpdateTimestamp
    private LocalDateTime dataAtualizacao;
    
    // Construtores, getters e setters
}
```

### 2. DTOs para Request/Response
```java
// DTO para criação
public class CreateCategoriaRequest {
    @NotBlank(message = "Nome é obrigatório")
    private String nome;
    
    private String descricao;
    private Boolean ativo = true;
    
    // getters e setters
}

// DTO para atualização
public class UpdateCategoriaRequest {
    private String nome;
    private String descricao;
    private Boolean ativo;
    
    // getters e setters
}

// DTO para resposta
public class CategoriaResponse {
    private Long idCategoria;
    private String nome;
    private String descricao;
    private Boolean ativo;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;
    
    // getters e setters
}
```

### 3. Repository
```java
@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    
    // Buscar por nome (para validar duplicatas)
    Optional<Categoria> findByNomeIgnoreCase(String nome);
    
    // Buscar apenas categorias ativas
    List<Categoria> findByAtivoTrue();
    
    // Buscar com filtro de status
    List<Categoria> findByAtivo(Boolean ativo);
    
    // Buscar por nome contendo (para busca)
    List<Categoria> findByNomeContainingIgnoreCaseAndAtivo(String nome, Boolean ativo);
}
```

## 🚀 ENDPOINTS A IMPLEMENTAR

### 1. POST /api/categorias - Criar Categoria
```java
@PostMapping
public ResponseEntity<CategoriaResponse> criarCategoria(@Valid @RequestBody CreateCategoriaRequest request) {
    // Validar se nome já existe
    if (categoriaRepository.findByNomeIgnoreCase(request.getNome()).isPresent()) {
        throw new IllegalArgumentException("Categoria com este nome já existe");
    }
    
    Categoria categoria = new Categoria();
    categoria.setNome(request.getNome());
    categoria.setDescricao(request.getDescricao());
    categoria.setAtivo(request.getAtivo() != null ? request.getAtivo() : true);
    
    Categoria saved = categoriaRepository.save(categoria);
    return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(saved));
}
```

### 2. PUT /api/categorias/{id} - Atualizar Categoria
```java
@PutMapping("/{id}")
public ResponseEntity<CategoriaResponse> atualizarCategoria(
        @PathVariable Long id, 
        @Valid @RequestBody UpdateCategoriaRequest request) {
    
    Categoria categoria = categoriaRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Categoria não encontrada"));
    
    // Validar nome duplicado (exceto para a própria categoria)
    if (request.getNome() != null) {
        Optional<Categoria> existing = categoriaRepository.findByNomeIgnoreCase(request.getNome());
        if (existing.isPresent() && !existing.get().getIdCategoria().equals(id)) {
            throw new IllegalArgumentException("Categoria com este nome já existe");
        }
        categoria.setNome(request.getNome());
    }
    
    if (request.getDescricao() != null) {
        categoria.setDescricao(request.getDescricao());
    }
    
    if (request.getAtivo() != null) {
        categoria.setAtivo(request.getAtivo());
    }
    
    Categoria saved = categoriaRepository.save(categoria);
    return ResponseEntity.ok(toResponse(saved));
}
```

### 3. DELETE /api/categorias/{id} - Excluir Categoria
```java
@DeleteMapping("/{id}")
public ResponseEntity<Void> excluirCategoria(@PathVariable Long id) {
    Categoria categoria = categoriaRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Categoria não encontrada"));
    
    // Verificar se categoria está sendo usada por produtos
    if (produtoRepository.existsByCategoriaIdCategoria(id)) {
        throw new IllegalStateException("Não é possível excluir categoria que possui produtos vinculados");
    }
    
    categoriaRepository.delete(categoria);
    return ResponseEntity.noContent().build();
}
```

### 4. PATCH /api/categorias/{id}/status - Ativar/Desativar
```java
@PatchMapping("/{id}/status")
public ResponseEntity<CategoriaResponse> alterarStatus(
        @PathVariable Long id, 
        @RequestBody Map<String, Boolean> status) {
    
    Categoria categoria = categoriaRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Categoria não encontrada"));
    
    Boolean novoStatus = status.get("ativo");
    if (novoStatus == null) {
        throw new IllegalArgumentException("Campo 'ativo' é obrigatório");
    }
    
    categoria.setAtivo(novoStatus);
    Categoria saved = categoriaRepository.save(categoria);
    
    return ResponseEntity.ok(toResponse(saved));
}
```

## 🔧 MELHORIAS OPCIONAIS (Para o futuro)

### 1. Paginação nos Endpoints GET
```java
@GetMapping
public ResponseEntity<Page<CategoriaResponse>> listarCategorias(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false) String search,
        @RequestParam(required = false) Boolean ativo) {
    
    Pageable pageable = PageRequest.of(page, size, Sort.by("nome"));
    Page<Categoria> categorias;
    
    if (search != null && ativo != null) {
        categorias = categoriaRepository.findByNomeContainingIgnoreCaseAndAtivo(search, ativo, pageable);
    } else if (search != null) {
        categorias = categoriaRepository.findByNomeContainingIgnoreCase(search, pageable);
    } else if (ativo != null) {
        categorias = categoriaRepository.findByAtivo(ativo, pageable);
    } else {
        categorias = categoriaRepository.findAll(pageable);
    }
    
    Page<CategoriaResponse> response = categorias.map(this::toResponse);
    return ResponseEntity.ok(response);
}
```

### 2. Tratamento de Exceções
```java
@RestControllerAdvice
public class CategoriaExceptionHandler {
    
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(EntityNotFoundException ex) {
        ErrorResponse error = new ErrorResponse("CATEGORIA_NOT_FOUND", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleBadRequest(IllegalArgumentException ex) {
        ErrorResponse error = new ErrorResponse("INVALID_DATA", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
    
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorResponse> handleConflict(IllegalStateException ex) {
        ErrorResponse error = new ErrorResponse("BUSINESS_RULE_VIOLATION", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }
}
```

## 📊 SCRIPT SQL PARA TABELA (Se necessário)
```sql
CREATE TABLE categorias (
    id_categoria BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao VARCHAR(500),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX idx_categorias_nome ON categorias(nome);
CREATE INDEX idx_categorias_ativo ON categorias(ativo);
```

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### Básico (Mínimo para funcionar):
- [ ] Criar modelo JPA `Categoria`
- [ ] Implementar `POST /api/categorias`
- [ ] Implementar `PUT /api/categorias/{id}`
- [ ] Implementar `DELETE /api/categorias/{id}` 
- [ ] Implementar `PATCH /api/categorias/{id}/status`
- [ ] Adicionar validações básicas
- [ ] Testar com frontend

### Avançado (Recomendado):
- [ ] Adicionar paginação no GET
- [ ] Implementar tratamento de exceções
- [ ] Adicionar logs de auditoria
- [ ] Validar dependências com produtos
- [ ] Testes unitários

## 🧪 COMO TESTAR

1. **Testar criação**: Acessar `/categories` no frontend e criar uma nova categoria
2. **Testar listagem**: Verificar se as categorias aparecem na grid
3. **Testar edição**: Clicar em editar e modificar uma categoria
4. **Testar exclusão**: Tentar excluir uma categoria
5. **Testar status**: Ativar/desativar categorias

## 🚀 RESULTADO ESPERADO

Após implementar esses endpoints, o frontend de categorias estará **100% funcional** com:
- Criação, edição e exclusão de categorias
- Ativação/desativação de status
- Listagem com busca e filtros
- Tratamento de erros e validações
- Interface completa e responsiva

**O frontend já está pronto e aguardando apenas esses endpoints!** 🎯