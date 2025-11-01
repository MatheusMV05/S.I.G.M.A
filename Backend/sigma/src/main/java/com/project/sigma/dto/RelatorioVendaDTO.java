package com.project.sigma.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO para a VIEW vw_relatorio_vendas
 */
public class RelatorioVendaDTO {
    private Integer idVenda;
    private LocalDate dataVenda;
    private BigDecimal valorTotal;
    private String formaPagamento;
    private Integer idCliente;
    private String clienteNome;
    private String clienteCpf;
    private String clienteTelefone;
    private String clienteEmail;
    private Integer idFuncionario;
    private String funcionarioNome;
    private String funcionarioCargo;
    private Long totalItensVenda;
    private Integer quantidadeTotalProdutos;

    public RelatorioVendaDTO() {
    }

    // Constructor
    public RelatorioVendaDTO(Integer idVenda, LocalDate dataVenda, BigDecimal valorTotal, String formaPagamento,
                            Integer idCliente, String clienteNome, String clienteCpf, String clienteTelefone,
                            String clienteEmail, Integer idFuncionario, String funcionarioNome, String funcionarioCargo,
                            Long totalItensVenda, Integer quantidadeTotalProdutos) {
        this.idVenda = idVenda;
        this.dataVenda = dataVenda;
        this.valorTotal = valorTotal;
        this.formaPagamento = formaPagamento;
        this.idCliente = idCliente;
        this.clienteNome = clienteNome;
        this.clienteCpf = clienteCpf;
        this.clienteTelefone = clienteTelefone;
        this.clienteEmail = clienteEmail;
        this.idFuncionario = idFuncionario;
        this.funcionarioNome = funcionarioNome;
        this.funcionarioCargo = funcionarioCargo;
        this.totalItensVenda = totalItensVenda;
        this.quantidadeTotalProdutos = quantidadeTotalProdutos;
    }

    // Getters and Setters
    public Integer getIdVenda() {
        return idVenda;
    }

    public void setIdVenda(Integer idVenda) {
        this.idVenda = idVenda;
    }

    public LocalDate getDataVenda() {
        return dataVenda;
    }

    public void setDataVenda(LocalDate dataVenda) {
        this.dataVenda = dataVenda;
    }

    public BigDecimal getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(BigDecimal valorTotal) {
        this.valorTotal = valorTotal;
    }

    public String getFormaPagamento() {
        return formaPagamento;
    }

    public void setFormaPagamento(String formaPagamento) {
        this.formaPagamento = formaPagamento;
    }

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

    public String getClienteCpf() {
        return clienteCpf;
    }

    public void setClienteCpf(String clienteCpf) {
        this.clienteCpf = clienteCpf;
    }

    public String getClienteTelefone() {
        return clienteTelefone;
    }

    public void setClienteTelefone(String clienteTelefone) {
        this.clienteTelefone = clienteTelefone;
    }

    public String getClienteEmail() {
        return clienteEmail;
    }

    public void setClienteEmail(String clienteEmail) {
        this.clienteEmail = clienteEmail;
    }

    public Integer getIdFuncionario() {
        return idFuncionario;
    }

    public void setIdFuncionario(Integer idFuncionario) {
        this.idFuncionario = idFuncionario;
    }

    public String getFuncionarioNome() {
        return funcionarioNome;
    }

    public void setFuncionarioNome(String funcionarioNome) {
        this.funcionarioNome = funcionarioNome;
    }

    public String getFuncionarioCargo() {
        return funcionarioCargo;
    }

    public void setFuncionarioCargo(String funcionarioCargo) {
        this.funcionarioCargo = funcionarioCargo;
    }

    public Long getTotalItensVenda() {
        return totalItensVenda;
    }

    public void setTotalItensVenda(Long totalItensVenda) {
        this.totalItensVenda = totalItensVenda;
    }

    public Integer getQuantidadeTotalProdutos() {
        return quantidadeTotalProdutos;
    }

    public void setQuantidadeTotalProdutos(Integer quantidadeTotalProdutos) {
        this.quantidadeTotalProdutos = quantidadeTotalProdutos;
    }
}
