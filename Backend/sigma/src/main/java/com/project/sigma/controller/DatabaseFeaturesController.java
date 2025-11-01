package com.project.sigma.controller;

import com.project.sigma.dto.*;
import com.project.sigma.service.DatabaseFeaturesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller para Database Features (Funções, Procedimentos e Logs)
 * Expõe endpoints REST para executar funções SQL, procedimentos armazenados e consultar logs de auditoria
 */
@RestController
@RequestMapping("/api/database-features")
@CrossOrigin(origins = "*")
public class DatabaseFeaturesController {

    @Autowired
    private DatabaseFeaturesService databaseFeaturesService;

    /**
     * FUNÇÃO 1: Calcular desconto progressivo
     * GET /api/database-features/calcular-desconto/{valor}
     * @param valor Valor da compra para calcular desconto
     */
    @GetMapping("/calcular-desconto/{valor}")
    public ResponseEntity<CalculoDescontoDTO> calcularDesconto(@PathVariable BigDecimal valor) {
        System.out.println("🔢 GET /api/database-features/calcular-desconto/" + valor + " - Calculando desconto");
        try {
            CalculoDescontoDTO resultado = databaseFeaturesService.calcularDesconto(valor);
            System.out.println("✅ Desconto calculado: " + (resultado.getDescontoPercentual().multiply(BigDecimal.valueOf(100))) + "%");
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            System.out.println("❌ Erro ao calcular desconto: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Erro ao executar função calcular_desconto", e);
        }
    }

    /**
     * FUNÇÃO 2: Verificar estoque disponível
     * GET /api/database-features/verificar-estoque
     * @param idProduto ID do produto
     * @param quantidade Quantidade desejada
     */
    @GetMapping("/verificar-estoque")
    public ResponseEntity<Map<String, Object>> verificarEstoque(
            @RequestParam Integer idProduto,
            @RequestParam Integer quantidade) {
        
        System.out.println("🔢 GET /api/database-features/verificar-estoque - Produto: " + idProduto + ", Qtd: " + quantidade);
        try {
            boolean disponivel = databaseFeaturesService.verificarEstoqueDisponivel(idProduto, quantidade);
            
            Map<String, Object> resultado = new HashMap<>();
            resultado.put("idProduto", idProduto);
            resultado.put("quantidadeSolicitada", quantidade);
            resultado.put("disponivel", disponivel);
            resultado.put("mensagem", disponivel ? 
                "Estoque suficiente para a operação" : 
                "Estoque insuficiente para a operação");
            
            System.out.println("✅ Verificação concluída: " + (disponivel ? "DISPONÍVEL" : "INDISPONÍVEL"));
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            System.out.println("❌ Erro ao verificar estoque: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Erro ao executar função verificar_estoque_disponivel", e);
        }
    }

    /**
     * PROCEDIMENTO 1: Atualizar preços por categoria
     * POST /api/database-features/atualizar-precos-categoria
     * @param idCategoria ID da categoria
     * @param percentual Percentual de reajuste (positivo para aumento, negativo para desconto)
     */
    @PostMapping("/atualizar-precos-categoria")
    public ResponseEntity<AtualizacaoPrecoResultDTO> atualizarPrecosCategoria(
            @RequestParam Integer idCategoria,
            @RequestParam Double percentual) {
        
        System.out.println("⚙️ POST /api/database-features/atualizar-precos-categoria - Categoria: " + idCategoria + ", Percentual: " + percentual + "%");
        try {
            AtualizacaoPrecoResultDTO resultado = databaseFeaturesService.atualizarPrecosCategoria(idCategoria, percentual);
            System.out.println("✅ Procedimento executado: " + resultado.getTotalProdutosAtualizados() + " produtos atualizados");
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            System.out.println("❌ Erro ao atualizar preços: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Erro ao executar procedimento atualizar_precos_categoria", e);
        }
    }

    /**
     * PROCEDIMENTO 2: Relatório de estoque baixo (COM CURSOR)
     * GET /api/database-features/estoque-baixo
     * @param estoqueMinimo Nível mínimo de estoque para considerar no relatório
     */
    @GetMapping("/estoque-baixo")
    public ResponseEntity<List<EstoqueBaixoDTO>> relatorioEstoqueBaixo(
            @RequestParam(defaultValue = "10") Integer estoqueMinimo) {
        
        System.out.println("⚙️ GET /api/database-features/estoque-baixo - Estoque mínimo: " + estoqueMinimo);
        try {
            List<EstoqueBaixoDTO> resultado = databaseFeaturesService.relatorioEstoqueBaixo(estoqueMinimo);
            System.out.println("✅ Procedimento executado: " + resultado.size() + " produtos com estoque baixo");
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            System.out.println("❌ Erro ao gerar relatório de estoque baixo: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Erro ao executar procedimento relatorio_estoque_baixo", e);
        }
    }

    /**
     * LOGS: Buscar logs de auditoria com filtros
     * GET /api/database-features/logs
     * @param tabela Filtro opcional por tabela
     * @param operacao Filtro opcional por operação (INSERT, UPDATE, DELETE)
     * @param dataInicio Filtro opcional de data inicial
     * @param dataFim Filtro opcional de data final
     * @param limit Limite de registros (padrão: 100)
     */
    @GetMapping("/logs")
    public ResponseEntity<List<LogAuditoriaDTO>> getLogs(
            @RequestParam(required = false) String tabela,
            @RequestParam(required = false) String operacao,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFim,
            @RequestParam(defaultValue = "100") int limit) {
        
        System.out.println("📋 GET /api/database-features/logs - Consultando logs de auditoria");
        System.out.println("   Filtros: tabela=" + tabela + ", operacao=" + operacao + ", limit=" + limit);
        
        try {
            List<LogAuditoriaDTO> resultado = databaseFeaturesService.getLogsAuditoria(
                tabela, operacao, dataInicio, dataFim, limit
            );
            System.out.println("✅ Retornando " + resultado.size() + " logs");
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            System.out.println("❌ Erro ao consultar logs: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Erro ao buscar logs de auditoria", e);
        }
    }

    /**
     * LOGS: Buscar logs recentes (últimas 24h)
     * GET /api/database-features/logs/recentes
     */
    @GetMapping("/logs/recentes")
    public ResponseEntity<List<LogAuditoriaDTO>> getLogsRecentes() {
        System.out.println("📋 GET /api/database-features/logs/recentes - Consultando logs das últimas 24h");
        try {
            List<LogAuditoriaDTO> resultado = databaseFeaturesService.getLogsRecentes();
            System.out.println("✅ Retornando " + resultado.size() + " logs recentes");
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            System.out.println("❌ Erro ao consultar logs recentes: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Erro ao buscar logs recentes", e);
        }
    }

    /**
     * LOGS: Buscar logs por tabela específica
     * GET /api/database-features/logs/tabela/{tabela}
     */
    @GetMapping("/logs/tabela/{tabela}")
    public ResponseEntity<List<LogAuditoriaDTO>> getLogsPorTabela(
            @PathVariable String tabela,
            @RequestParam(defaultValue = "50") int limit) {
        
        System.out.println("📋 GET /api/database-features/logs/tabela/" + tabela + " - Limit: " + limit);
        try {
            List<LogAuditoriaDTO> resultado = databaseFeaturesService.getLogsPorTabela(tabela, limit);
            System.out.println("✅ Retornando " + resultado.size() + " logs da tabela " + tabela);
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            System.out.println("❌ Erro ao consultar logs da tabela: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Erro ao buscar logs da tabela " + tabela, e);
        }
    }

    /**
     * LOGS: Buscar logs de um registro específico
     * GET /api/database-features/logs/registro
     */
    @GetMapping("/logs/registro")
    public ResponseEntity<List<LogAuditoriaDTO>> getLogsPorRegistro(
            @RequestParam String tabela,
            @RequestParam Integer registroId) {
        
        System.out.println("📋 GET /api/database-features/logs/registro - Tabela: " + tabela + ", ID: " + registroId);
        try {
            List<LogAuditoriaDTO> resultado = databaseFeaturesService.getLogsPorRegistro(tabela, registroId);
            System.out.println("✅ Retornando " + resultado.size() + " logs do registro");
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            System.out.println("❌ Erro ao consultar logs do registro: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Erro ao buscar logs do registro", e);
        }
    }
}
