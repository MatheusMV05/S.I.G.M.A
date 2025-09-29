package com.project.sigma.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProdutoResponseDTO {

    // Campos mapeados para o frontend (nomes em snake_case)
    private Integer id_produto;
    private String nome;
    private String marca;
    private String descricao;
    private BigDecimal preco_custo;
    private BigDecimal preco_venda;
    private Integer estoque;
    private Integer estoque_minimo;
    private Integer estoque_maximo;
    private String status;
    private String codigo_barras;
    private String unidade;
    private Double peso;
    private LocalDate data_validade;
    private String data_criacao;  // Formato ISO string
    private String data_atualizacao; // Formato ISO string

    // Categoria aninhada
    private CategoriaSimpleDTO category;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoriaSimpleDTO {
        private Integer id;
        private String nome;
    }
}
