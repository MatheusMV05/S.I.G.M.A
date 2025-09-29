package com.project.sigma.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Categoria {
    private Long id_categoria;
    private String nome;
    private String descricao;
    private StatusCategoria status;

    public enum StatusCategoria {
        ATIVA, INATIVA
    }

    public Categoria(String nome, String descricao) {
        this.nome = nome;
        this.descricao = descricao;
        this.status = StatusCategoria.ATIVA;
    }
}

