package com.project.sigma.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO para Fornecedor
 * Usado para transferência de dados entre camadas
 */
public class FornecedorDTO {
    
    private Long id_fornecedor;
    private Long id_pessoa;
    private String nome_fantasia;
    private String razao_social;
    private String cnpj;
    private String email;
    private String telefone;
    
    // Endereço
    private String rua;
    private String numero;
    private String bairro;
    private String cidade;
    private String estado;
    private String cep;
    
    private String contato_principal;
    private String condicoes_pagamento;
    private Integer prazo_entrega_dias;
    private BigDecimal avaliacao;
    private String status;
    private LocalDateTime data_cadastro;
    
    // Campos calculados/adicionais
    private Integer total_produtos;
    private BigDecimal valor_total_compras;
    
    // Constructors
    public FornecedorDTO() {
    }
    
    // Getters and Setters
    public Long getId_fornecedor() {
        return id_fornecedor;
    }
    
    public void setId_fornecedor(Long id_fornecedor) {
        this.id_fornecedor = id_fornecedor;
    }
    
    public Long getId_pessoa() {
        return id_pessoa;
    }
    
    public void setId_pessoa(Long id_pessoa) {
        this.id_pessoa = id_pessoa;
    }
    
    public String getNome_fantasia() {
        return nome_fantasia;
    }
    
    public void setNome_fantasia(String nome_fantasia) {
        this.nome_fantasia = nome_fantasia;
    }
    
    public String getRazao_social() {
        return razao_social;
    }
    
    public void setRazao_social(String razao_social) {
        this.razao_social = razao_social;
    }
    
    public String getCnpj() {
        return cnpj;
    }
    
    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getTelefone() {
        return telefone;
    }
    
    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }
    
    public String getRua() {
        return rua;
    }
    
    public void setRua(String rua) {
        this.rua = rua;
    }
    
    public String getNumero() {
        return numero;
    }
    
    public void setNumero(String numero) {
        this.numero = numero;
    }
    
    public String getBairro() {
        return bairro;
    }
    
    public void setBairro(String bairro) {
        this.bairro = bairro;
    }
    
    public String getCidade() {
        return cidade;
    }
    
    public void setCidade(String cidade) {
        this.cidade = cidade;
    }
    
    public String getEstado() {
        return estado;
    }
    
    public void setEstado(String estado) {
        this.estado = estado;
    }
    
    public String getCep() {
        return cep;
    }
    
    public void setCep(String cep) {
        this.cep = cep;
    }
    
    public String getContato_principal() {
        return contato_principal;
    }
    
    public void setContato_principal(String contato_principal) {
        this.contato_principal = contato_principal;
    }
    
    public String getCondicoes_pagamento() {
        return condicoes_pagamento;
    }
    
    public void setCondicoes_pagamento(String condicoes_pagamento) {
        this.condicoes_pagamento = condicoes_pagamento;
    }
    
    public Integer getPrazo_entrega_dias() {
        return prazo_entrega_dias;
    }
    
    public void setPrazo_entrega_dias(Integer prazo_entrega_dias) {
        this.prazo_entrega_dias = prazo_entrega_dias;
    }
    
    public BigDecimal getAvaliacao() {
        return avaliacao;
    }
    
    public void setAvaliacao(BigDecimal avaliacao) {
        this.avaliacao = avaliacao;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public LocalDateTime getData_cadastro() {
        return data_cadastro;
    }
    
    public void setData_cadastro(LocalDateTime data_cadastro) {
        this.data_cadastro = data_cadastro;
    }
    
    public Integer getTotal_produtos() {
        return total_produtos;
    }
    
    public void setTotal_produtos(Integer total_produtos) {
        this.total_produtos = total_produtos;
    }
    
    public BigDecimal getValor_total_compras() {
        return valor_total_compras;
    }
    
    public void setValor_total_compras(BigDecimal valor_total_compras) {
        this.valor_total_compras = valor_total_compras;
    }
}
