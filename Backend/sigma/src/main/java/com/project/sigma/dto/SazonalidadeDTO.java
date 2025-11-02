package com.project.sigma.dto;

/**
 * DTO para análise de sazonalidade de vendas
 * Identifica padrões de vendas por período (mês, dia da semana, hora)
 */
public class SazonalidadeDTO {
    private String periodo; // Ex: "Janeiro", "Segunda-feira", "14h-15h"
    private Integer quantidadeVendas;
    private Double valorTotalVendas;
    private Double ticketMedio;
    private Integer rankingPeriodo;

    // Constructors
    public SazonalidadeDTO() {}

    public SazonalidadeDTO(String periodo, Integer quantidadeVendas, Double valorTotalVendas, 
                          Double ticketMedio, Integer rankingPeriodo) {
        this.periodo = periodo;
        this.quantidadeVendas = quantidadeVendas;
        this.valorTotalVendas = valorTotalVendas;
        this.ticketMedio = ticketMedio;
        this.rankingPeriodo = rankingPeriodo;
    }

    // Getters and Setters
    public String getPeriodo() {
        return periodo;
    }

    public void setPeriodo(String periodo) {
        this.periodo = periodo;
    }

    public Integer getQuantidadeVendas() {
        return quantidadeVendas;
    }

    public void setQuantidadeVendas(Integer quantidadeVendas) {
        this.quantidadeVendas = quantidadeVendas;
    }

    public Double getValorTotalVendas() {
        return valorTotalVendas;
    }

    public void setValorTotalVendas(Double valorTotalVendas) {
        this.valorTotalVendas = valorTotalVendas;
    }

    public Double getTicketMedio() {
        return ticketMedio;
    }

    public void setTicketMedio(Double ticketMedio) {
        this.ticketMedio = ticketMedio;
    }

    public Integer getRankingPeriodo() {
        return rankingPeriodo;
    }

    public void setRankingPeriodo(Integer rankingPeriodo) {
        this.rankingPeriodo = rankingPeriodo;
    }
}
