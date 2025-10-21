package com.project.sigma.controller;

import com.project.sigma.dto.CreatePromocaoRequest;
import com.project.sigma.dto.PromocaoDTO;
import com.project.sigma.service.PromocaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/promotions") // Seguindo o 'promotionService.ts' (que usa '/promotions')
public class PromocaoController {

    @Autowired
    private PromocaoService promocaoService;

    // Endpoint: POST /api/promotions
    @PostMapping
    public ResponseEntity<PromocaoDTO> createPromotion(@RequestBody CreatePromocaoRequest request) {
        PromocaoDTO createdPromocao = promocaoService.create(request);
        return ResponseEntity.created(URI.create("/api/promotions/" + createdPromocao.getId_promocao()))
                .body(createdPromocao);
    }

    // Endpoint: GET /api/promotions/{id}
    @GetMapping("/{id}")
    public ResponseEntity<PromocaoDTO> getPromotionById(@PathVariable Long id) {
        PromocaoDTO promocao = promocaoService.findById(id);
        return ResponseEntity.ok(promocao);
    }

    // Endpoint: GET /api/promotions (Simples por enquanto, sem paginação)
    // O 'promotionService.ts' espera filtros. Este é um TODO.
    @GetMapping
    public ResponseEntity<List<PromocaoDTO>> getAllPromotions() {
        // TODO: Implementar paginação e filtros (search, status, etc.)
        List<PromocaoDTO> promocoes = promocaoService.findAll();
        return ResponseEntity.ok(promocoes);
    }

    // Endpoint: PUT /api/promotions/{id}
    @PutMapping("/{id}")
    public ResponseEntity<PromocaoDTO> updatePromotion(@PathVariable Long id, @RequestBody CreatePromocaoRequest request) {
        PromocaoDTO updatedPromocao = promocaoService.update(id, request);
        return ResponseEntity.ok(updatedPromocao);
    }

    // Endpoint: DELETE /api/promotions/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePromotion(@PathVariable Long id) {
        promocaoService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // TODO: Implementar os outros endpoints do 'promotionService.ts'
    // GET /api/promotions/current
    // GET /api/promotions/product/{productId}
    // GET /api/promotions/{id}/stats
}
