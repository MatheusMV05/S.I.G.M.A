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
    
    // Novos campos de RH
    private TurnoTrabalho turno;
    private TipoContrato tipo_contrato;
    private Integer carga_horaria_semanal;
    private LocalDate data_desligamento;
    private String motivo_desligamento;
    private String beneficios;
    private String observacoes;
    private String foto_url;
    private LocalDate data_ultima_promocao;
    private BigDecimal comissao_percentual;
    private BigDecimal meta_mensal;

    // Not stored in DB, populated when needed
    private Pessoa pessoa;
    private Funcionario supervisor;

    public enum StatusFuncionario {
        ATIVO, INATIVO
    }
    
    public enum TurnoTrabalho {
        MANHA, TARDE, NOITE, INTEGRAL
    }
    
    public enum TipoContrato {
        CLT, PJ, ESTAGIO, TEMPORARIO, AUTONOMO
    }

    public Funcionario(Long id_pessoa, String matricula, BigDecimal salario, String cargo, String setor, LocalDate data_admissao) {
        this.id_pessoa = id_pessoa;
        this.matricula = matricula;
        this.salario = salario;
        this.cargo = cargo;
        this.setor = setor;
        this.data_admissao = data_admissao;
        this.status = StatusFuncionario.ATIVO;
        this.turno = TurnoTrabalho.INTEGRAL;
        this.tipo_contrato = TipoContrato.CLT;
        this.carga_horaria_semanal = 40;
        this.comissao_percentual = BigDecimal.ZERO;
        this.meta_mensal = BigDecimal.ZERO;
    }
}
