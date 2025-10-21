package com.project.sigma.dto;

import com.project.sigma.model.Promocao;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

// Este DTO será usado para Criar e Atualizar promoções
@Data
public class CreatePromocaoRequest {
    private String nome;
    private String descricao;
    private Promocao.TipoDesconto tipo_desconto;
    private BigDecimal valor_desconto;
    private LocalDate data_inicio;
    private LocalDate data_fim;

    // Lista de IDs dos produtos que farão parte da promoção
    private List<Long> produtoIds;
}
