package com.project.sigma.repository;

import com.project.sigma.dto.InventarioRentabilidadeDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.List;

/**
 * Repository para acessar a VIEW vw_inventario_rentabilidade
 * Fornece análise completa de inventário com rentabilidade
 */
@Repository
public class InventarioRentabilidadeRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Busca todos os produtos da view de inventário com rentabilidade
     */
    public List<InventarioRentabilidadeDTO> findAll() {
        String sql = "SELECT * FROM vw_inventario_rentabilidade ORDER BY produto_nome";
        return jdbcTemplate.query(sql, inventarioRowMapper());
    }

    /**
     * Busca produtos com estoque baixo ou crítico
     */
    public List<InventarioRentabilidadeDTO> findEstoqueBaixo() {
        String sql = "SELECT * FROM vw_inventario_rentabilidade " +
                     "WHERE status_estoque IN ('CRÍTICO - SEM ESTOQUE', 'ALERTA - ESTOQUE BAIXO') " +
                     "ORDER BY estoque ASC";
        return jdbcTemplate.query(sql, inventarioRowMapper());
    }

    /**
     * Busca produtos por classificação de rentabilidade
     */
    public List<InventarioRentabilidadeDTO> findByRentabilidade(String classificacao) {
        String sql = "SELECT * FROM vw_inventario_rentabilidade " +
                     "WHERE classificacao_rentabilidade = ? " +
                     "ORDER BY margem_lucro_percentual DESC";
        return jdbcTemplate.query(sql, inventarioRowMapper(), classificacao);
    }

    /**
     * Busca produtos por categoria
     */
    public List<InventarioRentabilidadeDTO> findByCategoria(Long idCategoria) {
        String sql = "SELECT * FROM vw_inventario_rentabilidade " +
                     "WHERE id_categoria = ? " +
                     "ORDER BY produto_nome";
        return jdbcTemplate.query(sql, inventarioRowMapper(), idCategoria);
    }

    /**
     * Busca produtos com alta rentabilidade (margem >= 50%)
     */
    public List<InventarioRentabilidadeDTO> findAltaRentabilidade() {
        String sql = "SELECT * FROM vw_inventario_rentabilidade " +
                     "WHERE classificacao_rentabilidade = 'ALTA RENTABILIDADE' " +
                     "ORDER BY margem_lucro_percentual DESC " +
                     "LIMIT 20";
        return jdbcTemplate.query(sql, inventarioRowMapper());
    }

    /**
     * Busca produtos com rentabilidade crítica (margem < 15%)
     */
    public List<InventarioRentabilidadeDTO> findRentabilidadeCritica() {
        String sql = "SELECT * FROM vw_inventario_rentabilidade " +
                     "WHERE classificacao_rentabilidade IN ('RENTABILIDADE BAIXA', 'RENTABILIDADE CRÍTICA') " +
                     "ORDER BY margem_lucro_percentual ASC";
        return jdbcTemplate.query(sql, inventarioRowMapper());
    }

    /**
     * Busca produtos por fornecedor
     */
    public List<InventarioRentabilidadeDTO> findByFornecedor(Long idFornecedor) {
        String sql = "SELECT * FROM vw_inventario_rentabilidade " +
                     "WHERE id_fornecedor = ? " +
                     "ORDER BY produto_nome";
        return jdbcTemplate.query(sql, inventarioRowMapper(), idFornecedor);
    }

    /**
     * RowMapper para converter ResultSet em InventarioRentabilidadeDTO
     */
    private RowMapper<InventarioRentabilidadeDTO> inventarioRowMapper() {
        return (ResultSet rs, int rowNum) -> {
            InventarioRentabilidadeDTO dto = new InventarioRentabilidadeDTO();
            
            // Dados do Produto
            dto.setIdProduto(rs.getLong("id_produto"));
            dto.setProdutoNome(rs.getString("produto_nome"));
            dto.setMarca(rs.getString("marca"));
            dto.setDescricao(rs.getString("descricao"));
            dto.setCodigoBarras(rs.getString("codigo_barras"));
            dto.setCodigoInterno(rs.getString("codigo_interno"));
            dto.setStatusProduto(rs.getString("status_produto"));
            
            // Preços e Margens
            dto.setPrecoCusto(rs.getBigDecimal("preco_custo"));
            dto.setPrecoVenda(rs.getBigDecimal("preco_venda"));
            dto.setMargemLucroPercentual(rs.getBigDecimal("margem_lucro_percentual"));
            dto.setLucroUnitario(rs.getBigDecimal("lucro_unitario"));
            
            // Estoque
            dto.setEstoque(rs.getInt("estoque"));
            dto.setEstoqueMinimo(rs.getInt("estoque_minimo"));
            dto.setEstoqueMaximo(rs.getInt("estoque_maximo"));
            dto.setUnidadeMedida(rs.getString("unidade_medida"));
            dto.setLocalizacaoPrateleira(rs.getString("localizacao_prateleira"));
            
            // Valores Totais
            dto.setValorEstoqueCusto(rs.getBigDecimal("valor_estoque_custo"));
            dto.setValorEstoqueVenda(rs.getBigDecimal("valor_estoque_venda"));
            dto.setLucroPotencialEstoque(rs.getBigDecimal("lucro_potencial_estoque"));
            
            // Categoria
            Long idCategoria = rs.getObject("id_categoria", Long.class);
            dto.setIdCategoria(idCategoria);
            dto.setCategoriaNome(rs.getString("categoria_nome"));
            dto.setCategoriaDescricao(rs.getString("categoria_descricao"));
            dto.setStatusCategoria(rs.getString("status_categoria"));
            
            // Fornecedor
            Long idFornecedor = rs.getObject("id_fornecedor", Long.class);
            dto.setIdFornecedor(idFornecedor);
            dto.setFornecedorNome(rs.getString("fornecedor_nome"));
            dto.setFornecedorRazaoSocial(rs.getString("fornecedor_razao_social"));
            dto.setFornecedorCnpj(rs.getString("fornecedor_cnpj"));
            dto.setFornecedorTelefone(rs.getString("fornecedor_telefone"));
            dto.setFornecedorEmail(rs.getString("fornecedor_email"));
            dto.setFornecedorCidade(rs.getString("fornecedor_cidade"));
            dto.setFornecedorEstado(rs.getString("fornecedor_estado"));
            dto.setPrazoEntregaDias(rs.getObject("prazo_entrega_dias", Integer.class));
            dto.setAvaliacaoFornecedor(rs.getBigDecimal("avaliacao_fornecedor"));
            dto.setStatusFornecedor(rs.getString("status_fornecedor"));
            
            // Status e Análises
            dto.setStatusEstoque(rs.getString("status_estoque"));
            dto.setAcaoRecomendada(rs.getString("acao_recomendada"));
            dto.setClassificacaoRentabilidade(rs.getString("classificacao_rentabilidade"));
            
            Timestamp dataCadastro = rs.getTimestamp("data_cadastro");
            if (dataCadastro != null) {
                dto.setDataCadastro(dataCadastro.toLocalDateTime());
            }
            dto.setDiasDesdeCadastro(rs.getObject("dias_desde_cadastro", Integer.class));
            
            return dto;
        };
    }
}
