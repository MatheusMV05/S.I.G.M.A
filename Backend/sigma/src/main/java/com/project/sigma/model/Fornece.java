package com.project.sigma.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Fornece {
    private Long id_fornecedor;
    private Long id_produto;
    private Integer quantidade_recebida;
    private BigDecimal valor_de_compra;
    private LocalDateTime data_da_compra;
    private String numero_nota_fiscal;

    // Not stored in DB, populated when needed
    private Fornecedor fornecedor;
    private Produto produto;

    public Fornece(Long id_fornecedor, Long id_produto, Integer quantidade_recebida, BigDecimal valor_de_compra) {
        this.id_fornecedor = id_fornecedor;
        this.id_produto = id_produto;
        this.quantidade_recebida = quantidade_recebida;
        this.valor_de_compra = valor_de_compra;
        this.data_da_compra = LocalDateTime.now();
    }
}
