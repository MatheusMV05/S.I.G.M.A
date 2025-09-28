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

    /**
     * Endpoint unificado para buscar funcionários.
     * Suporta busca de todos ou por cargo.
     * Exemplos:
     * GET /api/funcionarios -> Lista todos
     * GET /api/funcionarios?cargo=Gerente -> Filtra por cargo
     */
    @GetMapping
    public ResponseEntity<List<FuncionarioDTO>> getFuncionarios(
            @RequestParam(value = "cargo", required = false) String cargo) {
        // Chamando o novo método do service
        List<FuncionarioDTO> funcionarios = funcionarioService.buscarFuncionarios(cargo);
        return ResponseEntity.ok(funcionarios);
    }

    /**
     * Endpoint para buscar um funcionário específico por ID.
     * GET /api/funcionarios/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<FuncionarioDTO> getFuncionarioPorId(@PathVariable Long id) {
        // Chamando o novo método do service para buscar um único funcionário
        return funcionarioService.buscarUmFuncionarioPorId(id)
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
