package com.project.sigma.dto;

import lombok.Data;

@Data
public class CreateMovimentacaoRequest {
    private Long id_produto;
    private String tipo; // ENTRADA, SAIDA_VENDA, AJUSTE_POSITIVO, AJUSTE_NEGATIVO, DEVOLUCAO
    private Integer quantidade;
    private String observacao;
}