package com.project.sigma.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioSimplificadoDTO {
    private Long id_pessoa;
    private String nome;
}