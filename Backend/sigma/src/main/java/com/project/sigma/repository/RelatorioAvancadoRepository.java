package com.project.sigma.repository;

import com.project.sigma.dto.ClienteVIPDTO;
import com.project.sigma.dto.ProdutoAcimaMediaDTO;
import com.project.sigma.dto.ProdutoNuncaVendidoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.util.List;

/**
 * Repository para consultas SQL avançadas (ANTI JOIN, SUBCONSULTAS)
 * Feature #6 - Insights Inteligentes em Relatórios
 */
@Repository
public class RelatorioAvancadoRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // ================================================================
    // CONSULTA 1: ANTI JOIN - Produtos que NUNCA foram vendidos
    // ================================================================
    public List<ProdutoNuncaVendidoDTO> buscarProdutosNuncaVendidos(Integer limit) {
        // Query corrigida: usa subquery para garantir que o produto NUNCA apareceu em VendaItem
        String sql = "SELECT " +
            "p.id_produto, " +
            "p.nome AS produto_nome, " +
            "p.marca, " +
            "p.preco_venda, " +
            "p.estoque AS estoque, " +
            "COALESCE(c.nome, 'Sem Categoria') AS categoria_nome, " +
            "COALESCE(f.nome_fantasia, 'Sem Fornecedor') AS fornecedor_nome, " +
            "COALESCE(p.preco_custo * p.estoque, 0) AS valor_investido, " +
            "COALESCE(p.preco_venda * p.estoque, 0) AS valor_potencial_venda, " +
            "DATEDIFF(CURDATE(), p.data_cadastro) AS dias_sem_venda " +
            "FROM Produto p " +
            "LEFT JOIN Categoria c ON p.id_categoria = c.id_categoria " +
            "LEFT JOIN Fornecedor f ON p.id_fornecedor = f.id_fornecedor " +
            "WHERE p.status = 'ATIVO' " +
            "AND NOT EXISTS ( " +
            "    SELECT 1 FROM VendaItem vi WHERE vi.id_produto = p.id_produto " +
            ") " +
            "ORDER BY valor_investido DESC, dias_sem_venda DESC " +
            "LIMIT ?";

        System.out.println(" Repository: Executando SQL - ANTI JOIN produtos nunca vendidos");
        System.out.println(" SQL: " + sql);
        System.out.println(" Limit: " + limit);
        
        try {
            List<ProdutoNuncaVendidoDTO> resultado = jdbcTemplate.query(sql, produtoNuncaVendidoRowMapper(), limit);
            
            System.out.println(" Repository: Query executada com sucesso!");
            System.out.println(" Retornando " + resultado.size() + " produtos nunca vendidos");
            
            if (resultado.isEmpty()) {
                System.out.println("⚠ ATENÇÃO: Query retornou 0 resultados! Verificar se há produtos que nunca foram vendidos.");
            } else {
                System.out.println(" IDs dos produtos encontrados:");
                resultado.forEach(p -> {
                    System.out.println("   - ID: " + p.getIdProduto() + " | " + p.getProdutoNome());
                    
                    // VALIDAÇÃO: Verificar se realmente nunca foi vendido
                    Integer vendas = jdbcTemplate.queryForObject(
                        "SELECT COUNT(*) FROM VendaItem WHERE id_produto = ?",
                        Integer.class,
                        p.getIdProduto()
                    );
                    if (vendas > 0) {
                        System.err.println("      ❌ ERRO! Este produto TEM " + vendas + " vendas! Query com bug!");
                    } else {
                        System.out.println("      ✅ Validado: 0 vendas");
                    }
                });
            }
            
            return resultado;
        } catch (Exception e) {
            System.err.println("❌ ERRO ao executar query: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    // ================================================================
    // CONSULTA 2: SUBCONSULTA - Produtos com Preço Acima da Média
    // ================================================================
    public List<ProdutoAcimaMediaDTO> buscarProdutosAcimaMedia(Integer limit) {
        String sql = "SELECT " +
            "p.id_produto, " +
            "p.nome AS produto_nome, " +
            "p.marca, " +
            "p.preco_venda, " +
            "p.preco_custo, " +
            "p.margem_lucro, " +
            "c.nome AS categoria_nome, " +
            "(SELECT ROUND(AVG(p2.preco_venda), 2) " +
            "FROM Produto p2 " +
            "WHERE p2.id_categoria = p.id_categoria " +
            "AND p2.status = 'ATIVO') AS preco_medio_categoria, " +
            "ROUND(p.preco_venda - (SELECT AVG(p2.preco_venda) " +
            "FROM Produto p2 " +
            "WHERE p2.id_categoria = p.id_categoria " +
            "AND p2.status = 'ATIVO'), 2) AS diferenca_media, " +
            "ROUND(((p.preco_venda / (SELECT AVG(p2.preco_venda) " +
            "FROM Produto p2 " +
            "WHERE p2.id_categoria = p.id_categoria " +
            "AND p2.status = 'ATIVO')) - 1) * 100, 2) AS percentual_acima_media " +
            "FROM Produto p " +
            "INNER JOIN Categoria c ON p.id_categoria = c.id_categoria " +
            "WHERE p.preco_venda > (SELECT AVG(p2.preco_venda) " +
            "FROM Produto p2 " +
            "WHERE p2.id_categoria = p.id_categoria " +
            "AND p2.status = 'ATIVO') " +
            "AND p.status = 'ATIVO' " +
            "ORDER BY percentual_acima_media DESC " +
            "LIMIT ?";

        return jdbcTemplate.query(sql, produtoAcimaMediaRowMapper(), limit);
    }

    // ================================================================
    // CONSULTA 3: SUBCONSULTA - Clientes VIP (Gasto Acima da Média)
    // ================================================================
    public List<ClienteVIPDTO> buscarClientesVIP(Integer limit) {
        String sql = "SELECT " +
            "c.id_pessoa, " +
            "p.nome AS cliente_nome, " +
            "p.email AS cliente_email, " +
            "c.tipo_pessoa, " +
            "c.ranking, " +
            "c.total_gasto, " +
            "c.data_ultima_compra, " +
            "COUNT(v.id_venda) AS total_compras, " +
            "ROUND(c.total_gasto / NULLIF(COUNT(v.id_venda), 0), 2) AS ticket_medio, " +
            "(SELECT ROUND(AVG(total_gasto), 2) " +
            "FROM Cliente " +
            "WHERE ativo = TRUE) AS media_gasto_geral, " +
            "ROUND(c.total_gasto - (SELECT AVG(total_gasto) " +
            "FROM Cliente " +
            "WHERE ativo = TRUE), 2) AS diferenca_media, " +
            "ROUND(((c.total_gasto / (SELECT AVG(total_gasto) " +
            "FROM Cliente " +
            "WHERE ativo = TRUE)) - 1) * 100, 2) AS percentual_acima_media " +
            "FROM Cliente c " +
            "INNER JOIN Pessoa p ON c.id_pessoa = p.id_pessoa " +
            "LEFT JOIN Venda v ON c.id_pessoa = v.id_cliente AND v.status = 'CONCLUIDA' " +
            "WHERE c.ativo = TRUE " +
            "AND c.total_gasto > (SELECT AVG(total_gasto) " +
            "FROM Cliente " +
            "WHERE ativo = TRUE) " +
            "GROUP BY c.id_pessoa, p.nome, p.email, c.tipo_pessoa, c.ranking, " +
            "c.total_gasto, c.data_ultima_compra " +
            "HAVING COUNT(v.id_venda) > 0 " +
            "ORDER BY c.total_gasto DESC, total_compras DESC " +
            "LIMIT ?";

        return jdbcTemplate.query(sql, clienteVIPRowMapper(), limit);
    }

    // ================================================================
    // ROW MAPPERS
    // ================================================================

    private RowMapper<ProdutoNuncaVendidoDTO> produtoNuncaVendidoRowMapper() {
        return (ResultSet rs, int rowNum) -> {
            ProdutoNuncaVendidoDTO dto = new ProdutoNuncaVendidoDTO();
            
            try {
                dto.setIdProduto(rs.getInt("id_produto"));
                dto.setProdutoNome(rs.getString("produto_nome"));
                dto.setMarca(rs.getString("marca"));
                dto.setPrecoVenda(rs.getBigDecimal("preco_venda"));
                dto.setEstoque(rs.getInt("estoque"));
                dto.setCategoriaNome(rs.getString("categoria_nome"));
                dto.setFornecedorNome(rs.getString("fornecedor_nome"));
                dto.setValorInvestido(rs.getBigDecimal("valor_investido"));
                dto.setValorPotencialVenda(rs.getBigDecimal("valor_potencial_venda"));
                dto.setDiasSemVenda(rs.getInt("dias_sem_venda"));
                
                System.out.println(" Mapeado produto: " + dto.getProdutoNome() +
                    " (ID: " + dto.getIdProduto() + ", Estoque: " + dto.getEstoque() + ")");
            } catch (Exception e) {
                System.err.println("❌ Erro ao mapear produto: " + e.getMessage());
                e.printStackTrace();
                throw e;
            }
            
            return dto;
        };
    }

    private RowMapper<ProdutoAcimaMediaDTO> produtoAcimaMediaRowMapper() {
        return (ResultSet rs, int rowNum) -> {
            ProdutoAcimaMediaDTO dto = new ProdutoAcimaMediaDTO();
            dto.setIdProduto(rs.getInt("id_produto"));
            dto.setProdutoNome(rs.getString("produto_nome"));
            dto.setPrecoVenda(rs.getBigDecimal("preco_venda"));
            dto.setCategoriaNome(rs.getString("categoria_nome"));
            dto.setDiferencaMedia(rs.getBigDecimal("diferenca_media"));
            dto.setPercentualAcimaMedia(rs.getBigDecimal("percentual_acima_media"));
            return dto;
        };
    }

    private RowMapper<ClienteVIPDTO> clienteVIPRowMapper() {
        return (ResultSet rs, int rowNum) -> {
            ClienteVIPDTO dto = new ClienteVIPDTO();
            dto.setIdPessoa(rs.getLong("id_pessoa"));
            dto.setClienteNome(rs.getString("cliente_nome"));
            dto.setClienteEmail(rs.getString("cliente_email"));
            dto.setTipoPessoa(rs.getString("tipo_pessoa"));
            dto.setRanking(rs.getInt("ranking"));
            dto.setTotalGasto(rs.getBigDecimal("total_gasto"));
            dto.setDataUltimaCompra(rs.getDate("data_ultima_compra") != null ? 
                rs.getDate("data_ultima_compra").toLocalDate() : null);
            dto.setTotalCompras(rs.getLong("total_compras"));
            dto.setTicketMedio(rs.getBigDecimal("ticket_medio"));
            dto.setMediaGastoGeral(rs.getBigDecimal("media_gasto_geral"));
            dto.setDiferencaMedia(rs.getBigDecimal("diferenca_media"));
            dto.setPercentualAcimaMedia(rs.getBigDecimal("percentual_acima_media"));
            return dto;
        };
    }
}
