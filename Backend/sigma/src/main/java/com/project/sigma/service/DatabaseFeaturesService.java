package com.project.sigma.service;

import com.project.sigma.dto.*;
import com.project.sigma.repository.DatabaseFeaturesRepository;
import com.project.sigma.repository.LogAuditoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Service para executar funções, procedimentos e consultar logs
 * Utiliza Repository com JDBC puro (sem JPA) conforme requisitos do projeto
 */
@Service
public class DatabaseFeaturesService {

    @Autowired
    private DatabaseFeaturesRepository databaseFeaturesRepository;

    @Autowired
    private LogAuditoriaRepository logAuditoriaRepository;

    /**
     * FUNÇÃO 1: Calcular desconto progressivo
     */
    public CalculoDescontoDTO calcularDesconto(BigDecimal valorCompra) {
        return databaseFeaturesRepository.calcularDesconto(valorCompra);
    }

    /**
     * FUNÇÃO 2: Verificar estoque disponível
     */
    public boolean verificarEstoqueDisponivel(Integer idProduto, Integer quantidade) {
        return databaseFeaturesRepository.verificarEstoqueDisponivel(idProduto, quantidade);
    }

    /**
     * PROCEDIMENTO 1: Atualizar preços por categoria
     */
    public AtualizacaoPrecoResultDTO atualizarPrecosCategoria(Integer idCategoria, Double percentual) {
        return databaseFeaturesRepository.atualizarPrecosCategoria(idCategoria, percentual);
    }

    /**
     * PROCEDIMENTO 2: Relatório de estoque baixo (COM CURSOR)
     */
    public List<EstoqueBaixoDTO> relatorioEstoqueBaixo(Integer estoqueMinimo) {
        return databaseFeaturesRepository.relatorioEstoqueBaixo(estoqueMinimo);
    }

    /**
     * Buscar logs de auditoria com filtros opcionais
     */
    public List<LogAuditoriaDTO> getLogsAuditoria(String tabela, String operacao, 
                                                   LocalDateTime dataInicio, LocalDateTime dataFim,
                                                   int limit) {
        return logAuditoriaRepository.buscarComFiltros(tabela, operacao, dataInicio, dataFim, limit);
    }

    /**
     * Buscar logs recentes (últimas 24h)
     */
    public List<LogAuditoriaDTO> getLogsRecentes() {
        return logAuditoriaRepository.buscarLogsRecentes();
    }

    /**
     * Buscar logs por tabela
     */
    public List<LogAuditoriaDTO> getLogsPorTabela(String tabela, int limit) {
        return logAuditoriaRepository.buscarPorTabela(tabela, limit);
    }

    /**
     * Buscar logs por registro específico
     */
    public List<LogAuditoriaDTO> getLogsPorRegistro(String tabela, Integer registroId) {
        return logAuditoriaRepository.buscarPorRegistro(tabela, registroId);
    }

    /**
     * Buscar logs por usuário
     */
    public List<LogAuditoriaDTO> getLogsPorUsuario(Integer idUsuario, int limit) {
        return logAuditoriaRepository.buscarPorUsuario(idUsuario, limit);
    }

    /**
     * Listar todas as tabelas que possuem logs
     */
    public List<String> listarTabelasComLogs() {
        return logAuditoriaRepository.listarTabelasComLogs();
    }

    /**
     * Contar total de logs
     */
    public Long contarTotalLogs() {
        return logAuditoriaRepository.contarTodos();
    }

    /**
     * Deletar logs antigos (mais de X dias)
     */
    public int deletarLogsAntigos(int dias) {
        return logAuditoriaRepository.deletarLogsAntigos(dias);
    }
}
