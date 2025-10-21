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
    private TipoDesconto tipo_desconto;
    private BigDecimal valor_desconto;
    private LocalDate data_inicio;
    private LocalDate data_fim;
    private StatusPromocao status;

    private List<Produto> produtos;

    public enum StatusPromocao {
        ATIVA, INATIVA, AGENDADA
    }

    public enum TipoDesconto {
        PERCENTUAL, FIXO
    }

    public Promocao(String nome, String descricao, TipoDesconto tipo_desconto, BigDecimal valor_desconto, LocalDate data_inicio, LocalDate data_fim) {
        this.nome = nome;
        this.descricao = descricao;
        this.tipo_desconto = tipo_desconto;
        this.valor_desconto = valor_desconto;
        this.data_inicio = data_inicio;
        this.data_fim = data_fim;
        this.status = StatusPromocao.AGENDADA;
    }
}
