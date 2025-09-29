package com.project.sigma.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
public class CategoriaController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getCategories(
        @RequestParam(required = false, defaultValue = "true") Boolean active
    ) {
        String sql = "SELECT id_categoria as id, nome, descricao, ativo FROM Categoria";
        if (active != null) {
            sql += " WHERE ativo = ?";
            List<Map<String, Object>> categories = jdbcTemplate.queryForList(sql, active);
            return ResponseEntity.ok(categories);
        } else {
            List<Map<String, Object>> categories = jdbcTemplate.queryForList(sql);
            return ResponseEntity.ok(categories);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getCategoryById(@PathVariable Integer id) {
        String sql = "SELECT id_categoria as id, nome, descricao, ativo FROM Categoria WHERE id_categoria = ?";
        try {
            Map<String, Object> category = jdbcTemplate.queryForMap(sql, id);
            return ResponseEntity.ok(category);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
