package com.project.sigma.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PromocaoProduto {
    private Long id_promocao;
    private Long id_produto;

    // Not stored in DB, populated when needed
    private Promocao promocao;
    private Produto produto;

    public PromocaoProduto(Long id_promocao, Long id_produto) {
        this.id_promocao = id_promocao;
        this.id_produto = id_produto;
    }
}
