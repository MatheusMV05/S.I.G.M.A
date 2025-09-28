package com.project.sigma.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class EstoqueMarcaDTO {
    private String marca;
    private BigDecimal totalEstoque;
}
