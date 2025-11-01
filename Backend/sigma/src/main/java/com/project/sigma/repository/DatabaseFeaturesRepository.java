package com.project.sigma.repository;

import com.project.sigma.dto.AtualizacaoPrecoResultDTO;
import com.project.sigma.dto.CalculoDescontoDTO;
import com.project.sigma.dto.EstoqueBaixoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.CallableStatementCallback;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Repository para chamar funções SQL e procedimentos armazenados
 * Implementa chamadas usando CallableStatement para funções e procedimentos
 */
@Repository
public class DatabaseFeaturesRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // ================================================================
    // FUNÇÃO 1: Calcular Desconto Progressivo
    // ================================================================
    public CalculoDescontoDTO calcularDesconto(BigDecimal valorCompra) {
        String sql = "SELECT calcular_desconto(?) AS desconto_percentual";

        BigDecimal descontoPercentual = jdbcTemplate.queryForObject(
            sql,
            BigDecimal.class,
            valorCompra
        );

        // Calcular valores derivados
        BigDecimal valorDesconto = valorCompra.multiply(descontoPercentual != null ? descontoPercentual : BigDecimal.ZERO);
        BigDecimal valorFinal = valorCompra.subtract(valorDesconto);

        return new CalculoDescontoDTO(
            valorCompra,
            descontoPercentual,
            valorDesconto,
            valorFinal
        );
    }

    // ================================================================
    // FUNÇÃO 2: Verificar Estoque Disponível
    // ================================================================
    public Boolean verificarEstoqueDisponivel(Integer idProduto, Integer quantidade) {
        String sql = "SELECT verificar_estoque_disponivel(?, ?) AS disponivel";

        Integer resultado = jdbcTemplate.queryForObject(
            sql,
            Integer.class,
            idProduto,
            quantidade
        );

        return resultado != null && resultado == 1;
    }

    // ================================================================
    // PROCEDIMENTO 1: Atualizar Preços por Categoria
    // ================================================================
    public AtualizacaoPrecoResultDTO atualizarPrecosCategoria(Integer idCategoria, Double percentual) {
        return jdbcTemplate.execute(
            (Connection connection) -> {
                CallableStatement cs = connection.prepareCall("{CALL atualizar_precos_categoria(?, ?)}");
                cs.setInt(1, idCategoria);
                cs.setDouble(2, percentual);
                return cs;
            },
            (CallableStatementCallback<AtualizacaoPrecoResultDTO>) cs -> {
                boolean hasResultSet = cs.execute();
                
                if (hasResultSet) {
                    ResultSet rs = cs.getResultSet();
                    if (rs.next()) {
                        AtualizacaoPrecoResultDTO resultado = new AtualizacaoPrecoResultDTO();
                        resultado.setTotalProdutosAtualizados(rs.getInt("total_produtos_atualizados"));
                        resultado.setPercentualAplicado(rs.getDouble("percentual_aplicado"));
                        resultado.setCategoriaNome(rs.getString("categoria_nome"));
                        return resultado;
                    }
                }
                
                // Retornar objeto vazio se não houver resultado
                AtualizacaoPrecoResultDTO resultado = new AtualizacaoPrecoResultDTO();
                resultado.setTotalProdutosAtualizados(0);
                resultado.setPercentualAplicado(percentual);
                resultado.setCategoriaNome("Desconhecida");
                return resultado;
            }
        );
    }

    // ================================================================
    // PROCEDIMENTO 2: Relatório de Estoque Baixo (COM CURSOR)
    // ================================================================
    public List<EstoqueBaixoDTO> relatorioEstoqueBaixo(Integer estoqueMinimo) {
        return jdbcTemplate.execute(
            (Connection connection) -> {
                CallableStatement cs = connection.prepareCall("{CALL relatorio_estoque_baixo(?)}");
                cs.setInt(1, estoqueMinimo);
                return cs;
            },
            (CallableStatementCallback<List<EstoqueBaixoDTO>>) cs -> {
                List<EstoqueBaixoDTO> resultados = new ArrayList<>();
                boolean hasResultSet = cs.execute();
                
                if (hasResultSet) {
                    ResultSet rs = cs.getResultSet();
                    
                    while (rs.next()) {
                        EstoqueBaixoDTO dto = new EstoqueBaixoDTO();
                        dto.setIdProduto(rs.getInt("id_produto"));
                        dto.setNomeProduto(rs.getString("nome_produto"));
                        dto.setQuantidadeAtual(rs.getInt("quantidade_atual"));
                        dto.setEstoqueMinimo(rs.getInt("estoque_minimo"));
                        dto.setDeficit(rs.getInt("deficit"));
                        dto.setPrecoCusto(rs.getBigDecimal("preco_custo"));
                        dto.setValorReposicao(rs.getBigDecimal("valor_reposicao"));
                        dto.setCategoria(rs.getString("categoria"));
                        dto.setFornecedor(rs.getString("fornecedor"));
                        dto.setTelefoneFornecedor(rs.getString("telefone_fornecedor"));
                        dto.setStatusCriticidade(rs.getString("status_criticidade"));
                        dto.setAcaoRecomendada(rs.getString("acao_recomendada"));
                        resultados.add(dto);
                    }
                }
                
                return resultados;
            }
        );
    }

    // ================================================================
    // MÉTODOS AUXILIARES
    // ================================================================

    /**
     * Testa se a função calcular_desconto existe no banco
     */
    public boolean funcaoCalcularDescontoExiste() {
        try {
            String sql = "SELECT calcular_desconto(100.00)";
            jdbcTemplate.queryForObject(sql, BigDecimal.class);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Testa se a função verificar_estoque_disponivel existe no banco
     */
    public boolean funcaoVerificarEstoqueExiste() {
        try {
            String sql = "SELECT verificar_estoque_disponivel(1, 1)";
            jdbcTemplate.queryForObject(sql, Integer.class);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Testa se o procedimento atualizar_precos_categoria existe no banco
     */
    public boolean procedimentoAtualizarPrecosExiste() {
        try {
            String sql = "SHOW PROCEDURE STATUS WHERE Db = DATABASE() AND Name = 'atualizar_precos_categoria'";
            List<String> resultado = jdbcTemplate.query(sql, (rs, rowNum) -> rs.getString("Name"));
            return !resultado.isEmpty();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Testa se o procedimento relatorio_estoque_baixo existe no banco
     */
    public boolean procedimentoRelatorioEstoqueExiste() {
        try {
            String sql = "SHOW PROCEDURE STATUS WHERE Db = DATABASE() AND Name = 'relatorio_estoque_baixo'";
            List<String> resultado = jdbcTemplate.query(sql, (rs, rowNum) -> rs.getString("Name"));
            return !resultado.isEmpty();
        } catch (Exception e) {
            return false;
        }
    }
}
