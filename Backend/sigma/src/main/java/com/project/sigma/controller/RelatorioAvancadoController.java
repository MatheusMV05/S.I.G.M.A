package com.project.sigma.controller;

import com.project.sigma.dto.ClienteVIPDTO;
import com.project.sigma.dto.ProdutoAcimaMediaDTO;
import com.project.sigma.dto.ProdutoNuncaVendidoDTO;
import com.project.sigma.service.RelatorioAvancadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/relatorios")
public class RelatorioAvancadoController {

    @Autowired
    private RelatorioAvancadoService relatorioService;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * 🔍 DIAGNÓSTICO: Verificar estatísticas de produtos e vendas
     * Endpoint: GET /api/relatorios/diagnostico-produtos
     */
    @GetMapping("/diagnostico-produtos")
    public ResponseEntity<Map<String, Object>> getDiagnosticoProdutos() {
        System.out.println("🔍 GET /api/relatorios/diagnostico-produtos - Executando diagnóstico");
        
        Map<String, Object> diagnostico = new HashMap<>();
        
        // 1. Total de produtos ativos
        Integer totalProdutosAtivos = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM Produto WHERE status = 'ATIVO'", 
            Integer.class
        );
        
        // 2. Produtos que já foram vendidos (distintos)
        Integer produtosJaVendidos = jdbcTemplate.queryForObject(
            "SELECT COUNT(DISTINCT vi.id_produto) FROM VendaItem vi INNER JOIN Produto p ON vi.id_produto = p.id_produto WHERE p.status = 'ATIVO'",
            Integer.class
        );
        
        // 3. Produtos NUNCA vendidos (usando NOT EXISTS - mais confiável)
        Integer produtosNuncaVendidos = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM Produto p WHERE p.status = 'ATIVO' AND NOT EXISTS (SELECT 1 FROM VendaItem vi WHERE vi.id_produto = p.id_produto)",
            Integer.class
        );
        
        // 4. Total de vendas
        Integer totalVendas = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM Venda",
            Integer.class
        );
        
        // 5. Total de itens vendidos
        Integer totalItensVendidos = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM VendaItem",
            Integer.class
        );
        
        diagnostico.put("totalProdutosAtivos", totalProdutosAtivos);
        diagnostico.put("produtosJaVendidos", produtosJaVendidos);
        diagnostico.put("produtosNuncaVendidos", produtosNuncaVendidos);
        diagnostico.put("totalVendas", totalVendas);
        diagnostico.put("totalItensVendidos", totalItensVendidos);
        diagnostico.put("percentualProdutosNuncaVendidos", 
            totalProdutosAtivos > 0 ? (produtosNuncaVendidos * 100.0 / totalProdutosAtivos) : 0);
        
        System.out.println("✅ Diagnóstico completo:");
        System.out.println("   - Produtos ativos: " + totalProdutosAtivos);
        System.out.println("   - Produtos já vendidos: " + produtosJaVendidos);
        System.out.println("   - Produtos NUNCA vendidos: " + produtosNuncaVendidos);
        
        return ResponseEntity.ok(diagnostico);
    }

    /**
     * Feature #6: Produtos que nunca foram vendidos (ANTI JOIN)
     * Endpoint: GET /api/relatorios/produtos-nunca-vendidos
     */
    @GetMapping("/produtos-nunca-vendidos")
    public ResponseEntity<List<ProdutoNuncaVendidoDTO>> getProdutosNuncaVendidos(
            @RequestParam(required = false, defaultValue = "10") Integer limit) {
        
        System.out.println("📊 GET /api/relatorios/produtos-nunca-vendidos - Buscando produtos parados");
        
        List<ProdutoNuncaVendidoDTO> produtos = relatorioService.buscarProdutosNuncaVendidos(limit);
        
        System.out.println("✅ Encontrados " + produtos.size() + " produtos nunca vendidos");
        return ResponseEntity.ok(produtos);
    }

    /**
     * Feature #6: Produtos com preço acima da média da categoria (SUBCONSULTA)
     * Endpoint: GET /api/relatorios/produtos-acima-media
     */
    @GetMapping("/produtos-acima-media")
    public ResponseEntity<List<ProdutoAcimaMediaDTO>> getProdutosAcimaMedia(
            @RequestParam(required = false, defaultValue = "10") Integer limit) {
        
        System.out.println("📊 GET /api/relatorios/produtos-acima-media - Buscando produtos premium");
        
        List<ProdutoAcimaMediaDTO> produtos = relatorioService.buscarProdutosAcimaMedia(limit);
        
        System.out.println("✅ Encontrados " + produtos.size() + " produtos acima da média");
        return ResponseEntity.ok(produtos);
    }

    /**
     * Feature #6: Clientes VIP do mês (SUBCONSULTA)
     * Endpoint: GET /api/relatorios/clientes-vip
     */
    @GetMapping("/clientes-vip")
    public ResponseEntity<List<ClienteVIPDTO>> getClientesVIP(
            @RequestParam(required = false, defaultValue = "10") Integer limit) {
        
        System.out.println("📊 GET /api/relatorios/clientes-vip - Buscando clientes premium");
        
        List<ClienteVIPDTO> clientes = relatorioService.buscarClientesVIP(limit);
        
        System.out.println("✅ Encontrados " + clientes.size() + " clientes VIP");
        return ResponseEntity.ok(clientes);
    }
}
