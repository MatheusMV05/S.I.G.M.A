package com.project.sigma.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data // Cria getters, setters, toString(), equals() e hashCode()
@NoArgsConstructor //Cria um construtor sem argumentos
@AllArgsConstructor //Cria um construtor com todos os argumentos

public class Produto {

    //Atributos:
    private Long id;

    private String nome;

    private String marca;

    private Integer quantEmEstoque;

    private BigDecimal valorUnitario;

    private LocalDate dataValidade;

    private Integer idCategoria;

}

