package com.project.sigma.controller;

import com.project.sigma.dto.ClienteVIPDTO;
import com.project.sigma.dto.ProdutoAcimaMediaDTO;
import com.project.sigma.dto.ProdutoNuncaVendidoDTO;
import com.project.sigma.service.RelatorioAvancadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/relatorios")
public class RelatorioAvancadoController {

    @Autowired
    private RelatorioAvancadoService relatorioService;

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
