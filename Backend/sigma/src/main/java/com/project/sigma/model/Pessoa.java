package com.project.sigma.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pessoa {
    private Long id_pessoa;
    private String nome;
    private String email;
    private String rua;
    private String numero;
    private String bairro;
    private String cidade;
    private String cep;
    private LocalDateTime data_cadastro;

    // Not stored in DB, populated when needed
    private List<Telefone> telefones;

    public Pessoa(String nome, String email, String rua, String numero, String bairro, String cidade, String cep) {
        this.nome = nome;
        this.email = email;
        this.rua = rua;
        this.numero = numero;
        this.bairro = bairro;
        this.cidade = cidade;
        this.cep = cep;
        this.data_cadastro = LocalDateTime.now();
    }
}
