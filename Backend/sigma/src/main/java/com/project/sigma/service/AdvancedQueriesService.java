package com.project.sigma.service;

import com.project.sigma.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Service para executar consultas avançadas e acessar views
 * Utiliza JDBC puro (sem JPA) conforme requisitos do projeto
 */
@Service
public class AdvancedQueriesService {

    @Autowired
    private DataSource dataSource;

    /**
     * CONSULTA 1: Produtos que nunca foram vendidos (ANTI JOIN)
     */
    public List<ProdutoNuncaVendidoDTO> getProdutosNuncaVendidos() {
        List<ProdutoNuncaVendidoDTO> resultados = new ArrayList<>();
        
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

        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                ProdutoNuncaVendidoDTO dto = new ProdutoNuncaVendidoDTO();
                dto.setIdProduto(rs.getInt("id_produto"));
                dto.setProdutoNome(rs.getString("produto_nome"));
                dto.setPrecoVenda(rs.getBigDecimal("preco_venda"));
                dto.setQuantidadeEstoque(rs.getInt("quantidade_estoque"));
                dto.setCategoriaNome(rs.getString("categoria_nome"));
                dto.setValorEstoqueParado(rs.getBigDecimal("valor_estoque_parado"));
                resultados.add(dto);
            }

        } catch (SQLException e) {
            throw new RuntimeException("Erro ao executar consulta de produtos nunca vendidos", e);
        }

        return resultados;
    }

    /**
     * CONSULTA 2: Produtos e Fornecedores - FULL OUTER JOIN (simulado com UNION)
     */
    public List<ProdutoFornecedorDTO> getProdutosFornecedoresFullOuter() {
        List<ProdutoFornecedorDTO> resultados = new ArrayList<>();
        
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

        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                ProdutoFornecedorDTO dto = new ProdutoFornecedorDTO();
                dto.setIdProduto((Integer) rs.getObject("id_produto"));
                dto.setProdutoNome(rs.getString("produto_nome"));
                dto.setPrecoVenda(rs.getBigDecimal("preco_venda"));
                dto.setIdFornecedor((Integer) rs.getObject("id_fornecedor"));
                dto.setFornecedorNome(rs.getString("fornecedor_nome"));
                dto.setFornecedorTelefone(rs.getString("fornecedor_telefone"));
                dto.setStatusVinculo(rs.getString("status_vinculo"));
                resultados.add(dto);
            }

        } catch (SQLException e) {
            throw new RuntimeException("Erro ao executar consulta full outer join", e);
        }

        return resultados;
    }

    /**
     * CONSULTA 3: Produtos com preço ACIMA DA MÉDIA (SUBCONSULTA)
     */
    public List<ProdutoAcimaMediaDTO> getProdutosAcimaDaMedia() {
        List<ProdutoAcimaMediaDTO> resultados = new ArrayList<>();
        
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

        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                ProdutoAcimaMediaDTO dto = new ProdutoAcimaMediaDTO();
                dto.setIdProduto(rs.getInt("id_produto"));
                dto.setProdutoNome(rs.getString("produto_nome"));
                dto.setPrecoVenda(rs.getBigDecimal("preco_venda"));
                dto.setCategoriaNome(rs.getString("categoria_nome"));
                dto.setDiferencaMedia(rs.getBigDecimal("diferenca_media"));
                dto.setPercentualAcimaMedia(rs.getBigDecimal("percentual_acima_media"));
                resultados.add(dto);
            }

        } catch (SQLException e) {
            throw new RuntimeException("Erro ao executar consulta de produtos acima da média", e);
        }

        return resultados;
    }

    /**
     * CONSULTA 4: Clientes VIP - compraram mais que a média (SUBCONSULTA)
     */
    public List<ClienteVIPDTO> getClientesVIP() {
        List<ClienteVIPDTO> resultados = new ArrayList<>();
        
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

        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                ClienteVIPDTO dto = new ClienteVIPDTO();
                dto.setIdCliente(rs.getInt("id_cliente"));
                dto.setClienteNome(rs.getString("cliente_nome"));
                dto.setCpf(rs.getString("cpf"));
                dto.setTelefone(rs.getString("telefone"));
                dto.setTotalCompras(rs.getLong("total_compras"));
                dto.setTicketMedio(rs.getBigDecimal("ticket_medio"));
                dto.setValorTotalGasto(rs.getBigDecimal("valor_total_gasto"));
                dto.setMediaComprasGeral(rs.getBigDecimal("media_compras_geral"));
                resultados.add(dto);
            }

        } catch (SQLException e) {
            throw new RuntimeException("Erro ao executar consulta de clientes VIP", e);
        }

        return resultados;
    }

    /**
     * VIEW 1: Relatório completo de vendas
     */
    public List<RelatorioVendaDTO> getRelatorioVendas(LocalDate dataInicio, LocalDate dataFim) {
        List<RelatorioVendaDTO> resultados = new ArrayList<>();
        
        StringBuilder sql = new StringBuilder("SELECT * FROM vw_relatorio_vendas WHERE 1=1 ");
        
        if (dataInicio != null) {
            sql.append("AND data_venda >= ? ");
        }
        if (dataFim != null) {
            sql.append("AND data_venda <= ? ");
        }
        sql.append("ORDER BY data_venda DESC");

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql.toString())) {

            int paramIndex = 1;
            if (dataInicio != null) {
                pstmt.setDate(paramIndex++, Date.valueOf(dataInicio));
            }
            if (dataFim != null) {
                pstmt.setDate(paramIndex++, Date.valueOf(dataFim));
            }

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
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
                    resultados.add(dto);
                }
            }

        } catch (SQLException e) {
            throw new RuntimeException("Erro ao consultar view de relatório de vendas", e);
        }

        return resultados;
    }

    /**
     * VIEW 2: Estoque completo com informações de categoria e fornecedor
     */
    public List<EstoqueCompletoDTO> getEstoqueCompleto(String statusEstoque) {
        List<EstoqueCompletoDTO> resultados = new ArrayList<>();
        
        StringBuilder sql = new StringBuilder("SELECT * FROM vw_estoque_completo WHERE 1=1 ");
        
        if (statusEstoque != null && !statusEstoque.isEmpty()) {
            sql.append("AND status_estoque = ? ");
        }
        sql.append("ORDER BY produto_nome");

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql.toString())) {

            if (statusEstoque != null && !statusEstoque.isEmpty()) {
                pstmt.setString(1, statusEstoque);
            }

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
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
                    resultados.add(dto);
                }
            }

        } catch (SQLException e) {
            throw new RuntimeException("Erro ao consultar view de estoque completo", e);
        }

        return resultados;
    }
}
