package com.project.sigma.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CategoriaResponse {
    private Long idCategoria;
    private String nome;
    private String descricao;
    private Boolean ativo;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;
}

