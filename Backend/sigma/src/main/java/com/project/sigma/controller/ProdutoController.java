package com.project.sigma.controller;

import com.project.sigma.dto.EstoqueCategoriaDTO;
import com.project.sigma.model.Produto;
import com.project.sigma.service.ProdutoService;
import com.project.sigma.dto.EstoqueMarcaDTO;
import com.project.sigma.dto.ValorEstoqueCategoriaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.math.BigDecimal;

/**
 * Controller REST para a entidade Produto.
 * Expõe os endpoints da API para interagir com os dados dos produtos.
 */
@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    private final ProdutoService produtoService;

    @Autowired
    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    // Endpoint para buscar todos os produtos
    @GetMapping
    public List<Produto> listarTodosProdutos() {
        return produtoService.buscarTodosProdutos();
    }

    // Endpoint para criar um novo produto
    @PostMapping
    public ResponseEntity<Produto> criarProduto(@RequestBody Produto produto) {
        produtoService.criarProduto(produto);
        return ResponseEntity.ok(produto);
    }

    // Endpoint para atualizar um produto
    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizarProduto(@PathVariable Long id, @RequestBody Produto produto) {
        // Garante que o ID do produto no corpo da requisição é o mesmo da URL
        produto.setId(id);
        produtoService.atualizarProduto(produto);
        return ResponseEntity.ok(produto);
    }

    // Endpoint para deletar um produto
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarProduto(@PathVariable Long id) {
        produtoService.deletarProduto(id);
        return ResponseEntity.noContent().build();
    }

    // --- ENDPOINTS PARA RELATÓRIOS E VISUALIZAÇÕES ---

    @GetMapping("/relatorios/estoque-por-categoria")
    public List<EstoqueCategoriaDTO> getEstoquePorCategoria() {
        return produtoService.findEstoqueAgrupadoPorCategoria();
    }

    @GetMapping("/relatorios/proximos-vencimento")
    public List<Produto> getProdutosProximosVencimento() {
        return produtoService.findProdutosProximosVencimento();
    }

    @GetMapping("/relatorios/estoque-por-marca")
    public List<EstoqueMarcaDTO> getEstoquePorMarca() {
        return produtoService.findEstoqueAgrupadoPorMarca();
    }

    @GetMapping("/relatorios/valor-total-estoque")
    public BigDecimal getValorTotalEstoque() {
        return produtoService.findValorTotalEstoque();
    }

    @GetMapping("/relatorios/valor-estoque-por-categoria")
    public List<ValorEstoqueCategoriaDTO> getValorEstoquePorCategoria() {
        return produtoService.findValorEstoqueAgrupadoPorCategoria();
    }

    @GetMapping("/relatorios/estoque-baixo")
    public List<Produto> getProdutosComEstoqueBaixo() {
        return produtoService.findProdutosComEstoqueBaixo();
    }
}
