package com.project.sigma.service;

import com.project.sigma.dto.SazonalidadeDTO;
import com.project.sigma.dto.ProdutoBaixaRotatividadeDTO;
import com.project.sigma.dto.AnaliseABCDTO;
import com.project.sigma.repository.InsightsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service para Insights Avançados
 * Implementa lógica de negócio para análises estratégicas
 */
@Service
public class InsightsService {

    @Autowired
    private InsightsRepository insightsRepository;

    /**
     * Análise de Sazonalidade Mensal
     */
    public List<SazonalidadeDTO> analisarSazonalidadeMensal(Integer dias) {
        System.out.println("📅 Service: Analisando sazonalidade mensal - Últimos " + dias + " dias");
        return insightsRepository.analisarSazonalidadeMensal(dias);
    }

    /**
     * Análise de Sazonalidade Semanal (por dia da semana)
     */
    public List<SazonalidadeDTO> analisarSazonalidadeSemanal(Integer dias) {
        System.out.println("📅 Service: Analisando sazonalidade semanal - Últimos " + dias + " dias");
        return insightsRepository.analisarSazonalidadeSemanal(dias);
    }

    /**
     * Análise de Sazonalidade Horária
     */
    public List<SazonalidadeDTO> analisarSazonalidadeHoraria(Integer dias) {
        System.out.println("⏰ Service: Analisando sazonalidade horária - Últimos " + dias + " dias");
        return insightsRepository.analisarSazonalidadeHoraria(dias);
    }

    /**
     * Produtos com Baixa Rotatividade
     */
    public List<ProdutoBaixaRotatividadeDTO> buscarProdutosBaixaRotatividade(Integer limit) {
        System.out.println("📦 Service: Buscando produtos com baixa rotatividade - Limit: " + limit);
        return insightsRepository.buscarProdutosBaixaRotatividade(limit);
    }

    /**
     * Análise ABC (Curva de Pareto)
     */
    public List<AnaliseABCDTO> buscarAnaliseABC(Integer dias) {
        System.out.println("📊 Service: Gerando análise ABC - Últimos " + dias + " dias");
        return insightsRepository.buscarAnaliseABC(dias);
    }
}
