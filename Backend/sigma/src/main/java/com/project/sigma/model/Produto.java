package com.project.sigma.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Produto {

    // Campos existentes (manter)
    private Integer idProduto;
    private String nome;
    private String marca;
    private Integer quantEmEstoque;
    private BigDecimal valorUnitario; // Este é o preço de venda
    private LocalDate dataValidade;
    private Integer idCategoria;
    private String descricao;
    private Integer estoqueMinimo;
    private Integer estoqueMaximo;

    // NOVOS CAMPOS OBRIGATÓRIOS
    private BigDecimal precoCusto;           // Preço de custo do produto
    private String status;                   // "ATIVO" ou "INATIVO"
    private String codigoBarras;            // Código de barras do produto
    private String unidade;                 // Unidade de medida (kg, un, lt, etc)
    private Double peso;                    // Peso do produto em kg
    private LocalDateTime dataCriacao;     // Data de criação automática
    private LocalDateTime dataAtualizacao; // Data de última atualização
}