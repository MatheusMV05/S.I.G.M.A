package com.project.sigma.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class DocumentoFuncionario {
    private Long idDocumento;
    private Long idFuncionario;
    private TipoDocumento tipoDocumento;
    private String numeroDocumento;
    private String arquivoUrl;
    private LocalDate dataEmissao;
    private LocalDate dataValidade;
    private String observacoes;
    private LocalDateTime dataCadastro;

    // Informações adicionais para exibição
    private String nomeFuncionario;
    private String matriculaFuncionario;

    public enum TipoDocumento {
        RG, CPF, CNH, CTPS, TITULO_ELEITOR, 
        CERTIFICADO, CONTRATO, EXAME_ADMISSIONAL, OUTRO
    }

    // Constructors
    public DocumentoFuncionario() {}

    public DocumentoFuncionario(Long idFuncionario, TipoDocumento tipoDocumento, String numeroDocumento) {
        this.idFuncionario = idFuncionario;
        this.tipoDocumento = tipoDocumento;
        this.numeroDocumento = numeroDocumento;
    }

    // Getters and Setters
    public Long getIdDocumento() {
        return idDocumento;
    }

    public void setIdDocumento(Long idDocumento) {
        this.idDocumento = idDocumento;
    }

    public Long getIdFuncionario() {
        return idFuncionario;
    }

    public void setIdFuncionario(Long idFuncionario) {
        this.idFuncionario = idFuncionario;
    }

    public TipoDocumento getTipoDocumento() {
        return tipoDocumento;
    }

    public void setTipoDocumento(TipoDocumento tipoDocumento) {
        this.tipoDocumento = tipoDocumento;
    }

    public String getNumeroDocumento() {
        return numeroDocumento;
    }

    public void setNumeroDocumento(String numeroDocumento) {
        this.numeroDocumento = numeroDocumento;
    }

    public String getArquivoUrl() {
        return arquivoUrl;
    }

    public void setArquivoUrl(String arquivoUrl) {
        this.arquivoUrl = arquivoUrl;
    }

    public LocalDate getDataEmissao() {
        return dataEmissao;
    }

    public void setDataEmissao(LocalDate dataEmissao) {
        this.dataEmissao = dataEmissao;
    }

    public LocalDate getDataValidade() {
        return dataValidade;
    }

    public void setDataValidade(LocalDate dataValidade) {
        this.dataValidade = dataValidade;
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
}
