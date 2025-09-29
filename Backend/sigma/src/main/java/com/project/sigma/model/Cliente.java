package com.project.sigma.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cliente {
    private Long id_pessoa;
    private TipoPessoa tipo_pessoa;
    private Boolean ativo;
    private Integer ranking;
    private BigDecimal total_gasto;
    private LocalDate data_ultima_compra;

    // Not stored in DB, populated when needed
    private Pessoa pessoa;

    public enum TipoPessoa {
        FISICA, JURIDICA
    }

    public Cliente(Long id_pessoa, TipoPessoa tipo_pessoa) {
        this.id_pessoa = id_pessoa;
        this.tipo_pessoa = tipo_pessoa;
        this.ativo = true;
        this.ranking = 1;
        this.total_gasto = BigDecimal.ZERO;
    }
}
