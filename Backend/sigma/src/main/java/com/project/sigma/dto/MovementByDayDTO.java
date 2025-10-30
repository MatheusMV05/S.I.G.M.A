package com.project.sigma.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class MovementByDayDTO {
    private LocalDate date;
    private long movements;
    private long inQuantity;
    private long outQuantity;
}
