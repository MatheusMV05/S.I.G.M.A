package com.project.sigma.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class StockMovementDTO {
    private Long id;
    private Long productId;
    private String productName; // Precisará de um JOIN
    private Long userId;
    private String userName; // Precisará de um JOIN
    private LocalDateTime date;
    private String type;
    private Integer quantity;
    private Integer stockBefore;
    private Integer stockAfter;
    private String reason;
}
