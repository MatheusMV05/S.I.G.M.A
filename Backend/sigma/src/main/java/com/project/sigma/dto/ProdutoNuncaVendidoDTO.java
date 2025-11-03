package com.project.sigma.dto;

import java.math.BigDecimal;

/**
 * DTO para consulta de produtos que nunca foram vendidos (ANTI JOIN)
 */
public class ProdutoNuncaVendidoDTO {
    private Integer idProduto;
    private String produtoNome;
    private String marca;
    private BigDecimal precoVenda;
    private Integer estoque;
    private String categoriaNome;
    private String fornecedorNome;
    private BigDecimal valorInvestido;
    private BigDecimal valorPotencialVenda;
    private Integer diasSemVenda;

    public ProdutoNuncaVendidoDTO() {
    }

    // Getters and Setters
    public Integer getIdProduto() {
        return idProduto;
    }

    public void setIdProduto(Integer idProduto) {
        this.idProduto = idProduto;
    }

    public String getProdutoNome() {
        return produtoNome;
    }

    public void setProdutoNome(String produtoNome) {
        this.produtoNome = produtoNome;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public BigDecimal getPrecoVenda() {
        return precoVenda;
    }

    public void setPrecoVenda(BigDecimal precoVenda) {
        this.precoVenda = precoVenda;
    }

    public Integer getEstoque() {
        return estoque;
    }

    public void setEstoque(Integer estoque) {
        this.estoque = estoque;
    }

    public String getCategoriaNome() {
        return categoriaNome;
    }

    public void setCategoriaNome(String categoriaNome) {
        this.categoriaNome = categoriaNome;
    }

    public String getFornecedorNome() {
        return fornecedorNome;
    }

    public void setFornecedorNome(String fornecedorNome) {
        this.fornecedorNome = fornecedorNome;
    }

    public BigDecimal getValorInvestido() {
        return valorInvestido;
    }

    public void setValorInvestido(BigDecimal valorInvestido) {
        this.valorInvestido = valorInvestido;
    }

    public BigDecimal getValorPotencialVenda() {
        return valorPotencialVenda;
    }

    public void setValorPotencialVenda(BigDecimal valorPotencialVenda) {
        this.valorPotencialVenda = valorPotencialVenda;
    }

    public Integer getDiasSemVenda() {
        return diasSemVenda;
    }

    public void setDiasSemVenda(Integer diasSemVenda) {
        this.diasSemVenda = diasSemVenda;
    }
}
