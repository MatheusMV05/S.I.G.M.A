package com.project.sigma.dto;

import java.math.BigDecimal;

/**
 * DTO para a VIEW vw_estoque_completo
 */
public class EstoqueCompletoDTO {
    private Integer idProduto;
    private String produtoNome;
    private String produtoDescricao;
    private BigDecimal precoVenda;
    private BigDecimal precoCusto;
    private Integer quantidadeEstoque;
    private Integer estoqueMinimo;
    private Integer idCategoria;
    private String categoriaNome;
    private String categoriaDescricao;
    private Integer idFornecedor;
    private String fornecedorNome;
    private String fornecedorTelefone;
    private String fornecedorEmail;
    private String fornecedorCnpj;
    private BigDecimal valorTotalEstoque;
    private BigDecimal custoTotalEstoque;
    private BigDecimal lucroPotencial;
    private String statusEstoque;
    private BigDecimal margemLucroPercentual;

    public EstoqueCompletoDTO() {
    }

    // Constructor
    public EstoqueCompletoDTO(Integer idProduto, String produtoNome, String produtoDescricao,
                             BigDecimal precoVenda, BigDecimal precoCusto, Integer quantidadeEstoque,
                             Integer estoqueMinimo, Integer idCategoria, String categoriaNome,
                             String categoriaDescricao, Integer idFornecedor, String fornecedorNome,
                             String fornecedorTelefone, String fornecedorEmail, String fornecedorCnpj,
                             BigDecimal valorTotalEstoque, BigDecimal custoTotalEstoque,
                             BigDecimal lucroPotencial, String statusEstoque, BigDecimal margemLucroPercentual) {
        this.idProduto = idProduto;
        this.produtoNome = produtoNome;
        this.produtoDescricao = produtoDescricao;
        this.precoVenda = precoVenda;
        this.precoCusto = precoCusto;
        this.quantidadeEstoque = quantidadeEstoque;
        this.estoqueMinimo = estoqueMinimo;
        this.idCategoria = idCategoria;
        this.categoriaNome = categoriaNome;
        this.categoriaDescricao = categoriaDescricao;
        this.idFornecedor = idFornecedor;
        this.fornecedorNome = fornecedorNome;
        this.fornecedorTelefone = fornecedorTelefone;
        this.fornecedorEmail = fornecedorEmail;
        this.fornecedorCnpj = fornecedorCnpj;
        this.valorTotalEstoque = valorTotalEstoque;
        this.custoTotalEstoque = custoTotalEstoque;
        this.lucroPotencial = lucroPotencial;
        this.statusEstoque = statusEstoque;
        this.margemLucroPercentual = margemLucroPercentual;
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

    public String getProdutoDescricao() {
        return produtoDescricao;
    }

    public void setProdutoDescricao(String produtoDescricao) {
        this.produtoDescricao = produtoDescricao;
    }

    public BigDecimal getPrecoVenda() {
        return precoVenda;
    }

    public void setPrecoVenda(BigDecimal precoVenda) {
        this.precoVenda = precoVenda;
    }

    public BigDecimal getPrecoCusto() {
        return precoCusto;
    }

    public void setPrecoCusto(BigDecimal precoCusto) {
        this.precoCusto = precoCusto;
    }

    public Integer getQuantidadeEstoque() {
        return quantidadeEstoque;
    }

    public void setQuantidadeEstoque(Integer quantidadeEstoque) {
        this.quantidadeEstoque = quantidadeEstoque;
    }

    public Integer getEstoqueMinimo() {
        return estoqueMinimo;
    }

    public void setEstoqueMinimo(Integer estoqueMinimo) {
        this.estoqueMinimo = estoqueMinimo;
    }

    public Integer getIdCategoria() {
        return idCategoria;
    }

    public void setIdCategoria(Integer idCategoria) {
        this.idCategoria = idCategoria;
    }

    public String getCategoriaNome() {
        return categoriaNome;
    }

    public void setCategoriaNome(String categoriaNome) {
        this.categoriaNome = categoriaNome;
    }

    public String getCategoriaDescricao() {
        return categoriaDescricao;
    }

    public void setCategoriaDescricao(String categoriaDescricao) {
        this.categoriaDescricao = categoriaDescricao;
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

    public String getFornecedorEmail() {
        return fornecedorEmail;
    }

    public void setFornecedorEmail(String fornecedorEmail) {
        this.fornecedorEmail = fornecedorEmail;
    }

    public String getFornecedorCnpj() {
        return fornecedorCnpj;
    }

    public void setFornecedorCnpj(String fornecedorCnpj) {
        this.fornecedorCnpj = fornecedorCnpj;
    }

    public BigDecimal getValorTotalEstoque() {
        return valorTotalEstoque;
    }

    public void setValorTotalEstoque(BigDecimal valorTotalEstoque) {
        this.valorTotalEstoque = valorTotalEstoque;
    }

    public BigDecimal getCustoTotalEstoque() {
        return custoTotalEstoque;
    }

    public void setCustoTotalEstoque(BigDecimal custoTotalEstoque) {
        this.custoTotalEstoque = custoTotalEstoque;
    }

    public BigDecimal getLucroPotencial() {
        return lucroPotencial;
    }

    public void setLucroPotencial(BigDecimal lucroPotencial) {
        this.lucroPotencial = lucroPotencial;
    }

    public String getStatusEstoque() {
        return statusEstoque;
    }

    public void setStatusEstoque(String statusEstoque) {
        this.statusEstoque = statusEstoque;
    }

    public BigDecimal getMargemLucroPercentual() {
        return margemLucroPercentual;
    }

    public void setMargemLucroPercentual(BigDecimal margemLucroPercentual) {
        this.margemLucroPercentual = margemLucroPercentual;
    }
}
