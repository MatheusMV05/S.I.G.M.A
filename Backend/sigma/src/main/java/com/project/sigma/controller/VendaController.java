package com.project.sigma.controller;

import com.project.sigma.dto.VendaRequestDTO;
import com.project.sigma.dto.VendaResponseDTO;
import com.project.sigma.model.Venda;
import com.project.sigma.service.VendaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Controlador REST para gerenciar vendas do sistema POS
 * Endpoints para criar, listar e gerenciar vendas
 */
@RestController
@RequestMapping("/api/vendas")
@CrossOrigin(origins = "*")
public class VendaController {

    @Autowired
    private VendaService vendaService;

    /**
     * Criar nova venda (PDV)
     * POST /api/vendas
     */
    @PostMapping
    public ResponseEntity<VendaResponseDTO> criarVenda(@RequestBody VendaRequestDTO vendaDTO) {
        System.out.println("🛒 POST /api/vendas - Criando nova venda");
        System.out.println("   👤 ID Funcionário: " + vendaDTO.getId_funcionario());
        System.out.println("   💳 Método de pagamento: " + vendaDTO.getMetodo_pagamento());
        System.out.println("   📦 Total de itens: " + (vendaDTO.getItens() != null ? vendaDTO.getItens().size() : 0));

        try {
            VendaResponseDTO venda = vendaService.criarVenda(vendaDTO);
            System.out.println("✅ Venda criada com sucesso - ID: " + venda.getId_venda());
            return new ResponseEntity<>(venda, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            System.err.println("❌ Erro de validação ao criar venda: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            System.err.println("❌ Erro ao criar venda: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Listar todas as vendas
     * GET /api/vendas
     */
    @GetMapping
    public ResponseEntity<List<VendaResponseDTO>> listarVendas(
            @RequestParam(required = false) Long idCliente,
            @RequestParam(required = false) Long idFuncionario,
            @RequestParam(required = false) String status
    ) {
        System.out.println("📋 GET /api/vendas - Listando vendas");
        System.out.println("   Filtros: idCliente=" + idCliente + ", idFuncionario=" + idFuncionario + ", status=" + status);

        try {
            List<VendaResponseDTO> vendas;

            if (idCliente != null) {
                vendas = vendaService.buscarVendasPorCliente(idCliente);
            } else if (idFuncionario != null) {
                vendas = vendaService.buscarVendasPorFuncionario(idFuncionario);
            } else if (status != null) {
                Venda.StatusVenda statusVenda = Venda.StatusVenda.valueOf(status.toUpperCase());
                vendas = vendaService.buscarVendasPorStatus(statusVenda);
            } else {
                vendas = vendaService.listarTodasVendas();
            }

            System.out.println("✅ Retornando " + vendas.size() + " vendas");
            return ResponseEntity.ok(vendas);
        } catch (Exception e) {
            System.err.println("❌ Erro ao listar vendas: " + e.getMessage());
            return ResponseEntity.ok(List.of());
        }
    }

    /**
     * Buscar venda por ID
     * GET /api/vendas/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<VendaResponseDTO> buscarVendaPorId(@PathVariable Long id) {
        System.out.println("🔍 GET /api/vendas/" + id + " - Buscando venda por ID");

        try {
            return vendaService.buscarVendaPorId(id)
                    .map(venda -> {
                        System.out.println("✅ Venda encontrada");
                        return ResponseEntity.ok(venda);
                    })
                    .orElseGet(() -> {
                        System.out.println("❌ Venda não encontrada com ID: " + id);
                        return ResponseEntity.notFound().build();
                    });
        } catch (Exception e) {
            System.err.println("❌ Erro ao buscar venda: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Buscar vendas do dia atual
     * GET /api/vendas/hoje
     */
    @GetMapping("/hoje")
    public ResponseEntity<List<VendaResponseDTO>> buscarVendasHoje() {
        System.out.println("📅 GET /api/vendas/hoje - Buscando vendas do dia");

        try {
            LocalDateTime inicioDia = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
            LocalDateTime fimDia = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);

            List<VendaResponseDTO> vendas = vendaService.buscarVendasPorPeriodo(inicioDia, fimDia);
            System.out.println("✅ Retornando " + vendas.size() + " vendas do dia");
            return ResponseEntity.ok(vendas);
        } catch (Exception e) {
            System.err.println("❌ Erro ao buscar vendas do dia: " + e.getMessage());
            return ResponseEntity.ok(List.of());
        }
    }

    /**
     * Buscar vendas por período
     * GET /api/vendas/periodo?inicio=...&fim=...
     */
    @GetMapping("/periodo")
    public ResponseEntity<List<VendaResponseDTO>> buscarVendasPorPeriodo(
            @RequestParam String inicio,
            @RequestParam String fim
    ) {
        System.out.println("📊 GET /api/vendas/periodo - Buscando vendas por período");
        System.out.println("   Período: " + inicio + " até " + fim);

        try {
            LocalDateTime dataInicio = LocalDateTime.parse(inicio);
            LocalDateTime dataFim = LocalDateTime.parse(fim);

            List<VendaResponseDTO> vendas = vendaService.buscarVendasPorPeriodo(dataInicio, dataFim);
            System.out.println("✅ Retornando " + vendas.size() + " vendas no período");
            return ResponseEntity.ok(vendas);
        } catch (Exception e) {
            System.err.println("❌ Erro ao buscar vendas por período: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Cancelar uma venda
     * PATCH /api/vendas/{id}/cancelar
     */
    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<VendaResponseDTO> cancelarVenda(
            @PathVariable Long id,
            @RequestBody(required = false) String motivo
    ) {
        System.out.println("❌ PATCH /api/vendas/" + id + "/cancelar - Cancelando venda");
        System.out.println("   Motivo: " + motivo);

        try {
            VendaResponseDTO venda = vendaService.cancelarVenda(id, motivo);
            System.out.println("✅ Venda cancelada com sucesso");
            return ResponseEntity.ok(venda);
        } catch (IllegalArgumentException e) {
            System.err.println("❌ Erro ao cancelar venda: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            System.err.println("❌ Erro ao cancelar venda: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Obter estatísticas de vendas
     * GET /api/vendas/estatisticas
     */
    @GetMapping("/estatisticas")
    public ResponseEntity<?> obterEstatisticas(
            @RequestParam(required = false) String dataInicio,
            @RequestParam(required = false) String dataFim
    ) {
        System.out.println("📈 GET /api/vendas/estatisticas - Obtendo estatísticas");

        try {
            LocalDateTime inicio = dataInicio != null ?
                    LocalDateTime.parse(dataInicio) :
                    LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0);

            LocalDateTime fim = dataFim != null ?
                    LocalDateTime.parse(dataFim) :
                    LocalDateTime.now();

            var estatisticas = vendaService.obterEstatisticas(inicio, fim);
            System.out.println("✅ Estatísticas obtidas com sucesso");
            return ResponseEntity.ok(estatisticas);
        } catch (Exception e) {
            System.err.println("❌ Erro ao obter estatísticas: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}