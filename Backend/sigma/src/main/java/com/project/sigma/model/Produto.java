package com.project.sigma.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Produto {
    private Long id_produto;
    private String nome;
    private String marca;
    private String descricao;
    private Long id_categoria;
    private Long id_fornecedor;
    private BigDecimal preco_custo;
    private BigDecimal preco_venda;
    private Integer estoque;
    private Integer estoque_minimo;
    private Integer estoque_maximo;
    private String localizacao_prateleira;
    private LocalDate data_validade;
    private String codigo_barras;
    private StatusProduto status;

    // Not stored in DB, populated when needed
    private Categoria categoria;
    private Fornecedor fornecedor;

    public enum StatusProduto {
        ATIVO, INATIVO
    }

    public Produto(String nome, String marca, String descricao, Long id_categoria, Long id_fornecedor,
                   BigDecimal preco_custo, BigDecimal preco_venda, Integer estoque, Integer estoque_minimo) {
        this.nome = nome;
        this.marca = marca;
        this.descricao = descricao;
        this.id_categoria = id_categoria;
        this.id_fornecedor = id_fornecedor;
        this.preco_custo = preco_custo;
        this.preco_venda = preco_venda;
        this.estoque = estoque;
        this.estoque_minimo = estoque_minimo;
        this.estoque_maximo = 1000;
        this.status = StatusProduto.ATIVO;
    }
}

