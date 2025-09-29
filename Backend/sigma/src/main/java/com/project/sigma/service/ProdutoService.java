package com.project.sigma.service;

import com.project.sigma.dto.PaginatedResponseDTO;
import com.project.sigma.dto.ProdutoResponseDTO;
import com.project.sigma.model.Produto;
import com.project.sigma.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    // Novo método para paginação com DTO
    public PaginatedResponseDTO<ProdutoResponseDTO> buscarProdutosComPaginacao(
        int page, int size, String search, Integer categoryId, String status) {
        return produtoRepository.findAllWithPagination(page, size, search, categoryId, status);
    }

    public ProdutoResponseDTO buscarProdutoCompletoPorId(Integer id) {
        return produtoRepository.findByIdComplete(id);
    }

    /**
     * Orquestra a criação de um novo produto.
     * @param produto O produto a ser criado.
     * @return O produto salvo com seu novo ID.
     */
    public Produto criarProduto(Produto produto) {
        if (!StringUtils.hasText(produto.getNome())) {
            throw new IllegalArgumentException("O nome do produto é obrigatório.");
        }
        if (produto.getValorUnitario() == null) {
            throw new IllegalArgumentException("O preço de venda é obrigatório.");
        }
        if (!StringUtils.hasText(produto.getStatus())) {
            produto.setStatus("ATIVO");
        }

        return produtoRepository.save(produto);
    }

    /**
     * Orquestra a atualização de um produto existente.
     * @param produto O produto com os dados a serem atualizados.
     * @return O produto atualizado.
     */
    public Produto atualizarProduto(Produto produto) {
        if (produto.getIdProduto() == null) {
            throw new IllegalArgumentException("ID do produto não pode ser nulo para atualização.");
        }
        return produtoRepository.save(produto);
    }

    /**
     * Orquestra a exclusão de um produto.
     * @param id O ID do produto a ser deletado.
     */
    public void deletarProduto(Integer id) {
        if (id == null) {
            throw new IllegalArgumentException("O ID do produto não pode ser nulo para exclusão.");
        }
        produtoRepository.deleteById(id);
    }
}