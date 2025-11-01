package com.project.sigma.dto;

import java.math.BigDecimal;

/**
 * DTO para resultado do procedimento relatorio_estoque_baixo
 */
public class EstoqueBaixoDTO {
    private Integer idProduto;
    private String nomeProduto;
    private Integer quantidadeAtual;
    private Integer estoqueMinimo;
    private Integer deficit;
    private BigDecimal precoCusto;
    private BigDecimal valorReposicao;
    private String categoria;
    private String fornecedor;
    private String telefoneFornecedor;
    private String statusCriticidade;
    private String acaoRecomendada;

    public EstoqueBaixoDTO() {
    }

    public EstoqueBaixoDTO(Integer idProduto, String nomeProduto, Integer quantidadeAtual,
                          Integer estoqueMinimo, Integer deficit, BigDecimal precoCusto,
                          BigDecimal valorReposicao, String categoria, String fornecedor,
                          String telefoneFornecedor, String statusCriticidade, String acaoRecomendada) {
        this.idProduto = idProduto;
        this.nomeProduto = nomeProduto;
        this.quantidadeAtual = quantidadeAtual;
        this.estoqueMinimo = estoqueMinimo;
        this.deficit = deficit;
        this.precoCusto = precoCusto;
        this.valorReposicao = valorReposicao;
        this.categoria = categoria;
        this.fornecedor = fornecedor;
        this.telefoneFornecedor = telefoneFornecedor;
        this.statusCriticidade = statusCriticidade;
        this.acaoRecomendada = acaoRecomendada;
    }

    // Getters and Setters
    public Integer getIdProduto() {
        return idProduto;
    }

    public void setIdProduto(Integer idProduto) {
        this.idProduto = idProduto;
    }

    public String getNomeProduto() {
        return nomeProduto;
    }

    public void setNomeProduto(String nomeProduto) {
        this.nomeProduto = nomeProduto;
    }

    public Integer getQuantidadeAtual() {
        return quantidadeAtual;
    }

    public void setQuantidadeAtual(Integer quantidadeAtual) {
        this.quantidadeAtual = quantidadeAtual;
    }

    public Integer getEstoqueMinimo() {
        return estoqueMinimo;
    }

    public void setEstoqueMinimo(Integer estoqueMinimo) {
        this.estoqueMinimo = estoqueMinimo;
    }

    public Integer getDeficit() {
        return deficit;
    }

    public void setDeficit(Integer deficit) {
        this.deficit = deficit;
    }

    public BigDecimal getPrecoCusto() {
        return precoCusto;
    }

    public void setPrecoCusto(BigDecimal precoCusto) {
        this.precoCusto = precoCusto;
    }

    public BigDecimal getValorReposicao() {
        return valorReposicao;
    }

    public void setValorReposicao(BigDecimal valorReposicao) {
        this.valorReposicao = valorReposicao;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getFornecedor() {
        return fornecedor;
    }

    public void setFornecedor(String fornecedor) {
        this.fornecedor = fornecedor;
    }

    public String getTelefoneFornecedor() {
        return telefoneFornecedor;
    }

    public void setTelefoneFornecedor(String telefoneFornecedor) {
        this.telefoneFornecedor = telefoneFornecedor;
    }

    public String getStatusCriticidade() {
        return statusCriticidade;
    }

    public void setStatusCriticidade(String statusCriticidade) {
        this.statusCriticidade = statusCriticidade;
    }

    public String getAcaoRecomendada() {
        return acaoRecomendada;
    }

    public void setAcaoRecomendada(String acaoRecomendada) {
        this.acaoRecomendada = acaoRecomendada;
    }
}
