package com.project.sigma.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendaItem {
    private Long id_venda_item;
    private Long id_venda;
    private Long id_produto;
    private Long id_promocao;
    private Integer quantidade;
    private BigDecimal preco_unitario_venda;
    private BigDecimal desconto_item;
    private BigDecimal subtotal;

    // Not stored in DB, populated when needed
    private Venda venda;
    private Produto produto;

    public VendaItem(Long id_venda, Long id_produto, Integer quantidade, BigDecimal preco_unitario_venda, BigDecimal desconto_item) {
        this.id_venda = id_venda;
        this.id_produto = id_produto;
        this.quantidade = quantidade;
        this.preco_unitario_venda = preco_unitario_venda;
        this.desconto_item = desconto_item != null ? desconto_item : BigDecimal.ZERO;
        this.subtotal = preco_unitario_venda.multiply(BigDecimal.valueOf(quantidade)).subtract(this.desconto_item);
    }
}
