package com.project.sigma.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovimentacaoEstoque {
    private Long id_movimentacao;
    private Long id_produto;
    private Long id_usuario;
    private LocalDateTime data_movimentacao;
    private TipoMovimentacao tipo;
    private Integer quantidade;
    private Integer estoque_anterior;
    private Integer estoque_atual;
    private String observacao;

    // Not stored in DB, populated when needed
    private Produto produto;
    private Usuario usuario;

    public enum TipoMovimentacao {
        ENTRADA, SAIDA_VENDA, AJUSTE_POSITIVO, AJUSTE_NEGATIVO, DEVOLUCAO
    }

    public MovimentacaoEstoque(Long id_produto, Long id_usuario, TipoMovimentacao tipo,
                              Integer quantidade, Integer estoque_anterior, Integer estoque_atual) {
        this.id_produto = id_produto;
        this.id_usuario = id_usuario;
        this.data_movimentacao = LocalDateTime.now();
        this.tipo = tipo;
        this.quantidade = quantidade;
        this.estoque_anterior = estoque_anterior;
        this.estoque_atual = estoque_atual;
    }
}
