package com.project.sigma.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MovimentacaoEstoqueDTO {
    private Long id_movimentacao;
    private Long id_produto;
    private ProdutoSimplificadoDTO produto;
    private Long id_usuario;
    private UsuarioSimplificadoDTO usuario;
    private LocalDateTime data_movimentacao;
    private String tipo; // ENTRADA, SAIDA_VENDA, AJUSTE_POSITIVO, AJUSTE_NEGATIVO, DEVOLUCAO
    private Integer quantidade;
    private Integer estoque_anterior;
    private Integer estoque_atual;
    private String observacao;
}