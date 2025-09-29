package com.project.sigma.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

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
    private StatusFuncionario status;
    private LocalDate data_admissao;

    // Not stored in DB, populated when needed
    private Pessoa pessoa;
    private Funcionario supervisor;

    public enum StatusFuncionario {
        ATIVO, INATIVO
    }

    public Funcionario(Long id_pessoa, String matricula, BigDecimal salario, String cargo, String setor, LocalDate data_admissao) {
        this.id_pessoa = id_pessoa;
        this.matricula = matricula;
        this.salario = salario;
        this.cargo = cargo;
        this.setor = setor;
        this.data_admissao = data_admissao;
        this.status = StatusFuncionario.ATIVO;
    }
}
