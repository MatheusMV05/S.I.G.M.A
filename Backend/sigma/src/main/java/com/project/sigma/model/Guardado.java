package com.project.sigma.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Guardado {
    private Long id_prateleira;
    private Long id_produto;
    private Integer quantidade_em_prateleira;

    // Not stored in DB, populated when needed
    private Prateleira prateleira;
    private Produto produto;

    public Guardado(Long id_prateleira, Long id_produto, Integer quantidade_em_prateleira) {
        this.id_prateleira = id_prateleira;
        this.id_produto = id_produto;
        this.quantidade_em_prateleira = quantidade_em_prateleira != null ? quantidade_em_prateleira : 0;
    }
}
