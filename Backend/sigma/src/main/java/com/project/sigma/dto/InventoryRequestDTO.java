package com.project.sigma.dto;
import lombok.Data;
import java.util.List;

@Data
public class InventoryRequestDTO {
    private List<InventoryItemDTO> products;

    @Data
    public static class InventoryItemDTO {
        private Long productId;
        private int countedQuantity;
    }
}
