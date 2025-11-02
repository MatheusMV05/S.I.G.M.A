package com.project.sigma.controller;

import com.project.sigma.dto.FornecedorDTO;
import com.project.sigma.service.FornecedorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller REST para Fornecedores
 * Endpoints para gerenciamento de fornecedores
 */
@RestController
@RequestMapping("/api/fornecedores")
@CrossOrigin(origins = "*")
public class FornecedorController {

    @Autowired
    private FornecedorService fornecedorService;

    /**
     * Lista todos os fornecedores com filtros opcionais
     * GET /api/fornecedores
     * GET /api/fornecedores?search=termo
     * GET /api/fornecedores?status=ATIVO
     */
    @GetMapping
    public ResponseEntity<List<FornecedorDTO>> listarFornecedores(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "status", required = false) String status) {
        
        List<FornecedorDTO> fornecedores = fornecedorService.buscarFornecedores(search, status);
        return ResponseEntity.ok(fornecedores);
    }

    /**
     * Busca fornecedores ativos (para dropdowns)
     * GET /api/fornecedores/ativos
     */
    @GetMapping("/ativos")
    public ResponseEntity<List<FornecedorDTO>> listarFornecedoresAtivos() {
        List<FornecedorDTO> fornecedores = fornecedorService.buscarFornecedoresAtivos();
        return ResponseEntity.ok(fornecedores);
    }

    /**
     * Busca um fornecedor por ID
     * GET /api/fornecedores/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<FornecedorDTO> buscarPorId(@PathVariable Long id) {
        return fornecedorService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Busca fornecedor por CNPJ
     * GET /api/fornecedores/cnpj/{cnpj}
     */
    @GetMapping("/cnpj/{cnpj}")
    public ResponseEntity<FornecedorDTO> buscarPorCnpj(@PathVariable String cnpj) {
        return fornecedorService.buscarPorCnpj(cnpj)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Cria um novo fornecedor
     * POST /api/fornecedores
     */
    @PostMapping
    public ResponseEntity<FornecedorDTO> criarFornecedor(@RequestBody FornecedorDTO fornecedorDTO) {
        try {
            FornecedorDTO novoFornecedor = fornecedorService.criarFornecedor(fornecedorDTO);
            return new ResponseEntity<>(novoFornecedor, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Atualiza um fornecedor existente
     * PUT /api/fornecedores/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<FornecedorDTO> atualizarFornecedor(
            @PathVariable Long id,
            @RequestBody FornecedorDTO fornecedorDTO) {
        try {
            FornecedorDTO fornecedorAtualizado = fornecedorService.atualizarFornecedor(id, fornecedorDTO);
            return ResponseEntity.ok(fornecedorAtualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Deleta um fornecedor
     * DELETE /api/fornecedores/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarFornecedor(@PathVariable Long id) {
        try {
            fornecedorService.deletarFornecedor(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    /**
     * Altera o status de um fornecedor (ativa/desativa)
     * PATCH /api/fornecedores/{id}/status
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<FornecedorDTO> alterarStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body) {
        try {
            Boolean ativo = body.get("ativo");
            if (ativo == null) {
                return ResponseEntity.badRequest().build();
            }
            
            FornecedorDTO fornecedorAtualizado = fornecedorService.alterarStatus(id, ativo);
            return ResponseEntity.ok(fornecedorAtualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
