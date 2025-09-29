package com.project.sigma.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Prateleira {
    private Long id_prateleira;
    private String localizacao;
    private Long id_categoria;
    private Integer capacidade_maxima;

    // Not stored in DB, populated when needed
    private Categoria categoria;

    public Prateleira(String localizacao, Long id_categoria, Integer capacidade_maxima) {
        this.localizacao = localizacao;
        this.id_categoria = id_categoria;
        this.capacidade_maxima = capacidade_maxima != null ? capacidade_maxima : 1000;
    }
}
