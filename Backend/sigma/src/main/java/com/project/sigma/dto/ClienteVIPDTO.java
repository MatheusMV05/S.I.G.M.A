package com.project.sigma.dto;

import java.math.BigDecimal;

/**
 * DTO para consulta de clientes VIP (SUBCONSULTA)
 */
public class ClienteVIPDTO {
    private Integer idCliente;
    private String clienteNome;
    private String cpf;
    private String telefone;
    private Long totalCompras;
    private BigDecimal ticketMedio;
    private BigDecimal valorTotalGasto;
    private BigDecimal mediaComprasGeral;

    public ClienteVIPDTO() {
    }

    public ClienteVIPDTO(Integer idCliente, String clienteNome, String cpf, String telefone,
                        Long totalCompras, BigDecimal ticketMedio, BigDecimal valorTotalGasto,
                        BigDecimal mediaComprasGeral) {
        this.idCliente = idCliente;
        this.clienteNome = clienteNome;
        this.cpf = cpf;
        this.telefone = telefone;
        this.totalCompras = totalCompras;
        this.ticketMedio = ticketMedio;
        this.valorTotalGasto = valorTotalGasto;
        this.mediaComprasGeral = mediaComprasGeral;
    }

    // Getters and Setters
    public Integer getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(Integer idCliente) {
        this.idCliente = idCliente;
    }

    public String getClienteNome() {
        return clienteNome;
    }

    public void setClienteNome(String clienteNome) {
        this.clienteNome = clienteNome;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
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

    public BigDecimal getValorTotalGasto() {
        return valorTotalGasto;
    }

    public void setValorTotalGasto(BigDecimal valorTotalGasto) {
        this.valorTotalGasto = valorTotalGasto;
    }

    public BigDecimal getMediaComprasGeral() {
        return mediaComprasGeral;
    }

    public void setMediaComprasGeral(BigDecimal mediaComprasGeral) {
        this.mediaComprasGeral = mediaComprasGeral;
    }
}
