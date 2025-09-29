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
        @RequestParam(required = false) Integer categoryId,
        @RequestParam(required = false) String status
    ) {
        System.out.println("📦 GET /api/products - Listando produtos com paginação");
        System.out.println("   📄 Parâmetros: page=" + page + ", size=" + size + ", search=" + search + ", categoryId=" + categoryId + ", status=" + status);

        PaginatedResponseDTO<ProdutoResponseDTO> response = produtoService.buscarProdutosComPaginacao(page, size, search, categoryId, status);

        System.out.println("📤 Retornando " + response.getContent().size() + " produtos de " + response.getTotalElements() + " total");
        return response;
    }

    // Add endpoint for low stock products that frontend is calling
    @GetMapping("/low-stock")
    public ResponseEntity<?> getLowStockProducts() {
        System.out.println("⚠️ GET /api/products/low-stock - Buscando produtos com baixo estoque");

        try {
            // For now, return empty array but with proper logging
            System.out.println("✅ Retornando lista vazia de produtos com baixo estoque (implementação futura)");
            return ResponseEntity.ok(new Object[0]);
        } catch (Exception e) {
            System.err.println("❌ Erro ao buscar produtos com baixo estoque: " + e.getMessage());
            return ResponseEntity.ok(new Object[0]);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> getProdutoById(@PathVariable Integer id) {
        ProdutoResponseDTO produto = produtoService.buscarProdutoCompletoPorId(id);
        return produto != null ? ResponseEntity.ok(produto) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Produto> criarProduto(@RequestBody ProdutoRequestDTO dto) {
        System.out.println("=== DEBUG PRODUTO CREATE ===");
        System.out.println("DTO recebido do frontend para CRIAR:");
        dto.debugPrint();

        // Verificar se os campos obrigatórios estão presentes
        System.out.println("=== VALIDAÇÃO DOS CAMPOS ===");
        System.out.println("Nome: " + (dto.getNome() != null ? "✅ " + dto.getNome() : "❌ NULL"));
        System.out.println("Valor Unitário: " + (dto.getValorUnitario() != null ? "✅ " + dto.getValorUnitario() : "❌ NULL"));
        System.out.println("Quantidade: " + (dto.getQuantEmEstoque() != null ? "✅ " + dto.getQuantEmEstoque() : "❌ NULL"));
        System.out.println("Preço Custo: " + (dto.getPrecoCusto() != null ? "✅ " + dto.getPrecoCusto() : "❌ NULL"));
        System.out.println("Status: " + (dto.getStatus() != null ? "✅ " + dto.getStatus() : "❌ NULL"));
        System.out.println("============================");

        // Converter DTO para entidade Produto
        Produto produto = new Produto();
        produto.setNome(dto.getNome());
        produto.setMarca(dto.getMarca());
        produto.setQuantEmEstoque(dto.getQuantEmEstoque());
        produto.setValorUnitario(dto.getValorUnitario());
        produto.setDataValidade(dto.getDataValidade());
        produto.setIdCategoria(dto.getIdCategoria());
        produto.setDescricao(dto.getDescricao());
        produto.setEstoqueMinimo(dto.getEstoqueMinimo());
        produto.setEstoqueMaximo(dto.getEstoqueMaximo());
        produto.setPrecoCusto(dto.getPrecoCusto());
        produto.setStatus(dto.getStatus());
        produto.setCodigoBarras(dto.getCodigoBarras());
        produto.setUnidade(dto.getUnidade());
        produto.setPeso(dto.getPeso());

        System.out.println("Produto convertido antes de enviar para service:");
        System.out.println("valor_unitario: " + produto.getValorUnitario());
        System.out.println("quant_em_estoque: " + produto.getQuantEmEstoque());
        System.out.println("preco_custo: " + produto.getPrecoCusto());
        System.out.println("status: " + produto.getStatus());
        System.out.println("===============================");

        Produto novoProduto = produtoService.criarProduto(produto);
        System.out.println("✅ Produto criado com sucesso - ID: " + novoProduto.getIdProduto());
        return new ResponseEntity<>(novoProduto, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizarProduto(@PathVariable Integer id, @RequestBody ProdutoRequestDTO dto) {
        System.out.println("=== DEBUG PRODUTO UPDATE ===");
        System.out.println("ID recebido: " + id);
        System.out.println("DTO recebido do frontend:");
        dto.debugPrint();

        // Converter DTO para entidade Produto
        Produto produto = new Produto();
        produto.setIdProduto(id);
        produto.setNome(dto.getNome());
        produto.setMarca(dto.getMarca());
        produto.setQuantEmEstoque(dto.getQuantEmEstoque());
        produto.setValorUnitario(dto.getValorUnitario());
        produto.setDataValidade(dto.getDataValidade());
        produto.setIdCategoria(dto.getIdCategoria());
        produto.setDescricao(dto.getDescricao());
        produto.setEstoqueMinimo(dto.getEstoqueMinimo());
        produto.setEstoqueMaximo(dto.getEstoqueMaximo());
        produto.setPrecoCusto(dto.getPrecoCusto());
        produto.setStatus(dto.getStatus());
        produto.setCodigoBarras(dto.getCodigoBarras());
        produto.setUnidade(dto.getUnidade());
        produto.setPeso(dto.getPeso());

        System.out.println("Produto antes de enviar para service:");
        System.out.println("valor_unitario: " + produto.getValorUnitario());
        System.out.println("quant_em_estoque: " + produto.getQuantEmEstoque());
        System.out.println("===============================");

        Produto produtoAtualizado = produtoService.atualizarProduto(produto);
        return ResponseEntity.ok(produtoAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarProduto(@PathVariable Integer id) {
        produtoService.deletarProduto(id);
        return ResponseEntity.noContent().build();
    }
}