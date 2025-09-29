package com.project.sigma.service;

import com.project.sigma.model.Produto;
import com.project.sigma.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    public Page<Produto> getProdutos(Pageable pageable, String search, Long categoryId, String status) {
        return produtoRepository.findAll(search, categoryId, status, pageable);
    }

    public Produto criarProduto(Produto produto) {
        // Aqui você pode adicionar lógicas de negócio, como validações
        // Por enquanto, apenas repassamos para o repositório salvar
        // produtoRepository.save(produto); // Implementar o método save no repository
        return produto; // Retorna o produto (idealmente com o novo ID)
    }

    public Produto atualizarProduto(Produto produto) {
        // Adicionar lógica para chamar o método de update no repository
        // produtoRepository.update(produto);
        return produto;
    }

    public void deletarProduto(Long id) {
        // Adicionar lógica para chamar o método de delete no repository
        // produtoRepository.deleteById(id);
    }
}