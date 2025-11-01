package com.project.sigma.dto;

import java.math.BigDecimal;

/**
 * DTO para consulta de produtos com preço acima da média (SUBCONSULTA)
 */
public class ProdutoAcimaMediaDTO {
    private Integer idProduto;
    private String produtoNome;
    private BigDecimal precoVenda;
    private String categoriaNome;
    private BigDecimal diferencaMedia;
    private BigDecimal percentualAcimaMedia;

    public ProdutoAcimaMediaDTO() {
    }

    public ProdutoAcimaMediaDTO(Integer idProduto, String produtoNome, BigDecimal precoVenda,
                                String categoriaNome, BigDecimal diferencaMedia, BigDecimal percentualAcimaMedia) {
        this.idProduto = idProduto;
        this.produtoNome = produtoNome;
        this.precoVenda = precoVenda;
        this.categoriaNome = categoriaNome;
        this.diferencaMedia = diferencaMedia;
        this.percentualAcimaMedia = percentualAcimaMedia;
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

    public String getCategoriaNome() {
        return categoriaNome;
    }

    public void setCategoriaNome(String categoriaNome) {
        this.categoriaNome = categoriaNome;
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
