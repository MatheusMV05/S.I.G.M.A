package com.project.sigma.dto;
import lombok.Data;

@Data
public class ValidateStockRequestDTO {
    private Long productId;
    private Integer quantity;
}

