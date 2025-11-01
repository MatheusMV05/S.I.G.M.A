package com.project.sigma.dto;

import java.math.BigDecimal;

/**
 * DTO para consulta de produtos que nunca foram vendidos (ANTI JOIN)
 */
public class ProdutoNuncaVendidoDTO {
    private Integer idProduto;
    private String produtoNome;
    private BigDecimal precoVenda;
    private Integer quantidadeEstoque;
    private String categoriaNome;
    private BigDecimal valorEstoqueParado;

    public ProdutoNuncaVendidoDTO() {
    }

    public ProdutoNuncaVendidoDTO(Integer idProduto, String produtoNome, BigDecimal precoVenda, 
                                  Integer quantidadeEstoque, String categoriaNome, BigDecimal valorEstoqueParado) {
        this.idProduto = idProduto;
        this.produtoNome = produtoNome;
        this.precoVenda = precoVenda;
        this.quantidadeEstoque = quantidadeEstoque;
        this.categoriaNome = categoriaNome;
        this.valorEstoqueParado = valorEstoqueParado;
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

    public BigDecimal getPrecoVenda() {
        return precoVenda;
    }

    public void setPrecoVenda(BigDecimal precoVenda) {
        this.precoVenda = precoVenda;
    }

    public Integer getQuantidadeEstoque() {
        return quantidadeEstoque;
    }

    public void setQuantidadeEstoque(Integer quantidadeEstoque) {
        this.quantidadeEstoque = quantidadeEstoque;
    }

    public String getCategoriaNome() {
        return categoriaNome;
    }

    public void setCategoriaNome(String categoriaNome) {
        this.categoriaNome = categoriaNome;
    }

    public BigDecimal getValorEstoqueParado() {
        return valorEstoqueParado;
    }

    public void setValorEstoqueParado(BigDecimal valorEstoqueParado) {
        this.valorEstoqueParado = valorEstoqueParado;
    }
}
