package com.project.sigma.controller;

import com.project.sigma.dto.UsuarioDTO;
import com.project.sigma.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    /**
     * Lista todos os usuários
     * GET /api/usuarios
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UsuarioDTO>> listarUsuarios(
            @RequestParam(value = "role", required = false) String role,
            @RequestParam(value = "status", required = false) String status) {
        
        try {
            List<UsuarioDTO> usuarios;
            
            if (role != null && !role.isEmpty()) {
                usuarios = usuarioService.buscarPorRole(role);
            } else if (status != null && !status.isEmpty()) {
                usuarios = usuarioService.buscarPorStatus(status);
            } else {
                usuarios = usuarioService.buscarTodos();
            }
            
            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Busca um usuário por ID
     * GET /api/usuarios/{id}
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioDTO> buscarUsuarioPorId(@PathVariable Long id) {
        return usuarioService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Cria um novo usuário
     * POST /api/usuarios
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> criarUsuario(@RequestBody UsuarioDTO usuarioDTO) {
        try {
            // Validações básicas
            if (usuarioDTO.getUsername() == null || usuarioDTO.getUsername().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Username é obrigatório"));
            }
            
            if (usuarioDTO.getPassword() == null || usuarioDTO.getPassword().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Password é obrigatório"));
            }
            
            if (usuarioDTO.getId() == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "ID do funcionário é obrigatório"));
            }
            
            if (usuarioDTO.getRole() == null || usuarioDTO.getRole().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Role é obrigatório"));
            }
            
            // Definir status padrão se não fornecido
            if (usuarioDTO.getStatus() == null || usuarioDTO.getStatus().isEmpty()) {
                usuarioDTO.setStatus("ATIVO");
            }
            
            UsuarioDTO novoUsuario = usuarioService.criarUsuario(usuarioDTO);
            return new ResponseEntity<>(novoUsuario, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao criar usuário: " + e.getMessage()));
        }
    }

    /**
     * Atualiza um usuário
     * PUT /api/usuarios/{id}
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> atualizarUsuario(
            @PathVariable Long id,
            @RequestBody UsuarioDTO usuarioDTO) {
        try {
            UsuarioDTO usuarioAtualizado = usuarioService.atualizarUsuario(id, usuarioDTO);
            return ResponseEntity.ok(usuarioAtualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao atualizar usuário: " + e.getMessage()));
        }
    }

    /**
     * Atualiza apenas o status de um usuário
     * PATCH /api/usuarios/{id}/status
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> atualizarStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            String status = body.get("status");
            if (status == null || status.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Status é obrigatório"));
            }
            
            // Validar valores de status
            if (!status.equals("ATIVO") && !status.equals("INATIVO")) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Status deve ser ATIVO ou INATIVO"));
            }
            
            usuarioService.atualizarStatus(id, status);
            
            // Retornar usuário atualizado
            return usuarioService.buscarPorId(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao atualizar status: " + e.getMessage()));
        }
    }

    /**
     * Deleta um usuário
     * DELETE /api/usuarios/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deletarUsuario(@PathVariable Long id) {
        try {
            usuarioService.deletarUsuario(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao deletar usuário: " + e.getMessage()));
        }
    }

    /**
     * Retorna estatísticas de usuários
     * GET /api/usuarios/stats
     */
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> obterEstatisticas() {
        try {
            Map<String, Object> stats = usuarioService.obterEstatisticas();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao obter estatísticas: " + e.getMessage()));
        }
    }
}
