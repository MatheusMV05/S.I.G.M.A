package com.project.sigma.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO para receber dados de uma nova venda do frontend (POS)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendaRequestDTO {
    private Long id_funcionario;
    private Long id_cliente; // Opcional
    private List<VendaItemDTO> itens;
    private String metodo_pagamento;
    private BigDecimal desconto;
    private String observacoes;

    /**
     * DTO para os itens da venda
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VendaItemDTO {
        private Long id_produto;
        private Integer quantidade;
        private BigDecimal preco_unitario_venda;
        private BigDecimal desconto_item;
        private Long id_promocao;
    }
}