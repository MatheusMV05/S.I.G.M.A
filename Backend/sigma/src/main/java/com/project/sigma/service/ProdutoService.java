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
import java.util.Optional;

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
     * Salva (cria ou atualiza) um produto após validar as regras de negócio.
     * @param produto O produto a ser salvo.
     * @return O produto salvo.
     * @throws IllegalArgumentException se os dados do produto forem inválidos.
     */
    public Produto saveProduto(Produto produto) {

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

        // Regra 4 (Nova): Validação do ID para atualização
        if (produto.getIdProduto() != null) {
            // Se está atualizando, verifica se o produto realmente existe.
            produtoRepository.findById(produto.getIdProduto())
                    .orElseThrow(() -> new IllegalArgumentException("Produto com ID " + produto.getIdProduto() + " não encontrado para atualização."));
        }

        // Se todas as validações passarem, chamamos o repositório para salvar.
        // O método save do repositório já sabe se deve fazer INSERT ou UPDATE.
        return produtoRepository.save(produto);
    }

    /**
     * Exclui um produto pelo seu ID.
     * @param id O ID do produto a ser excluído.
     */
    public void deleteProduto(Integer id) { // Corrigido de Long para Integer
        if (id == null) {
            throw new IllegalArgumentException("O ID do produto não pode ser nulo para a exclusão.");
        }
        produtoRepository.deleteById(id);
    }

    public List<Produto> buscarTodosProdutos() {
        return produtoRepository.findAll();
    }

    public Optional<Produto> buscarProdutoPorId(Integer id) { // Novo método
        return produtoRepository.findById(id);
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

