package com.project.sigma.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Serviço para consultar logs de auditoria
 * Os logs são gerados automaticamente pelos triggers do banco
 */
@Service
public class AuditoriaService {

    @Autowired
    private DataSource dataSource;

    /**
     * Consulta logs de auditoria recentes (últimas N horas)
     */
    public List<Map<String, Object>> getLogsRecentes(int horas) throws SQLException {
        String sql = 
            "SELECT * FROM AuditoriaLog " +
            "WHERE data_hora >= DATE_SUB(NOW(), INTERVAL ? HOUR) " +
            "ORDER BY data_hora DESC " +
            "LIMIT 100";
        
        List<Map<String, Object>> resultados = new ArrayList<>();
        
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, horas);
            
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> log = new HashMap<>();
                    log.put("idLog", rs.getLong("id_log"));
                    log.put("tabelaAfetada", rs.getString("tabela_afetada"));
                    log.put("operacao", rs.getString("operacao"));
                    log.put("idRegistro", rs.getLong("id_registro"));
                    log.put("dadosAntigos", rs.getString("dados_antigos"));
                    log.put("dadosNovos", rs.getString("dados_novos"));
                    log.put("descricao", rs.getString("descricao"));
                    log.put("dataHora", rs.getTimestamp("data_hora"));
                    resultados.add(log);
                }
            }
        }
        
        return resultados;
    }

    /**
     * Consulta histórico de alterações de um produto específico
     */
    public List<Map<String, Object>> getHistoricoProduto(Long idProduto) throws SQLException {
        String sql = 
            "SELECT * FROM AuditoriaLog " +
            "WHERE tabela_afetada = 'Produto' " +
            "  AND id_registro = ? " +
            "ORDER BY data_hora DESC";
        
        List<Map<String, Object>> resultados = new ArrayList<>();
        
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setLong(1, idProduto);
            
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> log = new HashMap<>();
                    log.put("idLog", rs.getLong("id_log"));
                    log.put("operacao", rs.getString("operacao"));
                    log.put("dadosAntigos", rs.getString("dados_antigos"));
                    log.put("dadosNovos", rs.getString("dados_novos"));
                    log.put("descricao", rs.getString("descricao"));
                    log.put("dataHora", rs.getTimestamp("data_hora"));
                    resultados.add(log);
                }
            }
        }
        
        return resultados;
    }
}
