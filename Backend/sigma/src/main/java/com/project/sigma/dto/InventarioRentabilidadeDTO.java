package com.project.sigma.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO para a VIEW vw_inventario_rentabilidade
 * Integra informações de Produto, Categoria e Fornecedor
 * com análise de rentabilidade e status de estoque
 */
public class InventarioRentabilidadeDTO {
    // Dados do Produto
    private Long idProduto;
    private String produtoNome;
    private String marca;
    private String descricao;
    private String codigoBarras;
    private String codigoInterno;
    private String statusProduto;
    
    // Preços e Margens
    private BigDecimal precoCusto;
    private BigDecimal precoVenda;
    private BigDecimal margemLucroPercentual;
    private BigDecimal lucroUnitario;
    
    // Estoque
    private Integer estoque;
    private Integer estoqueMinimo;
    private Integer estoqueMaximo;
    private String unidadeMedida;
    private String localizacaoPrateleira;
    
    // Valores Totais
    private BigDecimal valorEstoqueCusto;
    private BigDecimal valorEstoqueVenda;
    private BigDecimal lucroPotencialEstoque;
    
    // Categoria
    private Long idCategoria;
    private String categoriaNome;
    private String categoriaDescricao;
    private String statusCategoria;
    
    // Fornecedor
    private Long idFornecedor;
    private String fornecedorNome;
    private String fornecedorRazaoSocial;
    private String fornecedorCnpj;
    private String fornecedorTelefone;
    private String fornecedorEmail;
    private String fornecedorCidade;
    private String fornecedorEstado;
    private Integer prazoEntregaDias;
    private BigDecimal avaliacaoFornecedor;
    private String statusFornecedor;
    
    // Status e Análises
    private String statusEstoque;
    private String acaoRecomendada;
    private String classificacaoRentabilidade;
    private LocalDateTime dataCadastro;
    private Integer diasDesdeCadastro;

    // Construtores
    public InventarioRentabilidadeDTO() {
    }

    // Getters e Setters
    public Long getIdProduto() {
        return idProduto;
    }

    public void setIdProduto(Long idProduto) {
        this.idProduto = idProduto;
    }

    public String getProdutoNome() {
        return produtoNome;
    }

    public void setProdutoNome(String produtoNome) {
        this.produtoNome = produtoNome;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getCodigoBarras() {
        return codigoBarras;
    }

    public void setCodigoBarras(String codigoBarras) {
        this.codigoBarras = codigoBarras;
    }

    public String getCodigoInterno() {
        return codigoInterno;
    }

    public void setCodigoInterno(String codigoInterno) {
        this.codigoInterno = codigoInterno;
    }

    public String getStatusProduto() {
        return statusProduto;
    }

    public void setStatusProduto(String statusProduto) {
        this.statusProduto = statusProduto;
    }

    public BigDecimal getPrecoCusto() {
        return precoCusto;
    }

    public void setPrecoCusto(BigDecimal precoCusto) {
        this.precoCusto = precoCusto;
    }

    public BigDecimal getPrecoVenda() {
        return precoVenda;
    }

    public void setPrecoVenda(BigDecimal precoVenda) {
        this.precoVenda = precoVenda;
    }

    public BigDecimal getMargemLucroPercentual() {
        return margemLucroPercentual;
    }

    public void setMargemLucroPercentual(BigDecimal margemLucroPercentual) {
        this.margemLucroPercentual = margemLucroPercentual;
    }

    public BigDecimal getLucroUnitario() {
        return lucroUnitario;
    }

    public void setLucroUnitario(BigDecimal lucroUnitario) {
        this.lucroUnitario = lucroUnitario;
    }

    public Integer getEstoque() {
        return estoque;
    }

    public void setEstoque(Integer estoque) {
        this.estoque = estoque;
    }

    public Integer getEstoqueMinimo() {
        return estoqueMinimo;
    }

    public void setEstoqueMinimo(Integer estoqueMinimo) {
        this.estoqueMinimo = estoqueMinimo;
    }

    public Integer getEstoqueMaximo() {
        return estoqueMaximo;
    }

    public void setEstoqueMaximo(Integer estoqueMaximo) {
        this.estoqueMaximo = estoqueMaximo;
    }

    public String getUnidadeMedida() {
        return unidadeMedida;
    }

    public void setUnidadeMedida(String unidadeMedida) {
        this.unidadeMedida = unidadeMedida;
    }

    public String getLocalizacaoPrateleira() {
        return localizacaoPrateleira;
    }

    public void setLocalizacaoPrateleira(String localizacaoPrateleira) {
        this.localizacaoPrateleira = localizacaoPrateleira;
    }

    public BigDecimal getValorEstoqueCusto() {
        return valorEstoqueCusto;
    }

    public void setValorEstoqueCusto(BigDecimal valorEstoqueCusto) {
        this.valorEstoqueCusto = valorEstoqueCusto;
    }

    public BigDecimal getValorEstoqueVenda() {
        return valorEstoqueVenda;
    }

    public void setValorEstoqueVenda(BigDecimal valorEstoqueVenda) {
        this.valorEstoqueVenda = valorEstoqueVenda;
    }

    public BigDecimal getLucroPotencialEstoque() {
        return lucroPotencialEstoque;
    }

    public void setLucroPotencialEstoque(BigDecimal lucroPotencialEstoque) {
        this.lucroPotencialEstoque = lucroPotencialEstoque;
    }

    public Long getIdCategoria() {
        return idCategoria;
    }

    public void setIdCategoria(Long idCategoria) {
        this.idCategoria = idCategoria;
    }

    public String getCategoriaNome() {
        return categoriaNome;
    }

    public void setCategoriaNome(String categoriaNome) {
        this.categoriaNome = categoriaNome;
    }

    public String getCategoriaDescricao() {
        return categoriaDescricao;
    }

    public void setCategoriaDescricao(String categoriaDescricao) {
        this.categoriaDescricao = categoriaDescricao;
    }

    public String getStatusCategoria() {
        return statusCategoria;
    }

    public void setStatusCategoria(String statusCategoria) {
        this.statusCategoria = statusCategoria;
    }

    public Long getIdFornecedor() {
        return idFornecedor;
    }

    public void setIdFornecedor(Long idFornecedor) {
        this.idFornecedor = idFornecedor;
    }

    public String getFornecedorNome() {
        return fornecedorNome;
    }

    public void setFornecedorNome(String fornecedorNome) {
        this.fornecedorNome = fornecedorNome;
    }

    public String getFornecedorRazaoSocial() {
        return fornecedorRazaoSocial;
    }

    public void setFornecedorRazaoSocial(String fornecedorRazaoSocial) {
        this.fornecedorRazaoSocial = fornecedorRazaoSocial;
    }

    public String getFornecedorCnpj() {
        return fornecedorCnpj;
    }

    public void setFornecedorCnpj(String fornecedorCnpj) {
        this.fornecedorCnpj = fornecedorCnpj;
    }

    public String getFornecedorTelefone() {
        return fornecedorTelefone;
    }

    public void setFornecedorTelefone(String fornecedorTelefone) {
        this.fornecedorTelefone = fornecedorTelefone;
    }

    public String getFornecedorEmail() {
        return fornecedorEmail;
    }

    public void setFornecedorEmail(String fornecedorEmail) {
        this.fornecedorEmail = fornecedorEmail;
    }

    public String getFornecedorCidade() {
        return fornecedorCidade;
    }

    public void setFornecedorCidade(String fornecedorCidade) {
        this.fornecedorCidade = fornecedorCidade;
    }

    public String getFornecedorEstado() {
        return fornecedorEstado;
    }

    public void setFornecedorEstado(String fornecedorEstado) {
        this.fornecedorEstado = fornecedorEstado;
    }

    public Integer getPrazoEntregaDias() {
        return prazoEntregaDias;
    }

    public void setPrazoEntregaDias(Integer prazoEntregaDias) {
        this.prazoEntregaDias = prazoEntregaDias;
    }

    public BigDecimal getAvaliacaoFornecedor() {
        return avaliacaoFornecedor;
    }

    public void setAvaliacaoFornecedor(BigDecimal avaliacaoFornecedor) {
        this.avaliacaoFornecedor = avaliacaoFornecedor;
    }

    public String getStatusFornecedor() {
        return statusFornecedor;
    }

    public void setStatusFornecedor(String statusFornecedor) {
        this.statusFornecedor = statusFornecedor;
    }

    public String getStatusEstoque() {
        return statusEstoque;
    }

    public void setStatusEstoque(String statusEstoque) {
        this.statusEstoque = statusEstoque;
    }

    public String getAcaoRecomendada() {
        return acaoRecomendada;
    }

    public void setAcaoRecomendada(String acaoRecomendada) {
        this.acaoRecomendada = acaoRecomendada;
    }

    public String getClassificacaoRentabilidade() {
        return classificacaoRentabilidade;
    }

    public void setClassificacaoRentabilidade(String classificacaoRentabilidade) {
        this.classificacaoRentabilidade = classificacaoRentabilidade;
    }

    public LocalDateTime getDataCadastro() {
        return dataCadastro;
    }

    public void setDataCadastro(LocalDateTime dataCadastro) {
        this.dataCadastro = dataCadastro;
    }

    public Integer getDiasDesdeCadastro() {
        return diasDesdeCadastro;
    }

    public void setDiasDesdeCadastro(Integer diasDesdeCadastro) {
        this.diasDesdeCadastro = diasDesdeCadastro;
    }
}
