package com.project.sigma.controller;

import com.project.sigma.dto.FuncionarioDTO;
import com.project.sigma.service.FuncionarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/funcionarios")
@CrossOrigin(origins = "*")
public class FuncionarioController {

    @Autowired
    private FuncionarioService funcionarioService;

    /**
     * Cria um novo funcionário
     * POST /api/funcionarios
     */
    @PostMapping
    public ResponseEntity<?> criarFuncionario(@RequestBody FuncionarioDTO funcionarioDTO) {
        try {
            FuncionarioDTO novoFuncionario = funcionarioService.criarFuncionario(funcionarioDTO);
            return new ResponseEntity<>(novoFuncionario, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao criar funcionário: " + e.getMessage()));
        }
    }

    /**
     * Lista funcionários com filtros opcionais
     * GET /api/funcionarios
     * GET /api/funcionarios?cargo=Vendedor
     * GET /api/funcionarios?setor=Vendas
     * GET /api/funcionarios?status=ATIVO
     */
    @GetMapping
    public ResponseEntity<List<FuncionarioDTO>> getFuncionarios(
            @RequestParam(value = "cargo", required = false) String cargo,
            @RequestParam(value = "setor", required = false) String setor,
            @RequestParam(value = "status", required = false) String status) {
        
        List<FuncionarioDTO> funcionarios;
        
        if (setor != null && !setor.isEmpty()) {
            funcionarios = funcionarioService.buscarPorSetor(setor);
        } else {
            funcionarios = funcionarioService.buscarFuncionarios(cargo);
        }
        
        return ResponseEntity.ok(funcionarios);
    }

    /**
     * Busca funcionários ativos (para dropdowns)
     * GET /api/funcionarios/ativos
     */
    @GetMapping("/ativos")
    public ResponseEntity<List<FuncionarioDTO>> listarFuncionariosAtivos() {
        List<FuncionarioDTO> funcionarios = funcionarioService.buscarFuncionarios(null);
        List<FuncionarioDTO> ativos = funcionarios.stream()
                .filter(f -> "ATIVO".equals(f.getStatus()))
                .toList();
        return ResponseEntity.ok(ativos);
    }

    /**
     * Busca um funcionário por ID
     * GET /api/funcionarios/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<FuncionarioDTO> getFuncionarioPorId(@PathVariable Long id) {
        return funcionarioService.buscarUmFuncionarioPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Busca funcionário por matrícula
     * GET /api/funcionarios/matricula/{matricula}
     */
    @GetMapping("/matricula/{matricula}")
    public ResponseEntity<FuncionarioDTO> buscarPorMatricula(@PathVariable String matricula) {
        return funcionarioService.buscarPorMatricula(matricula)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Atualiza um funcionário
     * PUT /api/funcionarios/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarFuncionario(
            @PathVariable Long id, 
            @RequestBody FuncionarioDTO funcionarioDTO) {
        try {
            FuncionarioDTO funcionarioAtualizado = funcionarioService.atualizarFuncionario(id, funcionarioDTO);
            return ResponseEntity.ok(funcionarioAtualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao atualizar funcionário: " + e.getMessage()));
        }
    }

    /**
     * Deleta um funcionário
     * DELETE /api/funcionarios/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarFuncionario(@PathVariable Long id) {
        try {
            funcionarioService.deletarFuncionario(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao deletar funcionário: " + e.getMessage()));
        }
    }

    /**
     * Altera o status de um funcionário (ativa/desativa)
     * PATCH /api/funcionarios/{id}/status
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> alterarStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body) {
        try {
            Boolean ativo = body.get("ativo");
            if (ativo == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Campo 'ativo' é obrigatório"));
            }
            
            FuncionarioDTO funcionario = funcionarioService.buscarUmFuncionarioPorId(id)
                    .orElseThrow(() -> new IllegalArgumentException("Funcionário não encontrado"));
            
            funcionario.setStatus(ativo ? "ATIVO" : "INATIVO");
            FuncionarioDTO atualizado = funcionarioService.atualizarFuncionario(id, funcionario);
            
            return ResponseEntity.ok(atualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao alterar status: " + e.getMessage()));
        }
    }

    /**
     * Busca estatísticas por setor
     * GET /api/funcionarios/stats/setor
     */
    @GetMapping("/stats/setor")
    public ResponseEntity<?> getStatsPorSetor() {
        try {
            // Buscar todos e agrupar por setor
            List<FuncionarioDTO> todos = funcionarioService.buscarFuncionarios(null);
            Map<String, Map<String, Object>> statsPorSetor = new java.util.HashMap<>();
            
            for (FuncionarioDTO func : todos) {
                String setor = func.getSetor() != null ? func.getSetor() : "SEM SETOR";
                statsPorSetor.putIfAbsent(setor, new java.util.HashMap<>());
                Map<String, Object> stats = statsPorSetor.get(setor);
                
                int total = (int) stats.getOrDefault("total", 0) + 1;
                stats.put("total", total);
                
                if ("ATIVO".equals(func.getStatus())) {
                    int ativos = (int) stats.getOrDefault("ativos", 0) + 1;
                    stats.put("ativos", ativos);
                }
            }
            
            return ResponseEntity.ok(statsPorSetor);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao buscar estatísticas: " + e.getMessage()));
        }
    }
}
