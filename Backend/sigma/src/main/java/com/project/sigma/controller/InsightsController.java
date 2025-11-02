package com.project.sigma.controller;

import com.project.sigma.dto.SazonalidadeDTO;
import com.project.sigma.dto.ProdutoBaixaRotatividadeDTO;
import com.project.sigma.dto.AnaliseABCDTO;
import com.project.sigma.service.InsightsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller para Insights Avançados
 * Endpoints para análises estratégicas de negócio
 */
@RestController
@RequestMapping("/api/insights")
public class InsightsController {

    @Autowired
    private InsightsService insightsService;

    /**
     * Análise de Sazonalidade - Vendas por Mês
     * GET /api/insights/sazonalidade/mensal?dias=90
     */
    @GetMapping("/sazonalidade/mensal")
    public ResponseEntity<List<SazonalidadeDTO>> getSazonalidadeMensal(
            @RequestParam(required = false, defaultValue = "90") Integer dias) {
        
        System.out.println("📊 GET /api/insights/sazonalidade/mensal - Últimos " + dias + " dias");
        
        List<SazonalidadeDTO> resultado = insightsService.analisarSazonalidadeMensal(dias);
        
        System.out.println("✅ Retornando " + resultado.size() + " períodos mensais");
        return ResponseEntity.ok(resultado);
    }

    /**
     * Análise de Sazonalidade - Vendas por Dia da Semana
     * GET /api/insights/sazonalidade/semanal?dias=60
     */
    @GetMapping("/sazonalidade/semanal")
    public ResponseEntity<List<SazonalidadeDTO>> getSazonalidadeSemanal(
            @RequestParam(required = false, defaultValue = "60") Integer dias) {
        
        System.out.println("📊 GET /api/insights/sazonalidade/semanal - Últimos " + dias + " dias");
        
        List<SazonalidadeDTO> resultado = insightsService.analisarSazonalidadeSemanal(dias);
        
        System.out.println("✅ Retornando " + resultado.size() + " dias da semana");
        return ResponseEntity.ok(resultado);
    }

    /**
     * Análise de Sazonalidade - Vendas por Hora do Dia
     * GET /api/insights/sazonalidade/horaria?dias=30
     */
    @GetMapping("/sazonalidade/horaria")
    public ResponseEntity<List<SazonalidadeDTO>> getSazonalidadeHoraria(
            @RequestParam(required = false, defaultValue = "30") Integer dias) {
        
        System.out.println("📊 GET /api/insights/sazonalidade/horaria - Últimos " + dias + " dias");
        
        List<SazonalidadeDTO> resultado = insightsService.analisarSazonalidadeHoraria(dias);
        
        System.out.println("✅ Retornando " + resultado.size() + " faixas horárias");
        return ResponseEntity.ok(resultado);
    }

    /**
     * Produtos com Baixa Rotatividade
     * GET /api/insights/produtos-baixa-rotatividade?limit=20
     */
    @GetMapping("/produtos-baixa-rotatividade")
    public ResponseEntity<List<ProdutoBaixaRotatividadeDTO>> getProdutosBaixaRotatividade(
            @RequestParam(required = false, defaultValue = "20") Integer limit) {
        
        System.out.println("📦 GET /api/insights/produtos-baixa-rotatividade - Limit: " + limit);
        
        List<ProdutoBaixaRotatividadeDTO> resultado = insightsService.buscarProdutosBaixaRotatividade(limit);
        
        System.out.println("✅ Retornando " + resultado.size() + " produtos com baixa rotatividade");
        return ResponseEntity.ok(resultado);
    }

    /**
     * Análise ABC de Produtos (Curva de Pareto)
     * GET /api/insights/analise-abc?dias=90
     */
    @GetMapping("/analise-abc")
    public ResponseEntity<List<AnaliseABCDTO>> getAnaliseABC(
            @RequestParam(required = false, defaultValue = "90") Integer dias) {
        
        System.out.println("📊 GET /api/insights/analise-abc - Últimos " + dias + " dias");
        
        List<AnaliseABCDTO> resultado = insightsService.buscarAnaliseABC(dias);
        
        System.out.println("✅ Retornando " + resultado.size() + " produtos classificados ABC");
        
        // Log de resumo
        long classA = resultado.stream().filter(p -> "A".equals(p.getClassificacaoABC())).count();
        long classB = resultado.stream().filter(p -> "B".equals(p.getClassificacaoABC())).count();
        long classC = resultado.stream().filter(p -> "C".equals(p.getClassificacaoABC())).count();
        
        System.out.println("   📈 Classe A: " + classA + " produtos (80% do faturamento)");
        System.out.println("   📊 Classe B: " + classB + " produtos (15% do faturamento)");
        System.out.println("   📉 Classe C: " + classC + " produtos (5% do faturamento)");
        
        return ResponseEntity.ok(resultado);
    }
}
