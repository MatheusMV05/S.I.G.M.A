package com.project.sigma.dto;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

@Data
public class CreateStockMovementRequest {
    @NotNull
    private Long productId;

    @NotNull
    private String type; // "IN", "OUT", "ADJUSTMENT", "LOSS", "RETURN"

    @NotNull
    @Min(1)
    private Integer quantity;

    private String reason;

    // id_usuario será pego do contexto de segurança (usuário logado)
}