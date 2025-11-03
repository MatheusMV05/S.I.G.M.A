package com.project.sigma.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class HistoricoFuncionario {
    private Long idHistorico;
    private Long idFuncionario;
    private TipoEvento tipoEvento;
    private LocalDate dataEvento;
    private String cargoAnterior;
    private String cargoNovo;
    private String setorAnterior;
    private String setorNovo;
    private BigDecimal salarioAnterior;
    private BigDecimal salarioNovo;
    private String descricao;
    private Long realizadoPor;
    private LocalDateTime dataRegistro;

    // Informações adicionais para exibição
    private String nomeFuncionario;
    private String nomeRealizador;

    public enum TipoEvento {
        ADMISSAO, PROMOCAO, AUMENTO_SALARIAL, MUDANCA_CARGO, 
        MUDANCA_SETOR, DESLIGAMENTO, FERIAS, AFASTAMENTO
    }

    // Constructors
    public HistoricoFuncionario() {}

    public HistoricoFuncionario(Long idFuncionario, TipoEvento tipoEvento, LocalDate dataEvento, String descricao) {
        this.idFuncionario = idFuncionario;
        this.tipoEvento = tipoEvento;
        this.dataEvento = dataEvento;
        this.descricao = descricao;
    }

    // Getters and Setters
    public Long getIdHistorico() {
        return idHistorico;
    }

    public void setIdHistorico(Long idHistorico) {
        this.idHistorico = idHistorico;
    }

    public Long getIdFuncionario() {
        return idFuncionario;
    }

    public void setIdFuncionario(Long idFuncionario) {
        this.idFuncionario = idFuncionario;
    }

    public TipoEvento getTipoEvento() {
        return tipoEvento;
    }

    public void setTipoEvento(TipoEvento tipoEvento) {
        this.tipoEvento = tipoEvento;
    }

    public LocalDate getDataEvento() {
        return dataEvento;
    }

    public void setDataEvento(LocalDate dataEvento) {
        this.dataEvento = dataEvento;
    }

    public String getCargoAnterior() {
        return cargoAnterior;
    }

    public void setCargoAnterior(String cargoAnterior) {
        this.cargoAnterior = cargoAnterior;
    }

    public String getCargoNovo() {
        return cargoNovo;
    }

    public void setCargoNovo(String cargoNovo) {
        this.cargoNovo = cargoNovo;
    }

    public String getSetorAnterior() {
        return setorAnterior;
    }

    public void setSetorAnterior(String setorAnterior) {
        this.setorAnterior = setorAnterior;
    }

    public String getSetorNovo() {
        return setorNovo;
    }

    public void setSetorNovo(String setorNovo) {
        this.setorNovo = setorNovo;
    }

    public BigDecimal getSalarioAnterior() {
        return salarioAnterior;
    }

    public void setSalarioAnterior(BigDecimal salarioAnterior) {
        this.salarioAnterior = salarioAnterior;
    }

    public BigDecimal getSalarioNovo() {
        return salarioNovo;
    }

    public void setSalarioNovo(BigDecimal salarioNovo) {
        this.salarioNovo = salarioNovo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Long getRealizadoPor() {
        return realizadoPor;
    }

    public void setRealizadoPor(Long realizadoPor) {
        this.realizadoPor = realizadoPor;
    }

    public LocalDateTime getDataRegistro() {
        return dataRegistro;
    }

    public void setDataRegistro(LocalDateTime dataRegistro) {
        this.dataRegistro = dataRegistro;
    }

    public String getNomeFuncionario() {
        return nomeFuncionario;
    }

    public void setNomeFuncionario(String nomeFuncionario) {
        this.nomeFuncionario = nomeFuncionario;
    }

    public String getNomeRealizador() {
        return nomeRealizador;
    }

    public void setNomeRealizador(String nomeRealizador) {
        this.nomeRealizador = nomeRealizador;
    }
}
