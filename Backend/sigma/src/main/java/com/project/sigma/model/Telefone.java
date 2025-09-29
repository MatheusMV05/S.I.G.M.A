package com.project.sigma.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Telefone {
    private Long id_telefone;
    private Long id_pessoa;
    private String numero;
    private TipoTelefone tipo;

    public enum TipoTelefone {
        RESIDENCIAL, COMERCIAL, CELULAR, OUTRO
    }

    public Telefone(Long id_pessoa, String numero, TipoTelefone tipo) {
        this.id_pessoa = id_pessoa;
        this.numero = numero;
        this.tipo = tipo;
    }
}
