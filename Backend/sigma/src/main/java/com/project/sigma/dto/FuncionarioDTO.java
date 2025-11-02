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
    
    // Novos campos de RH
    private String turno;
    private String tipo_contrato;
    private Integer carga_horaria_semanal;
    private LocalDate data_desligamento;
    private String motivo_desligamento;
    private String beneficios;
    private String observacoes;
    private String foto_url;
    private LocalDate data_ultima_promocao;
    private BigDecimal comissao_percentual;
    private BigDecimal meta_mensal;

    // Telefone fields
    private String telefone;  // Primeiro telefone (para compatibilidade)
    private String[] telefones;  // Todos os telefones
    
    // CPF field
    private String cpf;

    // Additional fields for display
    private String nomeSupervisor;
    private Boolean ativo;
    
    // Campos calculados
    private Integer meses_empresa;
    private Integer anos_empresa;
    private Integer vendas_mes_atual;
    private BigDecimal valor_vendas_mes_atual;
    private String usuario_sistema;
    private String perfil_sistema;

    public FuncionarioDTO(String nome, String email, String matricula, BigDecimal salario, String cargo, String setor) {
        this.nome = nome;
        this.email = email;
        this.matricula = matricula;
        this.salario = salario;
        this.cargo = cargo;
        this.setor = setor;
        this.status = "ATIVO";
        this.ativo = true;
        this.turno = "INTEGRAL";
        this.tipo_contrato = "CLT";
        this.carga_horaria_semanal = 40;
        this.comissao_percentual = BigDecimal.ZERO;
        this.meta_mensal = BigDecimal.ZERO;
    }
}
