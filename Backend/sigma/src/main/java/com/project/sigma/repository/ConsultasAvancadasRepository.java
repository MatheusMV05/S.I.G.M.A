package com.project.sigma.repository;

import com.project.sigma.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;

/**
 * Repository para executar consultas SQL avançadas e acessar views
 * Implementa consultas com ANTI JOIN, FULL OUTER JOIN, SUBCONSULTAS e VIEWS
 */
@Repository
public class ConsultasAvancadasRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // ================================================================
    // CONSULTA 1: ANTI JOIN - Produtos que nunca foram vendidos
    // ================================================================
    public List<ProdutoNuncaVendidoDTO> produtosNuncaVendidos() {
        String sql = "SELECT " +
                    "    p.id_produto, " +
                    "    p.nome AS produto_nome, " +
                    "    p.preco_venda, " +
                    "    p.quantidade_estoque, " +
                    "    c.nome AS categoria_nome, " +
                    "    (p.preco_venda * p.quantidade_estoque) AS valor_estoque_parado " +
                    "FROM Produto p " +
                    "LEFT JOIN ItemVenda iv ON p.id_produto = iv.id_produto " +
                    "INNER JOIN Categoria c ON p.id_categoria = c.id_categoria " +
                    "WHERE iv.id_item IS NULL " +
                    "ORDER BY valor_estoque_parado DESC";

        return jdbcTemplate.query(sql, produtoNuncaVendidoRowMapper());
    }

    // ================================================================
    // CONSULTA 2: FULL OUTER JOIN - Produtos e Fornecedores (simulado)
    // ================================================================
    public List<ProdutoFornecedorDTO> produtosEFornecedoresFullOuter() {
        String sql = "SELECT " +
                    "    p.id_produto, " +
                    "    p.nome AS produto_nome, " +
                    "    p.preco_venda, " +
                    "    f.id_fornecedor, " +
                    "    f.nome AS fornecedor_nome, " +
                    "    f.telefone AS fornecedor_telefone, " +
                    "    CASE " +
                    "        WHEN p.id_produto IS NULL THEN 'Fornecedor sem produtos cadastrados' " +
                    "        WHEN f.id_fornecedor IS NULL THEN 'Produto sem fornecedor vinculado' " +
                    "        ELSE 'Relação completa' " +
                    "    END AS status_vinculo " +
                    "FROM Produto p " +
                    "LEFT JOIN Fornecedor f ON p.id_fornecedor = f.id_fornecedor " +
                    "UNION " +
                    "SELECT " +
                    "    p.id_produto, " +
                    "    p.nome AS produto_nome, " +
                    "    p.preco_venda, " +
                    "    f.id_fornecedor, " +
                    "    f.nome AS fornecedor_nome, " +
                    "    f.telefone AS fornecedor_telefone, " +
                    "    CASE " +
                    "        WHEN p.id_produto IS NULL THEN 'Fornecedor sem produtos cadastrados' " +
                    "        WHEN f.id_fornecedor IS NULL THEN 'Produto sem fornecedor vinculado' " +
                    "        ELSE 'Relação completa' " +
                    "    END AS status_vinculo " +
                    "FROM Produto p " +
                    "RIGHT JOIN Fornecedor f ON p.id_fornecedor = f.id_fornecedor " +
                    "ORDER BY status_vinculo, fornecedor_nome";

        return jdbcTemplate.query(sql, produtoFornecedorRowMapper());
    }

    // ================================================================
    // CONSULTA 3: SUBCONSULTA - Produtos com preço acima da média
    // ================================================================
    public List<ProdutoAcimaMediaDTO> produtosAcimaDaMedia() {
        String sql = "SELECT " +
                    "    p.id_produto, " +
                    "    p.nome AS produto_nome, " +
                    "    p.preco_venda, " +
                    "    c.nome AS categoria_nome, " +
                    "    ROUND((p.preco_venda - (SELECT AVG(preco_venda) FROM Produto)), 2) AS diferenca_media, " +
                    "    ROUND(((p.preco_venda / (SELECT AVG(preco_venda) FROM Produto)) - 1) * 100, 2) AS percentual_acima_media " +
                    "FROM Produto p " +
                    "INNER JOIN Categoria c ON p.id_categoria = c.id_categoria " +
                    "WHERE p.preco_venda > (SELECT AVG(preco_venda) FROM Produto) " +
                    "ORDER BY p.preco_venda DESC";

        return jdbcTemplate.query(sql, produtoAcimaMediaRowMapper());
    }

    // ================================================================
    // CONSULTA 4: SUBCONSULTA - Clientes VIP (compraram mais que média)
    // ================================================================
    public List<ClienteVIPDTO> clientesCompraramAcimaMedia() {
        String sql = "SELECT " +
                    "    c.id_cliente, " +
                    "    c.nome AS cliente_nome, " +
                    "    c.cpf, " +
                    "    c.telefone, " +
                    "    COUNT(v.id_venda) AS total_compras, " +
                    "    ROUND(AVG(v.valor_total), 2) AS ticket_medio, " +
                    "    ROUND(SUM(v.valor_total), 2) AS valor_total_gasto, " +
                    "    ( " +
                    "        SELECT ROUND(AVG(compras_por_cliente), 2) " +
                    "        FROM ( " +
                    "            SELECT COUNT(*) as compras_por_cliente " +
                    "            FROM Venda " +
                    "            GROUP BY id_cliente " +
                    "        ) AS subquery " +
                    "    ) AS media_compras_geral " +
                    "FROM Cliente c " +
                    "INNER JOIN Venda v ON c.id_cliente = v.id_cliente " +
                    "GROUP BY c.id_cliente, c.nome, c.cpf, c.telefone " +
                    "HAVING COUNT(v.id_venda) > ( " +
                    "    SELECT AVG(compras_por_cliente) " +
                    "    FROM ( " +
                    "        SELECT COUNT(*) as compras_por_cliente " +
                    "        FROM Venda " +
                    "        GROUP BY id_cliente " +
                    "    ) AS subquery2 " +
                    ") " +
                    "ORDER BY total_compras DESC, valor_total_gasto DESC";

        return jdbcTemplate.query(sql, clienteVIPRowMapper());
    }

    // ================================================================
    // VIEW 1: Relatório Completo de Vendas
    // ================================================================
    public List<RelatorioVendaDTO> consultarViewRelatorioVendas(LocalDate dataInicio, LocalDate dataFim) {
        StringBuilder sql = new StringBuilder(
            "SELECT * FROM vw_relatorio_vendas WHERE 1=1 "
        );

        if (dataInicio != null) {
            sql.append("AND data_venda >= ? ");
        }
        if (dataFim != null) {
            sql.append("AND data_venda <= ? ");
        }
        sql.append("ORDER BY data_venda DESC");

        // Preparar parâmetros
        Object[] params;
        if (dataInicio != null && dataFim != null) {
            params = new Object[]{dataInicio, dataFim};
        } else if (dataInicio != null) {
            params = new Object[]{dataInicio};
        } else if (dataFim != null) {
            params = new Object[]{dataFim};
        } else {
            params = new Object[]{};
        }

        return jdbcTemplate.query(sql.toString(), params, relatorioVendaRowMapper());
    }

    // ================================================================
    // VIEW 2: Estoque Completo com Categoria e Fornecedor
    // ================================================================
    public List<EstoqueCompletoDTO> consultarViewEstoqueCompleto(String statusEstoque) {
        StringBuilder sql = new StringBuilder(
            "SELECT * FROM vw_estoque_completo WHERE 1=1 "
        );

        if (statusEstoque != null && !statusEstoque.trim().isEmpty()) {
            sql.append("AND status_estoque = ? ");
        }
        sql.append("ORDER BY produto_nome");

        Object[] params = (statusEstoque != null && !statusEstoque.trim().isEmpty()) 
            ? new Object[]{statusEstoque} 
            : new Object[]{};

        return jdbcTemplate.query(sql.toString(), params, estoqueCompletoRowMapper());
    }

    // ================================================================
    // ROW MAPPERS
    // ================================================================

    private RowMapper<ProdutoNuncaVendidoDTO> produtoNuncaVendidoRowMapper() {
        return (ResultSet rs, int rowNum) -> {
            ProdutoNuncaVendidoDTO dto = new ProdutoNuncaVendidoDTO();
            dto.setIdProduto(rs.getInt("id_produto"));
            dto.setProdutoNome(rs.getString("produto_nome"));
            dto.setPrecoVenda(rs.getBigDecimal("preco_venda"));
            dto.setQuantidadeEstoque(rs.getInt("quantidade_estoque"));
            dto.setCategoriaNome(rs.getString("categoria_nome"));
            dto.setValorEstoqueParado(rs.getBigDecimal("valor_estoque_parado"));
            return dto;
        };
    }

    private RowMapper<ProdutoFornecedorDTO> produtoFornecedorRowMapper() {
        return (ResultSet rs, int rowNum) -> {
            ProdutoFornecedorDTO dto = new ProdutoFornecedorDTO();
            dto.setIdProduto((Integer) rs.getObject("id_produto"));
            dto.setProdutoNome(rs.getString("produto_nome"));
            dto.setPrecoVenda(rs.getBigDecimal("preco_venda"));
            dto.setIdFornecedor((Integer) rs.getObject("id_fornecedor"));
            dto.setFornecedorNome(rs.getString("fornecedor_nome"));
            dto.setFornecedorTelefone(rs.getString("fornecedor_telefone"));
            dto.setStatusVinculo(rs.getString("status_vinculo"));
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
            dto.setIdCliente(rs.getInt("id_cliente"));
            dto.setClienteNome(rs.getString("cliente_nome"));
            dto.setCpf(rs.getString("cpf"));
            dto.setTelefone(rs.getString("telefone"));
            dto.setTotalCompras(rs.getLong("total_compras"));
            dto.setTicketMedio(rs.getBigDecimal("ticket_medio"));
            dto.setValorTotalGasto(rs.getBigDecimal("valor_total_gasto"));
            dto.setMediaComprasGeral(rs.getBigDecimal("media_compras_geral"));
            return dto;
        };
    }

    private RowMapper<RelatorioVendaDTO> relatorioVendaRowMapper() {
        return (ResultSet rs, int rowNum) -> {
            RelatorioVendaDTO dto = new RelatorioVendaDTO();
            dto.setIdVenda(rs.getInt("id_venda"));
            dto.setDataVenda(rs.getDate("data_venda").toLocalDate());
            dto.setValorTotal(rs.getBigDecimal("valor_total"));
            dto.setFormaPagamento(rs.getString("forma_pagamento"));
            dto.setIdCliente(rs.getInt("id_cliente"));
            dto.setClienteNome(rs.getString("cliente_nome"));
            dto.setClienteCpf(rs.getString("cliente_cpf"));
            dto.setClienteTelefone(rs.getString("cliente_telefone"));
            dto.setClienteEmail(rs.getString("cliente_email"));
            dto.setIdFuncionario(rs.getInt("id_funcionario"));
            dto.setFuncionarioNome(rs.getString("funcionario_nome"));
            dto.setFuncionarioCargo(rs.getString("funcionario_cargo"));
            dto.setTotalItensVenda(rs.getLong("total_itens_venda"));
            dto.setQuantidadeTotalProdutos(rs.getInt("quantidade_total_produtos"));
            return dto;
        };
    }

    private RowMapper<EstoqueCompletoDTO> estoqueCompletoRowMapper() {
        return (ResultSet rs, int rowNum) -> {
            EstoqueCompletoDTO dto = new EstoqueCompletoDTO();
            dto.setIdProduto(rs.getInt("id_produto"));
            dto.setProdutoNome(rs.getString("produto_nome"));
            dto.setProdutoDescricao(rs.getString("produto_descricao"));
            dto.setPrecoVenda(rs.getBigDecimal("preco_venda"));
            dto.setPrecoCusto(rs.getBigDecimal("preco_custo"));
            dto.setQuantidadeEstoque(rs.getInt("quantidade_estoque"));
            dto.setEstoqueMinimo(rs.getInt("estoque_minimo"));
            dto.setIdCategoria(rs.getInt("id_categoria"));
            dto.setCategoriaNome(rs.getString("categoria_nome"));
            dto.setCategoriaDescricao(rs.getString("categoria_descricao"));
            dto.setIdFornecedor((Integer) rs.getObject("id_fornecedor"));
            dto.setFornecedorNome(rs.getString("fornecedor_nome"));
            dto.setFornecedorTelefone(rs.getString("fornecedor_telefone"));
            dto.setFornecedorEmail(rs.getString("fornecedor_email"));
            dto.setFornecedorCnpj(rs.getString("fornecedor_cnpj"));
            dto.setValorTotalEstoque(rs.getBigDecimal("valor_total_estoque"));
            dto.setCustoTotalEstoque(rs.getBigDecimal("custo_total_estoque"));
            dto.setLucroPotencial(rs.getBigDecimal("lucro_potencial"));
            dto.setStatusEstoque(rs.getString("status_estoque"));
            dto.setMargemLucroPercentual(rs.getBigDecimal("margem_lucro_percentual"));
            return dto;
        };
    }
}
