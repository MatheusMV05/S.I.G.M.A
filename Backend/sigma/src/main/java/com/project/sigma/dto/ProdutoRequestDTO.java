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
    private Integer idCategoria;

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

    public void debugPrint() {
        System.out.println("=== DEBUG ProdutoRequestDTO ===");
        System.out.println("nome: " + nome);
        System.out.println("marca: " + marca);
        System.out.println("valor_unitario: " + valorUnitario);
        System.out.println("quant_em_estoque: " + quantEmEstoque);
        System.out.println("id_categoria: " + idCategoria);
        System.out.println("descricao: " + descricao);
        System.out.println("estoque_minimo: " + estoqueMinimo);
        System.out.println("estoque_maximo: " + estoqueMaximo);
        System.out.println("preco_custo: " + precoCusto);
        System.out.println("status: " + status);
        System.out.println("codigo_barras: " + codigoBarras);
        System.out.println("unidade: " + unidade);
        System.out.println("peso: " + peso);
        System.out.println("===============================");
    }
}
