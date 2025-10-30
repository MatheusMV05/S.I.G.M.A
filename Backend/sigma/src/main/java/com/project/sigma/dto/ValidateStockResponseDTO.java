package com.project.sigma.dto;

import lombok.Data;

@Data
public class ValidateStockResponseDTO {
    private boolean available;
    private int currentStock;
    private String message;

    public ValidateStockResponseDTO(boolean available, int currentStock) {
        this.available = available;
        this.currentStock = currentStock;
        this.message = available ? "Estoque disponível" : "Estoque insuficiente";
    }
}
