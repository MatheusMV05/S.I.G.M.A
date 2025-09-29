package com.project.sigma.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Categoria {

    private Long id_categoria;
    private String nome;
    private String descricao;
    private boolean ativo;
    private LocalDateTime data_criacao;
    private LocalDateTime data_atualizacao;

}