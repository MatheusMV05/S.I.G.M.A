package com.project.sigma.controller;

import com.project.sigma.dto.PaginatedResponseDTO;
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
    public ResponseEntity<Produto> criarProduto(@RequestBody Produto produto) {
        Produto novoProduto = produtoService.criarProduto(produto);
        return new ResponseEntity<>(novoProduto, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizarProduto(@PathVariable Integer id, @RequestBody Produto produto) {
        produto.setIdProduto(id);
        Produto produtoAtualizado = produtoService.atualizarProduto(produto);
        return ResponseEntity.ok(produtoAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarProduto(@PathVariable Integer id) {
        produtoService.deletarProduto(id);
        return ResponseEntity.noContent().build();
    }
}