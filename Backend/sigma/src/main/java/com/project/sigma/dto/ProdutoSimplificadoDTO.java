package com.project.sigma.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProdutoSimplificadoDTO {
    private Long id_produto;
    private String nome;
    private String codigo_barras;
}