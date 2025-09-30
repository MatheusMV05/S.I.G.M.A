package com.project.sigma.controller;

import com.project.sigma.dto.PaginatedResponseDTO;
import com.project.sigma.dto.ProdutoRequestDTO;
import com.project.sigma.dto.ProdutoResponseDTO;
import com.project.sigma.model.Produto;
import com.project.sigma.service.ProdutoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    @GetMapping
    public PaginatedResponseDTO<ProdutoResponseDTO> listarProdutos(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false) String search,
        @RequestParam(required = false) Long categoryId,
        @RequestParam(required = false) Long categoriaId, // ADICIONADO: para compatibilidade com frontend
        @RequestParam(required = false) String status
    ) {
        // CORRIGIDO: usar categoriaId se categoryId for null
        Long finalCategoryId = categoryId != null ? categoryId : categoriaId;

        System.out.println("📦 GET /api/products - Listando produtos com paginação");
        System.out.println("   📄 Parâmetros: page=" + page + ", size=" + size + ", search=" + search + ", categoryId=" + categoryId + ", categoriaId=" + categoriaId + ", finalCategoryId=" + finalCategoryId + ", status=" + status);

        PaginatedResponseDTO<ProdutoResponseDTO> response = produtoService.buscarProdutosComPaginacao(page, size, search, finalCategoryId, status);

        System.out.println("📤 Retornando resposta paginada");
        return response;
    }

    @GetMapping("/estoque-baixo")
    public ResponseEntity<?> getLowStockProducts() {
        System.out.println("⚠️ GET /api/products/estoque-baixo - Buscando produtos com baixo estoque");

        try {
            return ResponseEntity.ok(produtoService.buscarProdutosComBaixoEstoque());
        } catch (Exception e) {
            System.err.println("❌ Erro ao buscar produtos com baixo estoque: " + e.getMessage());
            return ResponseEntity.ok(new Object[0]);
        }
    }

    @GetMapping("/{id:[0-9]+}")  // CORRIGIDO: especifica que id deve ser numérico
    public ResponseEntity<ProdutoResponseDTO> getProdutoById(@PathVariable Long id) {
        return produtoService.buscarProdutoCompletoPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Produto> criarProduto(@RequestBody ProdutoRequestDTO dto) {
        System.out.println("=== DEBUG PRODUTO CREATE ===");
        System.out.println("DTO recebido do frontend para CRIAR:");
        System.out.println("nome: " + dto.getNome());
        System.out.println("marca: " + dto.getMarca());
        System.out.println("quantEmEstoque: " + dto.getQuantEmEstoque());
        System.out.println("valorUnitario: " + dto.getValorUnitario());
        System.out.println("dataValidade: " + dto.getDataValidade());
        System.out.println("idCategoria: " + dto.getIdCategoria());
        System.out.println("descricao: " + dto.getDescricao());
        System.out.println("estoqueMinimo: " + dto.getEstoqueMinimo());
        System.out.println("estoqueMaximo: " + dto.getEstoqueMaximo());
        System.out.println("precoCusto: " + dto.getPrecoCusto());
        System.out.println("status: " + dto.getStatus());
        System.out.println("codigoBarras: " + dto.getCodigoBarras());

        // Validação básica do DTO antes da conversão
        if (dto.getNome() == null || dto.getNome().trim().isEmpty()) {
            System.err.println("❌ ERRO: Nome do produto está null ou vazio no DTO");
            return ResponseEntity.badRequest().build();
        }

        // Convert DTO to entity using new schema field names
        Produto produto = new Produto();
        produto.setNome(dto.getNome());
        produto.setMarca(dto.getMarca());
        produto.setEstoque(dto.getQuantEmEstoque() != null ? dto.getQuantEmEstoque() : 0);
        produto.setPreco_venda(dto.getValorUnitario());
        produto.setData_validade(dto.getDataValidade());
        produto.setId_categoria(dto.getIdCategoria());
        produto.setDescricao(dto.getDescricao());
        produto.setEstoque_minimo(dto.getEstoqueMinimo() != null ? dto.getEstoqueMinimo() : 0);
        // CORRIGIDO: garantir que estoque_maximo nunca seja null
        produto.setEstoque_maximo(dto.getEstoqueMaximo() != null ? dto.getEstoqueMaximo() : 1000);
        produto.setPreco_custo(dto.getPrecoCusto());

        // CORRIGIDO: tratar status null com valor padrão
        if (dto.getStatus() != null && !dto.getStatus().trim().isEmpty()) {
            try {
                produto.setStatus(Produto.StatusProduto.valueOf(dto.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                System.err.println("❌ Status inválido: " + dto.getStatus() + ". Usando ATIVO como padrão.");
                produto.setStatus(Produto.StatusProduto.ATIVO);
            }
        } else {
            produto.setStatus(Produto.StatusProduto.ATIVO);
        }

        produto.setCodigo_barras(dto.getCodigoBarras());

        System.out.println("Produto convertido antes de enviar para service:");
        System.out.println("nome: " + produto.getNome());
        System.out.println("preco_venda: " + produto.getPreco_venda());
        System.out.println("estoque: " + produto.getEstoque());
        System.out.println("preco_custo: " + produto.getPreco_custo());
        System.out.println("status: " + produto.getStatus());
        System.out.println("estoque_maximo: " + produto.getEstoque_maximo());
        System.out.println("===============================");

        try {
            Produto novoProduto = produtoService.criarProduto(produto);
            System.out.println("✅ Produto criado com sucesso");
            return new ResponseEntity<>(novoProduto, HttpStatus.CREATED);
        } catch (Exception e) {
            System.err.println("❌ Erro ao criar produto: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizarProduto(@PathVariable Long id, @RequestBody ProdutoRequestDTO dto) {
        System.out.println("=== DEBUG PRODUTO UPDATE ===");
        System.out.println("ID recebido: " + id);

        // Convert DTO to entity using new schema field names
        Produto produto = new Produto();
        produto.setId_produto(id);
        produto.setNome(dto.getNome());
        produto.setMarca(dto.getMarca());
        produto.setEstoque(dto.getQuantEmEstoque());
        produto.setPreco_venda(dto.getValorUnitario());
        produto.setData_validade(dto.getDataValidade());
        produto.setId_categoria(dto.getIdCategoria());
        produto.setDescricao(dto.getDescricao());
        produto.setEstoque_minimo(dto.getEstoqueMinimo());
        // CORRIGIDO: garantir que estoque_maximo nunca seja null
        produto.setEstoque_maximo(dto.getEstoqueMaximo() != null ? dto.getEstoqueMaximo() : 1000);
        produto.setPreco_custo(dto.getPrecoCusto());
        produto.setStatus(Produto.StatusProduto.valueOf(dto.getStatus()));
        produto.setCodigo_barras(dto.getCodigoBarras());

        System.out.println("Produto antes de enviar para service:");
        System.out.println("preco_venda: " + produto.getPreco_venda());
        System.out.println("estoque: " + produto.getEstoque());
        System.out.println("estoque_maximo: " + produto.getEstoque_maximo());
        System.out.println("===============================");

        Produto produtoAtualizado = produtoService.atualizarProduto(produto);
        return ResponseEntity.ok(produtoAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarProduto(@PathVariable Long id) {
        produtoService.deletarProduto(id);
        return ResponseEntity.noContent().build();
    }
}