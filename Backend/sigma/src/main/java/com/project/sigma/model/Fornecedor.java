package com.project.sigma.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Fornecedor {
    private Long id_fornecedor;
    private Long id_pessoa;
    private String nome_fantasia;
    private String razao_social;
    private String cnpj;
    private String email;
    private String telefone;
    private String endereco_completo;
    private String contato_principal;
    private StatusFornecedor status;

    // Not stored in DB, populated when needed
    private Pessoa pessoa;

    public enum StatusFornecedor {
        ATIVO, INATIVO
    }

    public Fornecedor(String nome_fantasia, String razao_social, String cnpj, String email, String telefone) {
        this.nome_fantasia = nome_fantasia;
        this.razao_social = razao_social;
        this.cnpj = cnpj;
        this.email = email;
        this.telefone = telefone;
        this.status = StatusFornecedor.ATIVO;
    }
}