package com.project.sigma.controller;

import com.project.sigma.dto.*;
import com.project.sigma.model.MovimentacaoEstoque;
import com.project.sigma.model.Produto;
import com.project.sigma.service.StockService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import jakarta.validation.Valid;
import com.project.sigma.dto.InventoryRequestDTO;
import com.project.sigma.dto.MovementReportDTO;
import com.project.sigma.dto.PaginatedResponseDTO;
import com.project.sigma.dto.StockMovementDTO;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Map;

@RestController
@RequestMapping("/api/stock") // O frontend usa /stock, ajuste o CorsConfig ou SecurityConfig
public class StockController {

    @Autowired
    private StockService stockService;

    /**
     * Endpoint GET /movements (com filtros e paginação)
     * Corresponde a getStockMovements do frontend
     */
    @GetMapping("/movements")
    public ResponseEntity<PaginatedResponseDTO<StockMovementDTO>> getStockMovements(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) Long productId,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {

        return ResponseEntity.ok(stockService.getStockMovements(
                page, size, productId, type, userId, startDate, endDate
        ));
    }

    /**
     * Endpoint GET /products/{productId}/history (com filtros e paginação)
     * Corresponde a getProductStockHistory do frontend
     */
    @GetMapping("/products/{productId}/history")
    public ResponseEntity<PaginatedResponseDTO<StockMovementDTO>> getProductStockHistory(
            @PathVariable Long productId,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {

        return ResponseEntity.ok(stockService.getProductStockHistory(
                productId, page, size, startDate, endDate
        ));
    }

    /**
     * Endpoint POST /inventory
     * Corresponde a performInventory do frontend
     */
    @PostMapping("/inventory")
    public ResponseEntity<Map<String, Object>> performInventory(@RequestBody @Valid InventoryRequestDTO request) {
        return ResponseEntity.ok(stockService.performInventory(request));
    }

    /**
     * Endpoint GET /reports/movements
     * Corresponde a getMovementReport do frontend
     */
    @GetMapping("/reports/movements")
    public ResponseEntity<MovementReportDTO> getMovementReport(
            @RequestParam String startDate,
            @RequestParam String endDate) {

        return ResponseEntity.ok(stockService.getMovementReport(startDate, endDate));
    }

    // TODO: Endpoint GET /export (Implementação futura)

    /**
     * Endpoint unificado para criar qualquer movimentação manual
     * (IN, OUT, ADJUSTMENT, LOSS, RETURN)
     */
    @PostMapping("/movements")
    public ResponseEntity<MovimentacaoEstoque> createStockMovement(@Valid @RequestBody CreateStockMovementRequest request) {
        // Se 'request' falhar na validação (@NotNull, @Min),
        // o Spring vai automaticamente lançar uma exceção ANTES de
        // executar este método, retornando um erro 400 (Bad Request).

        MovimentacaoEstoque movimentacao = stockService.createStockMovement(request);
        return ResponseEntity.ok(movimentacao);
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<Produto>> getLowStockProducts() {
        // Idealmente, retorne List<ProdutoResponseDTO>
        return ResponseEntity.ok(stockService.getLowStockProducts());
    }

    @GetMapping("/out-of-stock")
    public ResponseEntity<List<Produto>> getOutOfStockProducts() {
        // Idealmente, retorne List<ProdutoResponseDTO>
        return ResponseEntity.ok(stockService.getOutOfStockProducts());
    }

    @GetMapping("/summary")
    public ResponseEntity<StockSummaryDTO> getStockSummary() {
        return ResponseEntity.ok(stockService.getStockSummary());
    }

    @PostMapping("/validate")
    public ResponseEntity<ValidateStockResponseDTO> validateStockAvailability(@RequestBody ValidateStockRequestDTO request) {
        return ResponseEntity.ok(stockService.validateStockAvailability(request));
    }

    // TODO: Endpoint GET /export
}
