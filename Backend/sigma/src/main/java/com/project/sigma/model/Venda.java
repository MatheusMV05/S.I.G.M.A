package com.project.sigma.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Venda {
    private Long id_venda;
    private Long id_cliente;
    private Long id_funcionario;
    private LocalDateTime data_venda;
    private BigDecimal valor_total;
    private BigDecimal desconto;
    private BigDecimal valor_final;
    private String metodo_pagamento;
    private StatusVenda status;
    private String observacoes;

    // Not stored in DB, populated when needed
    private Cliente cliente;
    private Funcionario funcionario;
    private List<VendaItem> itens;

    public enum StatusVenda {
        CONCLUIDA, CANCELADA
    }

    public Venda(Long id_cliente, Long id_funcionario, BigDecimal valor_total, BigDecimal desconto, String metodo_pagamento) {
        this.id_cliente = id_cliente;
        this.id_funcionario = id_funcionario;
        this.data_venda = LocalDateTime.now();
        this.valor_total = valor_total;
        this.desconto = desconto != null ? desconto : BigDecimal.ZERO;
        this.valor_final = valor_total.subtract(this.desconto);
        this.metodo_pagamento = metodo_pagamento;
        this.status = StatusVenda.CONCLUIDA;
    }
}
