package com.project.sigma.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ClienteDTO {

    // Pessoa fields
    private String nome;
    private String email;
    private String rua;
    private String numero;
    private String bairro;
    private String cidade;
    private String cep;
    private String telefone;
    private Long id;

    // Cliente fields
    private String tipoCliente; // "PF" ou "PJ"
    private Boolean ativo;
    private Integer ranking;
    private BigDecimal totalGasto;

    // ClienteFisico fields (for PF)
    private String cpf;
    private LocalDate dataNascimento;

    // ClienteJuridico fields (for PJ)
    private String cnpj;
    private String razaoSocial;
    private String inscricaoEstadual;
}
