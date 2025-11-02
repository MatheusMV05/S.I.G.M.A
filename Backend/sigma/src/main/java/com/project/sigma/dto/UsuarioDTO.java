package com.project.sigma.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDTO {
    // Dados do Usuário
    private Long id;
    private String username;
    private String password; // Apenas para criação/atualização
    private String role;
    private String status;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime ultimoAcesso;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dataCriacao;
    
    // Dados do Funcionário associado
    private String nome;
    private String email;
    private String telefone;
    private String cpf;
    private String matricula;
    private BigDecimal salario;
    private String cargo;
    private String setor;
    private String departamento; // Alias para setor
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dataAdmissao;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dataContratacao; // Alias para dataAdmissao
    
    private String turno;
    private String tipoContrato;
    private Integer cargaHorariaSemanal;
    private BigDecimal comissaoPercentual;
    private BigDecimal metaMensal;
    private Long idSupervisor;
    private String nomeSupervisor;
    
    // Construtor simplificado para listagem
    public UsuarioDTO(Long id, String username, String role, String status, String nome, 
                      String email, String cargo, String setor, BigDecimal salario, 
                      LocalDateTime ultimoAcesso, LocalDate dataAdmissao) {
        this.id = id;
        this.username = username;
        this.role = role;
        this.status = status;
        this.nome = nome;
        this.email = email;
        this.cargo = cargo;
        this.setor = setor;
        this.departamento = setor;
        this.salario = salario;
        this.ultimoAcesso = ultimoAcesso;
        this.dataAdmissao = dataAdmissao;
        this.dataContratacao = dataAdmissao;
    }
}
