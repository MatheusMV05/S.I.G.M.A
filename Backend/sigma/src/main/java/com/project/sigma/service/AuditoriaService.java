package com.project.sigma.service;

import com.project.sigma.dto.LogAuditoriaDTO;
import com.project.sigma.repository.LogAuditoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service para consultar logs de auditoria
 * Feature #5 - Histórico de Auditoria de Produtos
 */
@Service
public class AuditoriaService {

    @Autowired
    private LogAuditoriaRepository logAuditoriaRepository;

    /**
     * Feature #5: Consulta logs de auditoria recentes (últimas N horas)
     */
    public List<LogAuditoriaDTO> getLogsRecentes(int horas) {
        System.out.println("📋 Service: Buscando logs das últimas " + horas + " horas");
        return logAuditoriaRepository.buscarLogsPorHoras(horas, 100);
    }

    /**
     * Feature #5: Consulta histórico de alterações de um produto específico
     */
    public List<LogAuditoriaDTO> getHistoricoProduto(Long idProduto) {
        System.out.println("📜 Service: Buscando histórico do produto ID: " + idProduto);
        return logAuditoriaRepository.buscarPorRegistro("Produto", idProduto.intValue());
    }

    /**
     * Busca logs por tabela
     */
    public List<LogAuditoriaDTO> getLogsPorTabela(String tabela, Integer limit) {
        return logAuditoriaRepository.buscarPorTabela(tabela, limit);
    }

    /**
     * Busca todos os logs recentes
     */
    public List<LogAuditoriaDTO> getLogsRecentes() {
        return logAuditoriaRepository.buscarLogsRecentes();
    }
}
