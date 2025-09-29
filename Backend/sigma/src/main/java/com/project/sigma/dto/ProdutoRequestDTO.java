package com.project.sigma.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProdutoRequestDTO {

    private String nome;
    private String marca;

    @JsonProperty("quant_em_estoque")
    private Integer quantEmEstoque;

    @JsonProperty("valor_unitario")
    private BigDecimal valorUnitario;

    @JsonProperty("data_validade")
    private LocalDate dataValidade;

    @JsonProperty("id_categoria")
    private Long idCategoria;

    private String descricao;

    @JsonProperty("estoque_minimo")
    private Integer estoqueMinimo;

    @JsonProperty("estoque_maximo")
    private Integer estoqueMaximo;

    @JsonProperty("preco_custo")
    private BigDecimal precoCusto;

    private String status;

    @JsonProperty("codigo_barras")
    private String codigoBarras;

    private String unidade;
    private Double peso;

    /**
     * Debug method to print all field values for testing purposes
     */
    public void debugPrint() {
        System.out.println("=== ProdutoRequestDTO Debug Info ===");
        System.out.println("Nome: " + nome);
        System.out.println("Marca: " + marca);
        System.out.println("Quantidade em Estoque: " + quantEmEstoque);
        System.out.println("Valor Unitário: " + valorUnitario);
        System.out.println("Data Validade: " + dataValidade);
        System.out.println("ID Categoria: " + idCategoria);
        System.out.println("Descrição: " + descricao);
        System.out.println("Estoque Mínimo: " + estoqueMinimo);
        System.out.println("Estoque Máximo: " + estoqueMaximo);
        System.out.println("Preço Custo: " + precoCusto);
        System.out.println("Status: " + status);
        System.out.println("Código de Barras: " + codigoBarras);
        System.out.println("Unidade: " + unidade);
        System.out.println("Peso: " + peso);
        System.out.println("=====================================");
    }
}

