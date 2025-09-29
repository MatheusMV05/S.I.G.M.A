package com.project.sigma.dto;

import lombok.Data;

@Data
public class UpdateCategoriaRequest {

    private String nome;
    private String descricao;
    private Boolean ativo;
}
