package com.project.sigma.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ValorEstoqueCategoriaDTO {
    private String categoria;
    private BigDecimal valorTotal;
}
