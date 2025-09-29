package com.project.sigma.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Categoria {

    @JsonProperty("id_categoria")
    private Integer id_categoria;

    private String nome;
    private String descricao;
    private Boolean ativo = true;

    @JsonProperty("data_criacao")
    private LocalDateTime data_criacao;

    @JsonProperty("data_atualizacao")
    private LocalDateTime data_atualizacao;

}