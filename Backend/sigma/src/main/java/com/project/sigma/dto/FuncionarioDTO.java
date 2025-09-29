package com.project.sigma.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FuncionarioDTO {

    // Pessoa fields
    private Long id_pessoa;
    private String nome;
    private String email;
    private String rua;
    private String numero;
    private String bairro;
    private String cidade;
    private String cep;

    // Funcionario fields
    private String matricula;
    private BigDecimal salario;
    private String cargo;
    private String setor;
    private Long id_supervisor;
    private String status;
    private LocalDate data_admissao;

    // Telefone field
    private String telefone;

    // Additional fields for display
    private String nomeSupervisor;
    private Boolean ativo;

    public FuncionarioDTO(String nome, String email, String matricula, BigDecimal salario, String cargo, String setor) {
        this.nome = nome;
        this.email = email;
        this.matricula = matricula;
        this.salario = salario;
        this.cargo = cargo;
        this.setor = setor;
        this.status = "ATIVO";
        this.ativo = true;
    }
}
