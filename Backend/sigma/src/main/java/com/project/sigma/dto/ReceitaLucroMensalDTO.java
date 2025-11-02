package com.project.sigma.dto;

public class ReceitaLucroMensalDTO {
    private String mes;           // Nome do mês (Jan, Fev, Mar...)
    private String mesCompleto;   // Mês completo (2024-01)
    private Double receita;       // Valor total de vendas
    private Double lucro;         // Lucro estimado (receita - custos estimados)
    private Integer numeroVendas; // Quantidade de vendas

    // Construtores
    public ReceitaLucroMensalDTO() {}

    public ReceitaLucroMensalDTO(String mes, String mesCompleto, Double receita, Double lucro, Integer numeroVendas) {
        this.mes = mes;
        this.mesCompleto = mesCompleto;
        this.receita = receita;
        this.lucro = lucro;
        this.numeroVendas = numeroVendas;
    }

    // Getters e Setters
    public String getMes() {
        return mes;
    }

    public void setMes(String mes) {
        this.mes = mes;
    }

    public String getMesCompleto() {
        return mesCompleto;
    }

    public void setMesCompleto(String mesCompleto) {
        this.mesCompleto = mesCompleto;
    }

    public Double getReceita() {
        return receita;
    }

    public void setReceita(Double receita) {
        this.receita = receita;
    }

    public Double getLucro() {
        return lucro;
    }

    public void setLucro(Double lucro) {
        this.lucro = lucro;
    }

    public Integer getNumeroVendas() {
        return numeroVendas;
    }

    public void setNumeroVendas(Integer numeroVendas) {
        this.numeroVendas = numeroVendas;
    }

    @Override
    public String toString() {
        return "ReceitaLucroMensalDTO{" +
                "mes='" + mes + '\'' +
                ", mesCompleto='" + mesCompleto + '\'' +
                ", receita=" + receita +
                ", lucro=" + lucro +
                ", numeroVendas=" + numeroVendas +
                '}';
    }
}
