package com.project.sigma.dto;

import java.math.BigDecimal;

/**
 * DTO para consulta FULL OUTER JOIN de produtos e fornecedores
 */
public class ProdutoFornecedorDTO {
    private Integer idProduto;
    private String produtoNome;
    private BigDecimal precoVenda;
    private Integer idFornecedor;
    private String fornecedorNome;
    private String fornecedorTelefone;
    private String statusVinculo;

    public ProdutoFornecedorDTO() {
    }

    public ProdutoFornecedorDTO(Integer idProduto, String produtoNome, BigDecimal precoVenda,
                                Integer idFornecedor, String fornecedorNome, String fornecedorTelefone,
                                String statusVinculo) {
        this.idProduto = idProduto;
        this.produtoNome = produtoNome;
        this.precoVenda = precoVenda;
        this.idFornecedor = idFornecedor;
        this.fornecedorNome = fornecedorNome;
        this.fornecedorTelefone = fornecedorTelefone;
        this.statusVinculo = statusVinculo;
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

    public String getStatusVinculo() {
        return statusVinculo;
    }

    public void setStatusVinculo(String statusVinculo) {
        this.statusVinculo = statusVinculo;
    }
}
