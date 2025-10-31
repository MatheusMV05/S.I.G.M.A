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

/**
 * Controller alternativo para manter compatibilidade com frontend
 * que chama /api/produto ao invés de /api/products
 */
@RestController
@RequestMapping("/api/produto")
@CrossOrigin(origins = "*")
public class ProdutoAliasController {

    @Autowired
    private ProdutoService produtoService;

    /**
     * GET /api/produto - Lista produtos com paginação
     */
    @GetMapping
    public ResponseEntity<PaginatedResponseDTO<ProdutoResponseDTO>> getProdutos(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {

        PaginatedResponseDTO<ProdutoResponseDTO> response = produtoService.getProdutosPaginados(
                nome, status, categoriaId, page, size
        );
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/produto/{id} - Busca produto por ID
     */
    @GetMapping("/{id:[0-9]+}")
    public ResponseEntity<ProdutoResponseDTO> getProdutoById(@PathVariable Long id) {
        return produtoService.buscarProdutoCompletoPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/produto - Cria novo produto
     */
    @PostMapping
    public ResponseEntity<Produto> createProduto(@RequestBody ProdutoRequestDTO dto) {
        // Validação básica
        if (dto.getNome() == null || dto.getNome().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Converter DTO para entidade
        Produto produto = new Produto();
        produto.setNome(dto.getNome());
        produto.setMarca(dto.getMarca());
        produto.setEstoque(dto.getQuantEmEstoque() != null ? dto.getQuantEmEstoque() : 0);
        produto.setPreco_venda(dto.getValorUnitario());
        produto.setData_validade(dto.getDataValidade());
        produto.setId_categoria(dto.getIdCategoria());
        produto.setDescricao(dto.getDescricao());
        produto.setEstoque_minimo(dto.getEstoqueMinimo() != null ? dto.getEstoqueMinimo() : 0);
        produto.setEstoque_maximo(dto.getEstoqueMaximo() != null ? dto.getEstoqueMaximo() : 1000);
        produto.setPreco_custo(dto.getPrecoCusto());

        // Tratar status
        if (dto.getStatus() != null && !dto.getStatus().trim().isEmpty()) {
            try {
                produto.setStatus(Produto.StatusProduto.valueOf(dto.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                produto.setStatus(Produto.StatusProduto.ATIVO);
            }
        } else {
            produto.setStatus(Produto.StatusProduto.ATIVO);
        }

        produto.setCodigo_barras(dto.getCodigoBarras());

        try {
            Produto novoProduto = produtoService.criarProduto(produto);
            return new ResponseEntity<>(novoProduto, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * PUT /api/produto/{id} - Atualiza produto
     */
    @PutMapping("/{id}")
    public ResponseEntity<Produto> updateProduto(
            @PathVariable Long id,
            @RequestBody ProdutoRequestDTO dto) {

        // Converter DTO para entidade
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
        produto.setEstoque_maximo(dto.getEstoqueMaximo() != null ? dto.getEstoqueMaximo() : 1000);
        produto.setPreco_custo(dto.getPrecoCusto());
        produto.setStatus(Produto.StatusProduto.valueOf(dto.getStatus()));
        produto.setCodigo_barras(dto.getCodigoBarras());

        Produto produtoAtualizado = produtoService.atualizarProduto(produto);
        return ResponseEntity.ok(produtoAtualizado);
    }

    /**
     * DELETE /api/produto/{id} - Deleta produto
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduto(@PathVariable Long id) {
        produtoService.deletarProduto(id);
        return ResponseEntity.noContent().build();
    }
}
