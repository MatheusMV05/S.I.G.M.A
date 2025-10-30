package com.project.sigma.dto;

import com.project.sigma.model.MovimentacaoEstoque;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class MovementReportDTO {
    private Map<MovimentacaoEstoque.TipoMovimentacao, MovementSummaryDTO> summary;
    private List<TopProductMovementDTO> topProducts;
    private List<MovementByDayDTO> movementsByDay;
}
