package com.project.sigma.dto;

import lombok.Data;

@Data
public class TopProductMovementDTO {
    private Long productId;
    private String productName;
    private long totalMovements;
    private long inQuantity;
    private long outQuantity;
}