package com.project.sigma.controller;

import com.project.sigma.dto.*;
import com.project.sigma.model.MovimentacaoEstoque;
import com.project.sigma.service.MovimentacaoEstoqueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/movimentacao")
@CrossOrigin(origins = "*")
public class MovimentacaoController {

    @Autowired
    private MovimentacaoEstoqueService movimentacaoService;

    /**
     * GET /api/movimentacao - Lista movimentações com paginação e filtros
     */
    @GetMapping
    public ResponseEntity<PaginatedResponseDTO<MovimentacaoEstoqueDTO>> getMovimentacoes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(required = false) Long productId,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {

        PaginatedResponseDTO<MovimentacaoEstoqueDTO> response = movimentacaoService.findAll(
                page, size, productId, type, userId, startDate, endDate
        );

        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/movimentacao/{id} - Busca movimentação por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<MovimentacaoEstoqueDTO> getMovimentacaoById(@PathVariable Long id) {
        MovimentacaoEstoqueDTO movimentacao = movimentacaoService.findById(id);
        return ResponseEntity.ok(movimentacao);
    }

    /**
     * POST /api/movimentacao - Cria nova movimentação
     */
    @PostMapping
    public ResponseEntity<MovimentacaoEstoqueDTO> createMovimentacao(
            @RequestBody CreateMovimentacaoRequest request) {

        MovimentacaoEstoqueDTO movimentacao = movimentacaoService.create(request);
        return ResponseEntity.ok(movimentacao);
    }

    /**
     * PUT /api/movimentacao/{id} - Atualiza movimentação
     */
    @PutMapping("/{id}")
    public ResponseEntity<MovimentacaoEstoqueDTO> updateMovimentacao(
            @PathVariable Long id,
            @RequestBody CreateMovimentacaoRequest request) {

        MovimentacaoEstoqueDTO movimentacao = movimentacaoService.update(id, request);
        return ResponseEntity.ok(movimentacao);
    }

    /**
     * DELETE /api/movimentacao/{id} - Deleta movimentação
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovimentacao(@PathVariable Long id) {
        movimentacaoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}