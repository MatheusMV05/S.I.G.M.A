package com.project.sigma.dto;

import java.math.BigDecimal;

/**
 * DTO para consulta FULL OUTER JOIN de produtos e fornecedores
 */
public class ProdutoFornecedorDTO {
    private Integer idProduto;
    private String produtoNome;
    private BigDecimal precoVenda;
    private Integer estoque;
    private Integer idFornecedor;
    private String fornecedorNome;
    private String fornecedorTelefone;
    private String fornecedorStatus;
    private String statusVinculo;

    public ProdutoFornecedorDTO() {
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

    public Integer getEstoque() {
        return estoque;
    }

    public void setEstoque(Integer estoque) {
        this.estoque = estoque;
    }

    public Integer getIdFornecedor() {
        return idFornecedor;
    }

    public void setIdFornecedor(Integer idFornecedor) {
        this.idFornecedor = idFornecedor;
    }

    public String getFornecedorNome() {
        return fornecedorNome;
    }

    public void setFornecedorNome(String fornecedorNome) {
        this.fornecedorNome = fornecedorNome;
    }

    public String getFornecedorTelefone() {
        return fornecedorTelefone;
    }

    public void setFornecedorTelefone(String fornecedorTelefone) {
        this.fornecedorTelefone = fornecedorTelefone;
    }

    public String getFornecedorStatus() {
        return fornecedorStatus;
    }

    public void setFornecedorStatus(String fornecedorStatus) {
        this.fornecedorStatus = fornecedorStatus;
    }

    public String getStatusVinculo() {
        return statusVinculo;
    }

    public void setStatusVinculo(String statusVinculo) {
        this.statusVinculo = statusVinculo;
    }
}
