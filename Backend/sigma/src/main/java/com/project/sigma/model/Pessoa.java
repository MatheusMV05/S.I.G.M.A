package com.project.sigma.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pessoa {

    private Long id_pessoa;
    private String nome;
    private String rua;
    private String numero;
    private String bairro;
    private String cidade;

}
