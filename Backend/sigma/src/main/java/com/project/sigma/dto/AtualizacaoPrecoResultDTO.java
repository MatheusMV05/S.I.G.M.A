package com.project.sigma.dto;

/**
 * DTO para resposta do procedimento atualizar_precos_categoria
 */
public class AtualizacaoPrecoResultDTO {
    private Integer totalProdutosAtualizados;
    private Double percentualAplicado;
    private String categoriaNome;

    public AtualizacaoPrecoResultDTO() {
    }

    public AtualizacaoPrecoResultDTO(Integer totalProdutosAtualizados, Double percentualAplicado, String categoriaNome) {
        this.totalProdutosAtualizados = totalProdutosAtualizados;
        this.percentualAplicado = percentualAplicado;
        this.categoriaNome = categoriaNome;
    }

    // Getters and Setters
    public Integer getTotalProdutosAtualizados() {
        return totalProdutosAtualizados;
    }

    public void setTotalProdutosAtualizados(Integer totalProdutosAtualizados) {
        this.totalProdutosAtualizados = totalProdutosAtualizados;
    }

    public Double getPercentualAplicado() {
        return percentualAplicado;
    }

    public void setPercentualAplicado(Double percentualAplicado) {
        this.percentualAplicado = percentualAplicado;
    }

    public String getCategoriaNome() {
        return categoriaNome;
    }

    public void setCategoriaNome(String categoriaNome) {
        this.categoriaNome = categoriaNome;
    }
}
