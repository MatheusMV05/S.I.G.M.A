package com.project.sigma.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class EstoqueCategoriaDTO {
    private String categoria;
    private BigDecimal totalEstoque;
}
