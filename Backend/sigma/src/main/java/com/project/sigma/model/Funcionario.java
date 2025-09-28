package com.project.sigma.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Funcionario {

    private Long id_pessoa;
    private String matricula;
    private BigDecimal salario;
    private String cargo;
    private String setor;
    private Long id_supervisor;

}
