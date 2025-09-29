package com.project.sigma.controller;

import com.project.sigma.dto.CreateCategoriaRequest;
import com.project.sigma.dto.UpdateCategoriaRequest;
import com.project.sigma.dto.CategoriaResponse;
import com.project.sigma.model.Categoria;
import com.project.sigma.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = "*")
public class CategoriaController {

    private final CategoriaService categoriaService;

    @Autowired
    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @GetMapping
    public List<Categoria> getAllCategorias() {
        System.out.println("📂 GET /api/categorias - Listando todas as categorias");
        try {
            List<Categoria> categorias = categoriaService.listarTodas();
            System.out.println("✅ Retornando " + categorias.size() + " categorias");
            return categorias;
        } catch (Exception e) {
            System.out.println("❌ Erro ao listar categorias: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Categoria> getCategoriaById(@PathVariable Long id) {
        System.out.println("🔍 GET /api/categorias/" + id + " - Buscando categoria por ID");
        try {
            return categoriaService.buscarPorId(id)
                    .map(categoria -> {
                        System.out.println("✅ Categoria encontrada: " + categoria.getNome());
                        return ResponseEntity.ok(categoria);
                    })
                    .orElseGet(() -> {
                        System.out.println("❌ Categoria não encontrada com ID: " + id);
                        return ResponseEntity.notFound().build();
                    });
        } catch (Exception e) {
            System.out.println("❌ Erro ao buscar categoria: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * Criar nova categoria
     * POST /api/categorias
     */
    @PostMapping
    public ResponseEntity<CategoriaResponse> criarCategoria(@RequestBody CreateCategoriaRequest request) {
        System.out.println("➕ POST /api/categorias - Criando nova categoria: " + request.getNome());
        try {
            CategoriaResponse response = categoriaService.criarCategoria(request);
            System.out.println("✅ Categoria criada com sucesso - ID: " + response.getIdCategoria());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            System.out.println("❌ Erro de validação: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.out.println("❌ Erro ao criar categoria: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * Atualizar categoria existente
     * PUT /api/categorias/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<CategoriaResponse> atualizarCategoria(
            @PathVariable Long id,
            @RequestBody UpdateCategoriaRequest request) {
        System.out.println("✏️ PUT /api/categorias/" + id + " - Atualizando categoria");
        try {
            CategoriaResponse response = categoriaService.atualizarCategoria(id, request);
            System.out.println("✅ Categoria atualizada com sucesso: " + response.getNome());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("❌ Erro ao atualizar categoria: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * Excluir categoria
     * DELETE /api/categorias/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirCategoria(@PathVariable Long id) {
        System.out.println("🗑️ DELETE /api/categorias/" + id + " - Excluindo categoria");
        try {
            categoriaService.excluirCategoria(id);
            System.out.println("✅ Categoria excluída com sucesso");
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            System.out.println("❌ Erro ao excluir categoria: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * Alterar status da categoria (ativar/desativar)
     * PATCH /api/categorias/{id}/status
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<CategoriaResponse> alterarStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> statusRequest) {
        System.out.println("🔄 PATCH /api/categorias/" + id + "/status - Alterando status");
        try {
            Boolean ativo = statusRequest.get("ativo");
            System.out.println("📝 Novo status: " + ativo);
            CategoriaResponse response = categoriaService.alterarStatus(id, ativo);
            System.out.println("✅ Status alterado com sucesso");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("❌ Erro ao alterar status: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * Buscar categorias por status
     * GET /api/categorias/status/{ativo}
     */
    @GetMapping("/status/{ativo}")
    public ResponseEntity<List<CategoriaResponse>> listarPorStatus(@PathVariable Boolean ativo) {
        List<CategoriaResponse> categorias = categoriaService.listarPorStatus(ativo);
        return ResponseEntity.ok(categorias);
    }

    /**
     * Buscar categorias com filtros
     * GET /api/categorias/buscar?nome=...&ativo=...
     */
    @GetMapping("/buscar")
    public ResponseEntity<List<CategoriaResponse>> buscarCategorias(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) Boolean ativo) {

        if (nome != null && ativo != null) {
            List<CategoriaResponse> categorias = categoriaService.buscarPorNomeEStatus(nome, ativo);
            return ResponseEntity.ok(categorias);
        } else if (ativo != null) {
            List<CategoriaResponse> categorias = categoriaService.listarPorStatus(ativo);
            return ResponseEntity.ok(categorias);
        } else {
            // Se não há filtros específicos, retorna todas as ativas
            List<Categoria> categorias = categoriaService.listarTodas();
            return ResponseEntity.ok(categorias.stream()
                    .map(this::toResponse)
                    .collect(java.util.stream.Collectors.toList()));
        }
    }

    /**
     * Método auxiliar para converter Categoria em CategoriaResponse
     */
    private CategoriaResponse toResponse(Categoria categoria) {
        CategoriaResponse response = new CategoriaResponse();
        response.setIdCategoria(categoria.getId_categoria());
        response.setNome(categoria.getNome());
        response.setDescricao(categoria.getDescricao());
        // Convert StatusCategoria enum to Boolean
        response.setAtivo(categoria.getStatus() == Categoria.StatusCategoria.ATIVA);
        // These fields are not available in the current model
        response.setDataCriacao(null);
        response.setDataAtualizacao(null);
        return response;
    }

    /**
     * Endpoint de debug para verificar estrutura JSON
     * GET /api/categorias/debug
     */
    @GetMapping("/debug")
    public ResponseEntity<Map<String, Object>> debugCategorias() {
        System.out.println("🔧 DEBUG /api/categorias/debug - Verificando estrutura JSON");
        try {
            List<Categoria> categorias = categoriaService.listarTodas();
            Map<String, Object> debug = new HashMap<>();

            debug.put("total", categorias.size());
            debug.put("categorias", categorias);

            if (!categorias.isEmpty()) {
                Categoria primeira = categorias.get(0);
                debug.put("primeira_categoria_estrutura", Map.of(
                        "id_categoria", primeira.getId_categoria(),
                        "nome", primeira.getNome(),
                        "descricao", primeira.getDescricao(),
                        "status", primeira.getStatus(),
                        "ativo", primeira.getStatus() == Categoria.StatusCategoria.ATIVA
                ));

                System.out.println("🔍 Primeira categoria:");
                System.out.println("   ID: " + primeira.getId_categoria());
                System.out.println("   Nome: " + primeira.getNome());
                System.out.println("   Status: " + primeira.getStatus());
                System.out.println("   Ativo: " + (primeira.getStatus() == Categoria.StatusCategoria.ATIVA));
            }

            return ResponseEntity.ok(debug);
        } catch (Exception e) {
            System.out.println("❌ Erro no debug: " + e.getMessage());
            Map<String, Object> error = Map.of("erro", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Endpoint específico para frontend - força estrutura JSON correta
     * GET /api/categorias/list
     */
    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> getCategoriasForFrontend() {
        System.out.println("🎯 GET /api/categorias/list - Endpoint específico para frontend");
        try {
            List<Categoria> categorias = categoriaService.listarTodas();

            // Forçar estrutura JSON explícita para o frontend
            List<Map<String, Object>> categoriasFormatadas = categorias.stream()
                    .map(categoria -> {
                        Map<String, Object> item = new HashMap<>();
                        item.put("id_categoria", categoria.getId_categoria());
                        item.put("nome", categoria.getNome());
                        item.put("descricao", categoria.getDescricao());
                        item.put("status", categoria.getStatus().name());
                        item.put("ativo", categoria.getStatus() == Categoria.StatusCategoria.ATIVA);
                        // These fields are not available in current model
                        item.put("data_criacao", null);
                        item.put("data_atualizacao", null);
                        return item;
                    })
                    .collect(java.util.stream.Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("total", categorias.size());
            response.put("data", categoriasFormatadas);

            System.out.println("✅ Retornando " + categorias.size() + " categorias formatadas para frontend");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.out.println("❌ Erro ao buscar categorias para frontend: " + e.getMessage());

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", e.getMessage());
            errorResponse.put("data", java.util.Collections.emptyList());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}