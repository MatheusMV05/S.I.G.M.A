package com.project.sigma.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Promocao {
    private Long id_promocao;
    private String nome;
    private String descricao;
    private BigDecimal percentual_desconto;
    private LocalDate data_inicio;
    private LocalDate data_fim;
    private StatusPromocao status;

    // Not stored in DB, populated when needed
    private List<PromocaoProduto> produtos;

    public enum StatusPromocao {
        ATIVA, INATIVA, AGENDADA
    }

    public Promocao(String nome, String descricao, BigDecimal percentual_desconto, LocalDate data_inicio, LocalDate data_fim) {
        this.nome = nome;
        this.descricao = descricao;
        this.percentual_desconto = percentual_desconto;
        this.data_inicio = data_inicio;
        this.data_fim = data_fim;
        this.status = StatusPromocao.AGENDADA;
    }
}
