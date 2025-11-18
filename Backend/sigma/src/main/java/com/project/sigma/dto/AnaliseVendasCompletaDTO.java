package com.project.sigma.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO para a VIEW vw_analise_vendas_completa
 * Consolida informações de Venda, Cliente, Funcionário e Caixa
 * para análise gerencial completa de vendas
 */
public class AnaliseVendasCompletaDTO {
    // Dados da Venda
    private Long idVenda;
    private LocalDateTime dataVenda;
    private LocalDate dataVendaSimples;
    private BigDecimal valorTotal;
    private BigDecimal desconto;
    private BigDecimal valorFinal;
    private String metodoPagamento;
    private String statusVenda;
    
    // Dados do Cliente
    private Long idCliente;
    private String clienteNome;
    private String clienteEmail;
    private String clienteCidade;
    private String tipoPessoa;
    private Integer rankingCliente;
    private BigDecimal totalGastoCliente;
    
    // Dados do Funcionário/Vendedor
    private Long idFuncionario;
    private String vendedorNome;
    private String vendedorCargo;
    private String vendedorSetor;
    
    // Dados do Caixa
    private Long idCaixa;
    private String statusCaixa;
    
    // Métricas Calculadas
    private BigDecimal percentualDesconto;
    private BigDecimal valorMedioItem;
    private Integer quantidadeItens;
    private String diaSemanaVenda;
    private Integer horaVenda;

    // Construtores
    public AnaliseVendasCompletaDTO() {
    }

    // Getters e Setters
    public Long getIdVenda() {
        return idVenda;
    }

    public void setIdVenda(Long idVenda) {
        this.idVenda = idVenda;
    }

    public LocalDateTime getDataVenda() {
        return dataVenda;
    }

    public void setDataVenda(LocalDateTime dataVenda) {
        this.dataVenda = dataVenda;
    }

    public LocalDate getDataVendaSimples() {
        return dataVendaSimples;
    }

    public void setDataVendaSimples(LocalDate dataVendaSimples) {
        this.dataVendaSimples = dataVendaSimples;
    }

    public BigDecimal getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(BigDecimal valorTotal) {
        this.valorTotal = valorTotal;
    }

    public BigDecimal getDesconto() {
        return desconto;
    }

    public void setDesconto(BigDecimal desconto) {
        this.desconto = desconto;
    }

    public BigDecimal getValorFinal() {
        return valorFinal;
    }

    public void setValorFinal(BigDecimal valorFinal) {
        this.valorFinal = valorFinal;
    }

    public String getMetodoPagamento() {
        return metodoPagamento;
    }

    public void setMetodoPagamento(String metodoPagamento) {
        this.metodoPagamento = metodoPagamento;
    }

    public String getStatusVenda() {
        return statusVenda;
    }

    public void setStatusVenda(String statusVenda) {
        this.statusVenda = statusVenda;
    }

    public Long getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(Long idCliente) {
        this.idCliente = idCliente;
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

    public String getClienteCidade() {
        return clienteCidade;
    }

    public void setClienteCidade(String clienteCidade) {
        this.clienteCidade = clienteCidade;
    }

    public String getTipoPessoa() {
        return tipoPessoa;
    }

    public void setTipoPessoa(String tipoPessoa) {
        this.tipoPessoa = tipoPessoa;
    }

    public Integer getRankingCliente() {
        return rankingCliente;
    }

    public void setRankingCliente(Integer rankingCliente) {
        this.rankingCliente = rankingCliente;
    }

    public BigDecimal getTotalGastoCliente() {
        return totalGastoCliente;
    }

    public void setTotalGastoCliente(BigDecimal totalGastoCliente) {
        this.totalGastoCliente = totalGastoCliente;
    }

    public Long getIdFuncionario() {
        return idFuncionario;
    }

    public void setIdFuncionario(Long idFuncionario) {
        this.idFuncionario = idFuncionario;
    }

    public String getVendedorNome() {
        return vendedorNome;
    }

    public void setVendedorNome(String vendedorNome) {
        this.vendedorNome = vendedorNome;
    }

    public String getVendedorCargo() {
        return vendedorCargo;
    }

    public void setVendedorCargo(String vendedorCargo) {
        this.vendedorCargo = vendedorCargo;
    }

    public String getVendedorSetor() {
        return vendedorSetor;
    }

    public void setVendedorSetor(String vendedorSetor) {
        this.vendedorSetor = vendedorSetor;
    }

    public Long getIdCaixa() {
        return idCaixa;
    }

    public void setIdCaixa(Long idCaixa) {
        this.idCaixa = idCaixa;
    }

    public String getStatusCaixa() {
        return statusCaixa;
    }

    public void setStatusCaixa(String statusCaixa) {
        this.statusCaixa = statusCaixa;
    }

    public BigDecimal getPercentualDesconto() {
        return percentualDesconto;
    }

    public void setPercentualDesconto(BigDecimal percentualDesconto) {
        this.percentualDesconto = percentualDesconto;
    }

    public BigDecimal getValorMedioItem() {
        return valorMedioItem;
    }

    public void setValorMedioItem(BigDecimal valorMedioItem) {
        this.valorMedioItem = valorMedioItem;
    }

    public Integer getQuantidadeItens() {
        return quantidadeItens;
    }

    public void setQuantidadeItens(Integer quantidadeItens) {
        this.quantidadeItens = quantidadeItens;
    }

    public String getDiaSemanaVenda() {
        return diaSemanaVenda;
    }

    public void setDiaSemanaVenda(String diaSemanaVenda) {
        this.diaSemanaVenda = diaSemanaVenda;
    }

    public Integer getHoraVenda() {
        return horaVenda;
    }

    public void setHoraVenda(Integer horaVenda) {
        this.horaVenda = horaVenda;
    }
}
