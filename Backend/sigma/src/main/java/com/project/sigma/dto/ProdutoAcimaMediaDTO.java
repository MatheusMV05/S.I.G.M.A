package com.project.sigma.dto;

import java.math.BigDecimal;

/**
 * DTO para consulta de produtos com preço acima da média (SUBCONSULTA)
 */
public class ProdutoAcimaMediaDTO {
    private Integer idProduto;
    private String produtoNome;
    private String marca;
    private BigDecimal precoVenda;
    private BigDecimal precoCusto;
    private BigDecimal margemLucro;
    private String categoriaNome;
    private BigDecimal precoMedioCategoria;
    private BigDecimal diferencaMedia;
    private BigDecimal percentualAcimaMedia;

    public ProdutoAcimaMediaDTO() {
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

    public BigDecimal getPrecoCusto() {
        return precoCusto;
    }

    public void setPrecoCusto(BigDecimal precoCusto) {
        this.precoCusto = precoCusto;
    }

    public BigDecimal getMargemLucro() {
        return margemLucro;
    }

    public void setMargemLucro(BigDecimal margemLucro) {
        this.margemLucro = margemLucro;
    }

    public String getCategoriaNome() {
        return categoriaNome;
    }

    public void setCategoriaNome(String categoriaNome) {
        this.categoriaNome = categoriaNome;
    }

    public BigDecimal getPrecoMedioCategoria() {
        return precoMedioCategoria;
    }

    public void setPrecoMedioCategoria(BigDecimal precoMedioCategoria) {
        this.precoMedioCategoria = precoMedioCategoria;
    }

    public BigDecimal getDiferencaMedia() {
        return diferencaMedia;
    }

    public void setDiferencaMedia(BigDecimal diferencaMedia) {
        this.diferencaMedia = diferencaMedia;
    }

    public BigDecimal getPercentualAcimaMedia() {
        return percentualAcimaMedia;
    }

    public void setPercentualAcimaMedia(BigDecimal percentualAcimaMedia) {
        this.percentualAcimaMedia = percentualAcimaMedia;
    }
}
