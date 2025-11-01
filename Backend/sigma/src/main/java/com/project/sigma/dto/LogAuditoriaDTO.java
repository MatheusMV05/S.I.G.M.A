package com.project.sigma.dto;

import java.time.LocalDateTime;

/**
 * DTO para logs de auditoria
 */
public class LogAuditoriaDTO {
    private Integer idLog;
    private String tabela;
    private String operacao;
    private Integer idUsuario;
    private Integer registroId;
    private String dadosAntigos;
    private String dadosNovos;
    private String ipOrigem;
    private LocalDateTime dataHora;
    private String descricao;

    public LogAuditoriaDTO() {
    }

    public LogAuditoriaDTO(Integer idLog, String tabela, String operacao, Integer idUsuario,
                          Integer registroId, String dadosAntigos, String dadosNovos,
                          String ipOrigem, LocalDateTime dataHora, String descricao) {
        this.idLog = idLog;
        this.tabela = tabela;
        this.operacao = operacao;
        this.idUsuario = idUsuario;
        this.registroId = registroId;
        this.dadosAntigos = dadosAntigos;
        this.dadosNovos = dadosNovos;
        this.ipOrigem = ipOrigem;
        this.dataHora = dataHora;
        this.descricao = descricao;
    }

    // Getters and Setters
    public Integer getIdLog() {
        return idLog;
    }

    public void setIdLog(Integer idLog) {
        this.idLog = idLog;
    }

    public String getTabela() {
        return tabela;
    }

    public void setTabela(String tabela) {
        this.tabela = tabela;
    }

    public String getOperacao() {
        return operacao;
    }

    public void setOperacao(String operacao) {
        this.operacao = operacao;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Integer getRegistroId() {
        return registroId;
    }

    public void setRegistroId(Integer registroId) {
        this.registroId = registroId;
    }

    public String getDadosAntigos() {
        return dadosAntigos;
    }

    public void setDadosAntigos(String dadosAntigos) {
        this.dadosAntigos = dadosAntigos;
    }

    public String getDadosNovos() {
        return dadosNovos;
    }

    public void setDadosNovos(String dadosNovos) {
        this.dadosNovos = dadosNovos;
    }

    public String getIpOrigem() {
        return ipOrigem;
    }

    public void setIpOrigem(String ipOrigem) {
        this.ipOrigem = ipOrigem;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
}
