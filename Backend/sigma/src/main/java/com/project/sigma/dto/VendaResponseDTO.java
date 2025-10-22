package com.project.sigma.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO para retornar dados de uma venda ao frontend
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendaResponseDTO {
    private Long id_venda;
    private Long id_cliente;
    private String nome_cliente; // Nome do cliente se disponível
    private Long id_funcionario;
    private String nome_funcionario; // Nome do funcionário
    private LocalDateTime data_venda;
    private BigDecimal valor_total;
    private BigDecimal desconto;
    private BigDecimal valor_final;
    private String metodo_pagamento;
    private String status;
    private String observacoes;
    private List<VendaItemResponseDTO> itens;

    /**
     * DTO para os itens da venda na resposta
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VendaItemResponseDTO {
        private Long id_venda_item;
        private Long id_produto;
        private String nome_produto;
        private Integer quantidade;
        private BigDecimal preco_unitario_venda;
        private BigDecimal desconto_item;
        private BigDecimal subtotal;
    }
}