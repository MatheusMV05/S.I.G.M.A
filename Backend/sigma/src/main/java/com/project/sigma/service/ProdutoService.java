package com.project.sigma.service;

import com.project.sigma.model.Produto;
import com.project.sigma.repository.ProdutoRepository;
import com.project.sigma.dto.EstoqueCategoriaDTO;
import com.project.sigma.dto.EstoqueMarcaDTO;
import com.project.sigma.dto.ValorEstoqueCategoriaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

/**
 * Camada de Serviço para a entidade Produto.
 * Contém a lógica de negócio e orquestra as operações de dados
 * chamando o ProdutoRepository.
 */
@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    @Autowired
    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    /**
     * Salva um novo produto após validar as regras de negócio.
     * @param produto O produto a ser salvo.
     * @throws IllegalArgumentException se os dados do produto forem inválidos.
     */
    public void criarProduto(Produto produto) {

        // Regra 1: O nome do produto não pode ser nulo ou vazio.
        if (produto.getNome() == null || produto.getNome().trim().isEmpty()) {
            throw new IllegalArgumentException("O nome do produto é obrigatório.");
        }

        // Regra 2: O valor unitário não pode ser nulo ou negativo.
        if (produto.getValorUnitario() == null || produto.getValorUnitario().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("O valor do produto não pode ser negativo.");
        }

        // Regra 3: A quantidade em estoque não pode ser negativa.
        if (produto.getQuantEmEstoque() == null || produto.getQuantEmEstoque() < 0) {
            throw new IllegalArgumentException("A quantidade em estoque não pode ser negativa.");
        }

        // Se todas as validações passarem, chamamos o repositório para salvar.
        produtoRepository.save(produto);
    }

    /**
     * Atualiza um produto existente após validar as regras de negócio.
     * @param produto O produto com as informações atualizadas.
     * @throws IllegalArgumentException se os dados do produto ou o seu ID forem inválidos.
     */
    public void atualizarProduto(Produto produto) {

        // Regra 0: O ID do produto é obrigatório para uma atualização.
        if (produto.getId() == null) {
            throw new IllegalArgumentException("O ID do produto é obrigatório para a atualização.");
        }

        // Regra 1: O nome do produto não pode ser nulo ou vazio.
        if (produto.getNome() == null || produto.getNome().trim().isEmpty()) {
            throw new IllegalArgumentException("O nome do produto é obrigatório.");
        }

        // Regra 2: O valor unitário não pode ser nulo ou negativo.
        if (produto.getValorUnitario() == null || produto.getValorUnitario().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("O valor do produto não pode ser negativo.");
        }

        // Regra 3: A quantidade em estoque não pode ser negativa.
        if (produto.getQuantEmEstoque() == null || produto.getQuantEmEstoque() < 0) {
            throw new IllegalArgumentException("A quantidade em estoque não pode ser negativa.");
        }

        // Se todas as validações passarem, chamamos o repositório para atualizar.
        produtoRepository.update(produto);
    }

    /**
     * Exclui um produto pelo seu ID após validar a entrada.
     * @param id O ID do produto a ser excluído.
     * @throws IllegalArgumentException se o ID fornecido for nulo.
     */
    public void deletarProduto(Long id) {

        // Regra 1: O ID não pode ser nulo para uma operação de exclusão.
        if (id == null) {
            throw new IllegalArgumentException("O ID do produto não pode ser nulo para a exclusão.");
        }

        // Se a validação passar, chamamos o repositório para excluir.
        produtoRepository.deleteById(id);
    }

    public List<Produto> buscarTodosProdutos() {
        return produtoRepository.findAll();
    }

    /**
     * Delega a chamada para o repositório para buscar o estoque agrupado por categoria.
     * @return A lista de DTOs com os dados do estoque por categoria.
     */
    public List<EstoqueCategoriaDTO> findEstoqueAgrupadoPorCategoria() {
        return produtoRepository.findEstoqueAgrupadoPorCategoria();
    }

    /**
     * Delega a chamada para o repositório para buscar produtos próximos ao vencimento.
     * @return A lista de produtos que vencem nos próximos 7 dias.
     */
    public List<Produto> findProdutosProximosVencimento() {
        return produtoRepository.findProdutosProximosVencimento();
    }

    /**
     * Delega a chamada para o repositório para buscar o estoque agrupado por marca.
     * @return A lista de DTOs com os dados do estoque por marca.
     */
    public List<EstoqueMarcaDTO> findEstoqueAgrupadoPorMarca() {
        return produtoRepository.findEstoqueAgrupadoPorMarca();
    }

    /**
     * Delega a chamada para o repositório para buscar o valor total do estoque.
     * @return O valor total do estoque como BigDecimal.
     */
    public BigDecimal findValorTotalEstoque() {
        return produtoRepository.findValorTotalEstoque();
    }

    /**
     * Delega a chamada para o repositório para buscar o valor de estoque por categoria.
     * @return A lista de DTOs com os dados de valor de estoque por categoria.
     */
    public List<ValorEstoqueCategoriaDTO> findValorEstoqueAgrupadoPorCategoria() {
        return produtoRepository.findValorEstoqueAgrupadoPorCategoria();
    }

    /**
     * Delega a chamada para o repositório para buscar produtos com estoque baixo.
     * @return A lista de produtos com estoque baixo.
     */
    public List<Produto> findProdutosComEstoqueBaixo() {
        return produtoRepository.findProdutosComEstoqueBaixo();
    }
}

