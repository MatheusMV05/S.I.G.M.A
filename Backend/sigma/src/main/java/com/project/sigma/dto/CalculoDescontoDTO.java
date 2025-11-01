package com.project.sigma.dto;

import java.math.BigDecimal;

/**
 * DTO para resposta da função calcular_desconto
 */
public class CalculoDescontoDTO {
    private BigDecimal valorOriginal;
    private BigDecimal descontoPercentual;
    private BigDecimal valorDesconto;
    private BigDecimal valorFinal;

    public CalculoDescontoDTO() {
    }

    public CalculoDescontoDTO(BigDecimal valorOriginal, BigDecimal descontoPercentual,
                             BigDecimal valorDesconto, BigDecimal valorFinal) {
        this.valorOriginal = valorOriginal;
        this.descontoPercentual = descontoPercentual;
        this.valorDesconto = valorDesconto;
        this.valorFinal = valorFinal;
    }

    // Getters and Setters
    public BigDecimal getValorOriginal() {
        return valorOriginal;
    }

    public void setValorOriginal(BigDecimal valorOriginal) {
        this.valorOriginal = valorOriginal;
    }

    public BigDecimal getDescontoPercentual() {
        return descontoPercentual;
    }

    public void setDescontoPercentual(BigDecimal descontoPercentual) {
        this.descontoPercentual = descontoPercentual;
    }

    public BigDecimal getValorDesconto() {
        return valorDesconto;
    }

    public void setValorDesconto(BigDecimal valorDesconto) {
        this.valorDesconto = valorDesconto;
    }

    public BigDecimal getValorFinal() {
        return valorFinal;
    }

    public void setValorFinal(BigDecimal valorFinal) {
        this.valorFinal = valorFinal;
    }
}
