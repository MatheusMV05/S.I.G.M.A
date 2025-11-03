package com.project.sigma.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class PontoEletronico {
    private Long idPonto;
    private Long idFuncionario;
    private LocalDate dataPonto;
    private LocalTime horaEntrada;
    private LocalTime horaSaidaAlmoco;
    private LocalTime horaRetornoAlmoco;
    private LocalTime horaSaida;
    private BigDecimal horasTrabalhadas;
    private BigDecimal horasExtras;
    private String observacoes;
    private StatusPonto statusPonto;
    private LocalDateTime dataRegistro;

    // Informações adicionais para exibição
    private String nomeFuncionario;
    private String matriculaFuncionario;
    private String cargoFuncionario;
    private String setorFuncionario;

    public enum StatusPonto {
        NORMAL, FALTA, ATESTADO, FERIAS, FOLGA
    }

    // Constructors
    public PontoEletronico() {}

    public PontoEletronico(Long idFuncionario, LocalDate dataPonto) {
        this.idFuncionario = idFuncionario;
        this.dataPonto = dataPonto;
        this.statusPonto = StatusPonto.NORMAL;
        this.horasTrabalhadas = BigDecimal.ZERO;
        this.horasExtras = BigDecimal.ZERO;
    }

    // Getters and Setters
    public Long getIdPonto() {
        return idPonto;
    }

    public void setIdPonto(Long idPonto) {
        this.idPonto = idPonto;
    }

    public Long getIdFuncionario() {
        return idFuncionario;
    }

    public void setIdFuncionario(Long idFuncionario) {
        this.idFuncionario = idFuncionario;
    }

    public LocalDate getDataPonto() {
        return dataPonto;
    }

    public void setDataPonto(LocalDate dataPonto) {
        this.dataPonto = dataPonto;
    }

    public LocalTime getHoraEntrada() {
        return horaEntrada;
    }

    public void setHoraEntrada(LocalTime horaEntrada) {
        this.horaEntrada = horaEntrada;
    }

    public LocalTime getHoraSaidaAlmoco() {
        return horaSaidaAlmoco;
    }

    public void setHoraSaidaAlmoco(LocalTime horaSaidaAlmoco) {
        this.horaSaidaAlmoco = horaSaidaAlmoco;
    }

    public LocalTime getHoraRetornoAlmoco() {
        return horaRetornoAlmoco;
    }

    public void setHoraRetornoAlmoco(LocalTime horaRetornoAlmoco) {
        this.horaRetornoAlmoco = horaRetornoAlmoco;
    }

    public LocalTime getHoraSaida() {
        return horaSaida;
    }

    public void setHoraSaida(LocalTime horaSaida) {
        this.horaSaida = horaSaida;
    }

    public BigDecimal getHorasTrabalhadas() {
        return horasTrabalhadas;
    }

    public void setHorasTrabalhadas(BigDecimal horasTrabalhadas) {
        this.horasTrabalhadas = horasTrabalhadas;
    }

    public BigDecimal getHorasExtras() {
        return horasExtras;
    }

    public void setHorasExtras(BigDecimal horasExtras) {
        this.horasExtras = horasExtras;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public StatusPonto getStatusPonto() {
        return statusPonto;
    }

    public void setStatusPonto(StatusPonto statusPonto) {
        this.statusPonto = statusPonto;
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

    public String getMatriculaFuncionario() {
        return matriculaFuncionario;
    }

    public void setMatriculaFuncionario(String matriculaFuncionario) {
        this.matriculaFuncionario = matriculaFuncionario;
    }

    public String getCargoFuncionario() {
        return cargoFuncionario;
    }

    public void setCargoFuncionario(String cargoFuncionario) {
        this.cargoFuncionario = cargoFuncionario;
    }

    public String getSetorFuncionario() {
        return setorFuncionario;
    }

    public void setSetorFuncionario(String setorFuncionario) {
        this.setorFuncionario = setorFuncionario;
    }
}
