package com.project.sigma.model;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class Cliente {

    private Long id_pessoa;
    private String email;
    private Boolean ativo;
    private Integer ranke;
    private BigDecimal total_gasto;
    private LocalDate data_ultima_compra;

}
