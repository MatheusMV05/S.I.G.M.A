package com.project.sigma.controller;

import com.project.sigma.dto.ClienteDTO;
import com.project.sigma.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteService clienteService;

    @Autowired
    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    /**
     * Endpoint para buscar clientes, com suporte a filtros.
     * Se nenhum parâmetro for passado, retorna todos os clientes.
     * Exemplos de uso:
     * GET /api/clientes
     * GET /api/clientes?q=Silva
     * GET /api/clientes?tipo=PF
     * GET /api/clientes?status=ativo
     * GET /api/clientes?q=joao&tipo=PF&status=ativo
     */
    @GetMapping
    public ResponseEntity<List<ClienteDTO>> getClientes(
            @RequestParam(value = "q", required = false) String searchTerm,
            @RequestParam(value = "tipo", required = false) String tipoCliente,
            @RequestParam(value = "status", required = false) String status) {
        List<ClienteDTO> clientes = clienteService.buscarClientes(searchTerm, tipoCliente, status);
        return ResponseEntity.ok(clientes);
    }

    /**
     * Endpoint para criar um novo cliente.
     * HTTP POST /api/clientes
     */
    @PostMapping
    public ResponseEntity<ClienteDTO> criarCliente(@RequestBody ClienteDTO clienteDTO) {
        ClienteDTO novoCliente = clienteService.criarCliente(clienteDTO);
        return new ResponseEntity<>(novoCliente, HttpStatus.CREATED);
    }

    /**
     * Endpoint para atualizar um cliente existente.
     * HTTP PUT /api/clientes/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ClienteDTO> atualizarCliente(@PathVariable Long id, @RequestBody ClienteDTO clienteDTO) {
        ClienteDTO clienteAtualizado = clienteService.atualizarCliente(id, clienteDTO);
        return ResponseEntity.ok(clienteAtualizado);
    }

    /**
     * Endpoint para deletar um cliente.
     * HTTP DELETE /api/clientes/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarCliente(@PathVariable Long id) {
        clienteService.deletarCliente(id);
        return ResponseEntity.noContent().build();
    }
}

