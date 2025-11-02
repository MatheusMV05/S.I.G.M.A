package com.project.sigma.dto;

/**
 * DTO para produtos com baixa rotatividade
 * Identifica produtos que vendem pouco em relação ao estoque disponível
 */
public class ProdutoBaixaRotatividadeDTO {
    private Long idProduto;
    private String nomeProduto;
    private String categoriaNome;
    private Integer estoqueAtual;
    private Integer quantidadeVendidaUltimos30Dias;
    private Double taxaRotatividade; // vendas / estoque
    private Double diasParaZerarEstoque; // estimativa
    private Double valorEstoqueParado;

    // Constructors
    public ProdutoBaixaRotatividadeDTO() {}

    public ProdutoBaixaRotatividadeDTO(Long idProduto, String nomeProduto, String categoriaNome,
                                       Integer estoqueAtual, Integer quantidadeVendidaUltimos30Dias,
                                       Double taxaRotatividade, Double diasParaZerarEstoque,
                                       Double valorEstoqueParado) {
        this.idProduto = idProduto;
        this.nomeProduto = nomeProduto;
        this.categoriaNome = categoriaNome;
        this.estoqueAtual = estoqueAtual;
        this.quantidadeVendidaUltimos30Dias = quantidadeVendidaUltimos30Dias;
        this.taxaRotatividade = taxaRotatividade;
        this.diasParaZerarEstoque = diasParaZerarEstoque;
        this.valorEstoqueParado = valorEstoqueParado;
    }

    // Getters and Setters
    public Long getIdProduto() {
        return idProduto;
    }

    public void setIdProduto(Long idProduto) {
        this.idProduto = idProduto;
    }

    public String getNomeProduto() {
        return nomeProduto;
    }

    public void setNomeProduto(String nomeProduto) {
        this.nomeProduto = nomeProduto;
    }

    public String getCategoriaNome() {
        return categoriaNome;
    }

    public void setCategoriaNome(String categoriaNome) {
        this.categoriaNome = categoriaNome;
    }

    public Integer getEstoqueAtual() {
        return estoqueAtual;
    }

    public void setEstoqueAtual(Integer estoqueAtual) {
        this.estoqueAtual = estoqueAtual;
    }

    public Integer getQuantidadeVendidaUltimos30Dias() {
        return quantidadeVendidaUltimos30Dias;
    }

    public void setQuantidadeVendidaUltimos30Dias(Integer quantidadeVendidaUltimos30Dias) {
        this.quantidadeVendidaUltimos30Dias = quantidadeVendidaUltimos30Dias;
    }

    public Double getTaxaRotatividade() {
        return taxaRotatividade;
    }

    public void setTaxaRotatividade(Double taxaRotatividade) {
        this.taxaRotatividade = taxaRotatividade;
    }

    public Double getDiasParaZerarEstoque() {
        return diasParaZerarEstoque;
    }

    public void setDiasParaZerarEstoque(Double diasParaZerarEstoque) {
        this.diasParaZerarEstoque = diasParaZerarEstoque;
    }

    public Double getValorEstoqueParado() {
        return valorEstoqueParado;
    }

    public void setValorEstoqueParado(Double valorEstoqueParado) {
        this.valorEstoqueParado = valorEstoqueParado;
    }
}
