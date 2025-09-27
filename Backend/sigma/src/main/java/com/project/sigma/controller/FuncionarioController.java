package com.project.sigma.controller;

import com.project.sigma.dto.FuncionarioDTO;
import com.project.sigma.service.FuncionarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/funcionarios")
public class FuncionarioController {

    @Autowired
    private FuncionarioService funcionarioService;

    // Endpoint 1: Criar um novo funcionário (POST)
    @PostMapping
    public ResponseEntity<FuncionarioDTO> criarFuncionario(@RequestBody FuncionarioDTO funcionarioDTO) {
        FuncionarioDTO novoFuncionario = funcionarioService.criarFuncionario(funcionarioDTO);
        return new ResponseEntity<>(novoFuncionario, HttpStatus.CREATED);
    }

    // Endpoint 2: Listar todos os funcionários (GET)
    @GetMapping
    public ResponseEntity<List<FuncionarioDTO>> listarTodosFuncionarios() {
        List<FuncionarioDTO> funcionarios = funcionarioService.listarTodos();
        return ResponseEntity.ok(funcionarios);
    }

    // Endpoint 3: Buscar um funcionário por ID (GET)
    @GetMapping("/{id}")
    public ResponseEntity<FuncionarioDTO> buscarFuncionarioPorId(@PathVariable Long id) {
        return funcionarioService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Endpoint 4: Atualizar um funcionário (PUT)
    @PutMapping("/{id}")
    public ResponseEntity<FuncionarioDTO> atualizarFuncionario(@PathVariable Long id, @RequestBody FuncionarioDTO funcionarioDTO) {
        FuncionarioDTO funcionarioAtualizado = funcionarioService.atualizarFuncionario(id, funcionarioDTO);
        return ResponseEntity.ok(funcionarioAtualizado);
    }

    // Endpoint 5: Deletar um funcionário (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarFuncionario(@PathVariable Long id) {
        funcionarioService.deletarFuncionario(id);
        return ResponseEntity.noContent().build();
    }
}
