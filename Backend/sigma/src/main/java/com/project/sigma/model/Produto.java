package com.project.sigma.model;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class Produto {

    private Long id_produto;
    private String nome;
    private String marca;
    private String descricao;
    private Long id_categoria;
    private Long id_fornecedor;
    private BigDecimal preco_custo;
    private BigDecimal preco_venda;
    private int estoque;
    private int estoque_minimo;
    private int estoque_maximo;
    private String localizacao_prateleira;
    private LocalDate data_validade;
    private String status; // 'ATIVO' ou 'INATIVO'

    // Relacionamentos (opcional, mas bom para o futuro)
    private Categoria category;
    private Fornecedor fornecedor;
}