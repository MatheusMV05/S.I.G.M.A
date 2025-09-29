package com.project.sigma.model;

import lombok.Data;

@Data
public class Fornecedor {

    private Long id_fornecedor;
    private String nome_fantasia;
    private String razao_social;
    private String cnpj;
    private String email;
    private String telefone;
    private String endereco_completo;
    private String contato_principal;

}