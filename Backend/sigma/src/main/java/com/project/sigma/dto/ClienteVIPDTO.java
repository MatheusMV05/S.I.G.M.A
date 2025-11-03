package com.project.sigma.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO para consulta de clientes VIP (SUBCONSULTA)
 */
public class ClienteVIPDTO {
    private Long idPessoa;
    private String clienteNome;
    private String clienteEmail;
    private String tipoPessoa;
    private Integer ranking;
    private BigDecimal totalGasto;
    private LocalDate dataUltimaCompra;
    private Long totalCompras;
    private BigDecimal ticketMedio;
    private BigDecimal mediaGastoGeral;
    private BigDecimal diferencaMedia;
    private BigDecimal percentualAcimaMedia;

    public ClienteVIPDTO() {
    }

    // Getters and Setters
    public Long getIdPessoa() {
        return idPessoa;
    }

    public void setIdPessoa(Long idPessoa) {
        this.idPessoa = idPessoa;
    }

    public String getClienteNome() {
        return clienteNome;
    }

    public void setClienteNome(String clienteNome) {
        this.clienteNome = clienteNome;
    }

    public String getClienteEmail() {
        return clienteEmail;
    }

    public void setClienteEmail(String clienteEmail) {
        this.clienteEmail = clienteEmail;
    }

    public String getTipoPessoa() {
        return tipoPessoa;
    }

    public void setTipoPessoa(String tipoPessoa) {
        this.tipoPessoa = tipoPessoa;
    }

    public Integer getRanking() {
        return ranking;
    }

    public void setRanking(Integer ranking) {
        this.ranking = ranking;
    }

    public BigDecimal getTotalGasto() {
        return totalGasto;
    }

    public void setTotalGasto(BigDecimal totalGasto) {
        this.totalGasto = totalGasto;
    }

    public LocalDate getDataUltimaCompra() {
        return dataUltimaCompra;
    }

    public void setDataUltimaCompra(LocalDate dataUltimaCompra) {
        this.dataUltimaCompra = dataUltimaCompra;
    }

    public Long getTotalCompras() {
        return totalCompras;
    }

    public void setTotalCompras(Long totalCompras) {
        this.totalCompras = totalCompras;
    }

    public BigDecimal getTicketMedio() {
        return ticketMedio;
    }

    public void setTicketMedio(BigDecimal ticketMedio) {
        this.ticketMedio = ticketMedio;
    }

    public BigDecimal getMediaGastoGeral() {
        return mediaGastoGeral;
    }

    public void setMediaGastoGeral(BigDecimal mediaGastoGeral) {
        this.mediaGastoGeral = mediaGastoGeral;
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
