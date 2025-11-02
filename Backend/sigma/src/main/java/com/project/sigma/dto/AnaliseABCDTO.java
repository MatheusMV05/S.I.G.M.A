package com.project.sigma.dto;

/**
 * DTO para Análise ABC de Produtos (Curva de Pareto)
 * Classifica produtos em A, B ou C baseado em faturamento
 */
public class AnaliseABCDTO {
    private Long idProduto;
    private String nomeProduto;
    private String categoriaNome;
    private Double faturamentoTotal;
    private Double percentualFaturamento;
    private Double percentualAcumulado;
    private String classificacaoABC; // "A", "B" ou "C"
    private Integer quantidadeVendida;
    private Integer rankingFaturamento;

    // Constructors
    public AnaliseABCDTO() {}

    public AnaliseABCDTO(Long idProduto, String nomeProduto, String categoriaNome,
                        Double faturamentoTotal, Double percentualFaturamento,
                        Double percentualAcumulado, String classificacaoABC,
                        Integer quantidadeVendida, Integer rankingFaturamento) {
        this.idProduto = idProduto;
        this.nomeProduto = nomeProduto;
        this.categoriaNome = categoriaNome;
        this.faturamentoTotal = faturamentoTotal;
        this.percentualFaturamento = percentualFaturamento;
        this.percentualAcumulado = percentualAcumulado;
        this.classificacaoABC = classificacaoABC;
        this.quantidadeVendida = quantidadeVendida;
        this.rankingFaturamento = rankingFaturamento;
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

    public Double getFaturamentoTotal() {
        return faturamentoTotal;
    }

    public void setFaturamentoTotal(Double faturamentoTotal) {
        this.faturamentoTotal = faturamentoTotal;
    }

    public Double getPercentualFaturamento() {
        return percentualFaturamento;
    }

    public void setPercentualFaturamento(Double percentualFaturamento) {
        this.percentualFaturamento = percentualFaturamento;
    }

    public Double getPercentualAcumulado() {
        return percentualAcumulado;
    }

    public void setPercentualAcumulado(Double percentualAcumulado) {
        this.percentualAcumulado = percentualAcumulado;
    }

    public String getClassificacaoABC() {
        return classificacaoABC;
    }

    public void setClassificacaoABC(String classificacaoABC) {
        this.classificacaoABC = classificacaoABC;
    }

    public Integer getQuantidadeVendida() {
        return quantidadeVendida;
    }

    public void setQuantidadeVendida(Integer quantidadeVendida) {
        this.quantidadeVendida = quantidadeVendida;
    }

    public Integer getRankingFaturamento() {
        return rankingFaturamento;
    }

    public void setRankingFaturamento(Integer rankingFaturamento) {
        this.rankingFaturamento = rankingFaturamento;
    }
}
