package com.project.sigma.repository;

import com.project.sigma.model.Categoria; // <-- IMPORT ADICIONADO
import com.project.sigma.model.Produto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class ProdutoRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // RowMapper ATUALIZADO para a nova estrutura da tabela Produto
    private final RowMapper<Produto> rowMapper = (rs, rowNum) -> {
        Produto produto = new Produto();
        produto.setId_produto(rs.getLong("id_produto"));
        produto.setNome(rs.getString("nome"));
        produto.setMarca(rs.getString("marca"));
        produto.setDescricao(rs.getString("descricao"));
        produto.setPreco_custo(rs.getBigDecimal("preco_custo"));
        produto.setPreco_venda(rs.getBigDecimal("preco_venda"));
        produto.setEstoque(rs.getInt("estoque"));
        produto.setEstoque_minimo(rs.getInt("estoque_minimo"));
        produto.setEstoque_maximo(rs.getInt("estoque_maximo"));
        produto.setLocalizacao_prateleira(rs.getString("localizacao_prateleira"));
        if (rs.getDate("data_validade") != null) {
            produto.setData_validade(rs.getDate("data_validade").toLocalDate());
        }
        produto.setStatus(rs.getString("status"));

        // Mapeando a Categoria que vem do JOIN
        if (rs.getObject("id_categoria") != null) {
            Categoria categoria = new Categoria();
            categoria.setId(rs.getLong("id_categoria"));
            categoria.setNome(rs.getString("nome_categoria")); // Usando o alias da query
            produto.setCategory(categoria);
        }

        return produto;
    };

    public Page<Produto> findAll(String search, Long categoryId, String status, Pageable pageable) {
        // SQL base que une Produto e Categoria com os nomes de colunas CORRETOS
        StringBuilder sqlBuilder = new StringBuilder(
                "SELECT p.*, c.nome as nome_categoria FROM Produto p LEFT JOIN Categoria c ON p.id_categoria = c.id_categoria WHERE 1=1"
        );
        List<Object> params = new ArrayList<>();

        // Adiciona filtros dinamicamente
        if (search != null && !search.isEmpty()) {
            sqlBuilder.append(" AND (p.nome LIKE ? OR p.marca LIKE ?)");
            params.add("%" + search + "%");
            params.add("%" + search + "%");
        }

        if (categoryId != null) {
            sqlBuilder.append(" AND p.id_categoria = ?");
            params.add(categoryId);
        }

        if (status != null && !status.isEmpty() && !status.equalsIgnoreCase("all")) {
            sqlBuilder.append(" AND p.status = ?");
            params.add(status.toUpperCase());
        }

        // Query para contar o total de resultados
        String countSql = "SELECT count(*) FROM (" + sqlBuilder.toString().replace("p.*, c.nome as nome_categoria", "1") + ") AS count_query";
        Integer total = jdbcTemplate.queryForObject(countSql, Integer.class, params.toArray());

        // Adiciona ordenação e paginação
        sqlBuilder.append(" ORDER BY p.nome ASC LIMIT ? OFFSET ?");
        params.add(pageable.getPageSize());
        params.add(pageable.getOffset());

        // Executa a query principal
        List<Produto> produtos = jdbcTemplate.query(sqlBuilder.toString(), rowMapper, params.toArray());

        return new PageImpl<>(produtos, pageable, total != null ? total : 0);
    }
}