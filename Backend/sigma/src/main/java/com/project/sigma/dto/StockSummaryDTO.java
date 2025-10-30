package com.project.sigma.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class StockSummaryDTO {
    private long totalProducts;
    private BigDecimal totalValue;
    private long lowStockCount;
    private long outOfStockCount;
    private long totalMovementsToday;
}