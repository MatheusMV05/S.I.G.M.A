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
import java.util.Optional;

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

    // NOVO endpoint para buscar um único produto por ID
    @GetMapping("/{id}")
    public ResponseEntity<Produto> getProdutoById(@PathVariable Integer id) {
        return produtoService.buscarProdutoPorId(id)
                .map(produto -> ResponseEntity.ok(produto)) // Se encontrar, retorna 200 OK com o produto
                .orElse(ResponseEntity.notFound().build()); // Se não, retorna 404 Not Found
    }

    // Endpoint para criar um novo produto
    @PostMapping
    public ResponseEntity<Produto> criarProduto(@RequestBody Produto produto) {
        // Zera o ID para garantir que o método 'save' crie um novo registro
        produto.setIdProduto(null);
        Produto novoProduto = produtoService.saveProduto(produto);
        // Retorna 201 Created, que é a resposta HTTP correta para criação
        return ResponseEntity.status(201).body(novoProduto);
    }

    // Endpoint para atualizar um produto
    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizarProduto(@PathVariable Integer id, @RequestBody Produto produtoDetalhes) {
        // Primeiro, busca o produto para garantir que ele existe
        return produtoService.buscarProdutoPorId(id)
                .map(produtoExistente -> {
                    // Garante que o ID do produto a ser atualizado é o mesmo da URL
                    produtoDetalhes.setIdProduto(id);
                    Produto produtoAtualizado = produtoService.saveProduto(produtoDetalhes);
                    return ResponseEntity.ok(produtoAtualizado);
                })
                .orElse(ResponseEntity.notFound().build()); // Retorna 404 se o produto não existir
    }

    // Endpoint para deletar um produto
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarProduto(@PathVariable Integer id) {
        // Primeiro, busca o produto para garantir que ele existe
        Optional<Produto> produtoOptional = produtoService.buscarProdutoPorId(id);

        if (produtoOptional.isPresent()) {
            // Se o produto existe, deleta
            produtoService.deleteProduto(id);
            // E retorna 204 No Content, que é do tipo ResponseEntity<Void>
            return ResponseEntity.noContent().build();
        } else {
            // Se o produto não existe, retorna 404 Not Found
            // Esta é a forma correta de construir a resposta para que o tipo seja compatível
            return ResponseEntity.notFound().build();
        }
    }

    // --- ENDPOINTS PARA RELATÓRIOS E VISUALIZAÇÕES --- mantidos iguais

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
