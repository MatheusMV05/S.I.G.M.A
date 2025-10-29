package com.project.sigma.controller;

import com.project.sigma.dto.ClienteDTO;
import com.project.sigma.dto.PaginatedResponseDTO; // Importar
import com.project.sigma.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers") // MUDANÇA: de "/api/clientes" para "/api/customers"
public class ClienteController {

    private final ClienteService clienteService;

    @Autowired
    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    /**
     * Endpoint para buscar clientes, com suporte a filtros e paginação.
     * Mapeado para os parâmetros do frontend:
     * search -> searchTerm
     * customerType -> tipoCliente ("INDIVIDUAL" ou "COMPANY")
     * active -> status (true ou false)
     * page -> page
     * size -> size
     */
    @GetMapping
    public ResponseEntity<PaginatedResponseDTO<ClienteDTO>> getClientes(
            @RequestParam(value = "search", required = false) String searchTerm,
            @RequestParam(value = "customerType", required = false) String tipoCliente,
            @RequestParam(value = "active", required = false) Boolean status,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {

        PaginatedResponseDTO<ClienteDTO> response = clienteService.buscarClientes(searchTerm, tipoCliente, status, page, size);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para criar um novo cliente.
     * HTTP POST /api/customers
     */
    @PostMapping
    public ResponseEntity<ClienteDTO> criarCliente(@RequestBody ClienteDTO clienteDTO) {
        ClienteDTO novoCliente = clienteService.criarCliente(clienteDTO);
        return new ResponseEntity<>(novoCliente, HttpStatus.CREATED);
    }

    /**
     * Endpoint para atualizar um cliente existente.
     * HTTP PUT /api/customers/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ClienteDTO> atualizarCliente(@PathVariable Long id, @RequestBody ClienteDTO clienteDTO) {
        ClienteDTO clienteAtualizado = clienteService.atualizarCliente(id, clienteDTO);
        return ResponseEntity.ok(clienteAtualizado);
    }

    /**
     * Endpoint para deletar um cliente.
     * HTTP DELETE /api/customers/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarCliente(@PathVariable Long id) {
        clienteService.deletarCliente(id);
        return ResponseEntity.noContent().build();
    }
}