package com.project.sigma.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClienteJuridico {
    private Long id_pessoa;
    private String cnpj;
    private String razao_social;
    private String inscricao_estadual;

    // Not stored in DB, populated when needed
    private Cliente cliente;

    public ClienteJuridico(Long id_pessoa, String cnpj, String razao_social) {
        this.id_pessoa = id_pessoa;
        this.cnpj = cnpj;
        this.razao_social = razao_social;
    }
}