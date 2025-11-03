package com.project.sigma.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class FeriasFuncionario {
    private Long idFerias;
    private Long idFuncionario;
    private LocalDate periodoAquisitivoInicio;
    private LocalDate periodoAquisitivoFim;
    private LocalDate dataInicioFerias;
    private LocalDate dataFimFerias;
    private Integer diasGozados;
    private Boolean abonoPecuniario;
    private StatusFerias statusFerias;
    private String observacoes;
    private LocalDateTime dataCadastro;

    // Informações adicionais para exibição
    private String nomeFuncionario;
    private String matriculaFuncionario;
    private String cargoFuncionario;
    private String setorFuncionario;

    public enum StatusFerias {
        PROGRAMADAS, EM_ANDAMENTO, CONCLUIDAS, CANCELADAS
    }

    // Constructors
    public FeriasFuncionario() {}

    public FeriasFuncionario(Long idFuncionario, LocalDate dataInicioFerias, LocalDate dataFimFerias, Integer diasGozados) {
        this.idFuncionario = idFuncionario;
        this.dataInicioFerias = dataInicioFerias;
        this.dataFimFerias = dataFimFerias;
        this.diasGozados = diasGozados;
        this.abonoPecuniario = false;
        this.statusFerias = StatusFerias.PROGRAMADAS;
    }

    // Getters and Setters
    public Long getIdFerias() {
        return idFerias;
    }

    public void setIdFerias(Long idFerias) {
        this.idFerias = idFerias;
    }

    public Long getIdFuncionario() {
        return idFuncionario;
    }

    public void setIdFuncionario(Long idFuncionario) {
        this.idFuncionario = idFuncionario;
    }

    public LocalDate getPeriodoAquisitivoInicio() {
        return periodoAquisitivoInicio;
    }

    public void setPeriodoAquisitivoInicio(LocalDate periodoAquisitivoInicio) {
        this.periodoAquisitivoInicio = periodoAquisitivoInicio;
    }

    public LocalDate getPeriodoAquisitivoFim() {
        return periodoAquisitivoFim;
    }

    public void setPeriodoAquisitivoFim(LocalDate periodoAquisitivoFim) {
        this.periodoAquisitivoFim = periodoAquisitivoFim;
    }

    public LocalDate getDataInicioFerias() {
        return dataInicioFerias;
    }

    public void setDataInicioFerias(LocalDate dataInicioFerias) {
        this.dataInicioFerias = dataInicioFerias;
    }

    public LocalDate getDataFimFerias() {
        return dataFimFerias;
    }

    public void setDataFimFerias(LocalDate dataFimFerias) {
        this.dataFimFerias = dataFimFerias;
    }

    public Integer getDiasGozados() {
        return diasGozados;
    }

    public void setDiasGozados(Integer diasGozados) {
        this.diasGozados = diasGozados;
    }

    public Boolean getAbonoPecuniario() {
        return abonoPecuniario;
    }

    public void setAbonoPecuniario(Boolean abonoPecuniario) {
        this.abonoPecuniario = abonoPecuniario;
    }

    public StatusFerias getStatusFerias() {
        return statusFerias;
    }

    public void setStatusFerias(StatusFerias statusFerias) {
        this.statusFerias = statusFerias;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public LocalDateTime getDataCadastro() {
        return dataCadastro;
    }

    public void setDataCadastro(LocalDateTime dataCadastro) {
        this.dataCadastro = dataCadastro;
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
