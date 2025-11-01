package com.project.sigma.controller;

import com.project.sigma.dto.*;
import com.project.sigma.service.AdvancedQueriesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Controller para consultas avançadas e views
 * Expõe endpoints REST para as consultas SQL avançadas (ANTI JOIN, FULL OUTER, SUBCONSULTAS) e VIEWS
 */
@RestController
@RequestMapping("/api/advanced-queries")
@CrossOrigin(origins = "*")
public class AdvancedQueriesController {

    @Autowired
    private AdvancedQueriesService advancedQueriesService;

    /**
     * CONSULTA 1: Produtos que nunca foram vendidos (ANTI JOIN)
     * GET /api/advanced-queries/produtos-nunca-vendidos
     */
    @GetMapping("/produtos-nunca-vendidos")
    public ResponseEntity<List<ProdutoNuncaVendidoDTO>> getProdutosNuncaVendidos() {
        System.out.println("📊 GET /api/advanced-queries/produtos-nunca-vendidos - Consultando produtos nunca vendidos");
        try {
            List<ProdutoNuncaVendidoDTO> resultado = advancedQueriesService.getProdutosNuncaVendidos();
            System.out.println("✅ Retornando " + resultado.size() + " produtos nunca vendidos");
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            System.out.println("❌ Erro ao consultar produtos nunca vendidos: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Erro ao executar consulta de produtos nunca vendidos", e);
        }
    }

    /**
     * CONSULTA 2: Produtos e Fornecedores - FULL OUTER JOIN
     * GET /api/advanced-queries/produtos-fornecedores
     */
    @GetMapping("/produtos-fornecedores")
    public ResponseEntity<List<ProdutoFornecedorDTO>> getProdutosFornecedores() {
        System.out.println("📊 GET /api/advanced-queries/produtos-fornecedores - Consultando produtos e fornecedores (FULL OUTER JOIN)");
        try {
            List<ProdutoFornecedorDTO> resultado = advancedQueriesService.getProdutosFornecedoresFullOuter();
            System.out.println("✅ Retornando " + resultado.size() + " registros de produtos/fornecedores");
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            System.out.println("❌ Erro ao consultar produtos/fornecedores: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Erro ao executar consulta FULL OUTER JOIN", e);
        }
    }

    /**
     * CONSULTA 3: Produtos com preço acima da média (SUBCONSULTA)
     * GET /api/advanced-queries/produtos-acima-media
     */
    @GetMapping("/produtos-acima-media")
    public ResponseEntity<List<ProdutoAcimaMediaDTO>> getProdutosAcimaDaMedia() {
        System.out.println("📊 GET /api/advanced-queries/produtos-acima-media - Consultando produtos acima da média de preço");
        try {
            List<ProdutoAcimaMediaDTO> resultado = advancedQueriesService.getProdutosAcimaDaMedia();
            System.out.println("✅ Retornando " + resultado.size() + " produtos acima da média");
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            System.out.println("❌ Erro ao consultar produtos acima da média: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Erro ao executar subconsulta de produtos acima da média", e);
        }
    }

    /**
     * CONSULTA 4: Clientes VIP - compraram mais que a média (SUBCONSULTA)
     * GET /api/advanced-queries/clientes-vip
     */
    @GetMapping("/clientes-vip")
    public ResponseEntity<List<ClienteVIPDTO>> getClientesVIP() {
        System.out.println("📊 GET /api/advanced-queries/clientes-vip - Consultando clientes VIP (acima da média de compras)");
        try {
            List<ClienteVIPDTO> resultado = advancedQueriesService.getClientesVIP();
            System.out.println("✅ Retornando " + resultado.size() + " clientes VIP");
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            System.out.println("❌ Erro ao consultar clientes VIP: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Erro ao executar subconsulta de clientes VIP", e);
        }
    }

    /**
     * VIEW 1: Relatório completo de vendas
     * GET /api/advanced-queries/relatorio-vendas
     * @param dataInicio Filtro opcional de data inicial (formato: yyyy-MM-dd)
     * @param dataFim Filtro opcional de data final (formato: yyyy-MM-dd)
     */
    @GetMapping("/relatorio-vendas")
    public ResponseEntity<List<RelatorioVendaDTO>> getRelatorioVendas(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim) {
        
        System.out.println("📊 GET /api/advanced-queries/relatorio-vendas - Consultando VIEW de relatório de vendas");
        System.out.println("   Filtros: dataInicio=" + dataInicio + ", dataFim=" + dataFim);
        
        try {
            List<RelatorioVendaDTO> resultado = advancedQueriesService.getRelatorioVendas(dataInicio, dataFim);
            System.out.println("✅ Retornando " + resultado.size() + " vendas do relatório");
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            System.out.println("❌ Erro ao consultar VIEW de relatório de vendas: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Erro ao acessar VIEW vw_relatorio_vendas", e);
        }
    }

    /**
     * VIEW 2: Estoque completo com informações de categoria e fornecedor
     * GET /api/advanced-queries/estoque-completo
     * @param statusEstoque Filtro opcional: SEM ESTOQUE, ESTOQUE BAIXO, ESTOQUE ADEQUADO, ESTOQUE OK
     */
    @GetMapping("/estoque-completo")
    public ResponseEntity<List<EstoqueCompletoDTO>> getEstoqueCompleto(
            @RequestParam(required = false) String statusEstoque) {
        
        System.out.println("📊 GET /api/advanced-queries/estoque-completo - Consultando VIEW de estoque completo");
        System.out.println("   Filtro: statusEstoque=" + statusEstoque);
        
        try {
            List<EstoqueCompletoDTO> resultado = advancedQueriesService.getEstoqueCompleto(statusEstoque);
            System.out.println("✅ Retornando " + resultado.size() + " produtos do estoque");
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            System.out.println("❌ Erro ao consultar VIEW de estoque completo: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Erro ao acessar VIEW vw_estoque_completo", e);
        }
    }
}
