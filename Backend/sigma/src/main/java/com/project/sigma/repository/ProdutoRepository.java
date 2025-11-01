package com.project.sigma.repository;

import com.project.sigma.dto.ProdutoResponseDTO;
import com.project.sigma.model.Categoria;
import com.project.sigma.model.Produto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.project.sigma.dto.PaginatedResponseDTO;
import java.util.ArrayList;
import java.util.List;

import java.sql.ResultSet;
import com.project.sigma.model.Produto;

@Repository
public class ProdutoRepository implements BaseRepository<Produto, Long> {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final String INSERT_SQL =
        "INSERT INTO Produto (nome, marca, descricao, id_categoria, id_fornecedor, preco_custo, preco_venda, " +
        "estoque, estoque_minimo, estoque_maximo, localizacao_prateleira, data_validade, codigo_barras, status) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    private static final String SELECT_BY_ID_SQL =
        "SELECT * FROM Produto WHERE id_produto = ?";

    private static final String SELECT_ALL_SQL =
        "SELECT * FROM Produto ORDER BY nome";

    private static final String SELECT_ALL_WITH_CATEGORY_SQL =
        "SELECT p.*, c.nome as categoria_nome, c.descricao as categoria_descricao, c.status as categoria_status " +
        "FROM Produto p " +
        "LEFT JOIN Categoria c ON p.id_categoria = c.id_categoria " +
        "ORDER BY p.nome";

    private static final String SELECT_BY_ID_WITH_CATEGORY_SQL =
        "SELECT p.*, c.nome as categoria_nome, c.descricao as categoria_descricao, c.status as categoria_status " +
        "FROM Produto p " +
        "LEFT JOIN Categoria c ON p.id_categoria = c.id_categoria " +
        "WHERE p.id_produto = ?";

    private static final String UPDATE_SQL =
        "UPDATE Produto SET nome = ?, marca = ?, descricao = ?, id_categoria = ?, id_fornecedor = ?, " +
        "preco_custo = ?, preco_venda = ?, estoque = ?, estoque_minimo = ?, estoque_maximo = ?, " +
        "localizacao_prateleira = ?, data_validade = ?, codigo_barras = ?, status = ? WHERE id_produto = ?";

    private static final String DELETE_SQL =
        "DELETE FROM Produto WHERE id_produto = ?";

    private static final String EXISTS_SQL =
        "SELECT COUNT(*) FROM Produto WHERE id_produto = ?";

    @Override
    public Produto save(Produto produto) {
        if (produto.getId_produto() == null) {
            return insert(produto);
        } else {
            return update(produto);
        }
    }

    private Produto insert(Produto produto) {
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(INSERT_SQL, new String[]{"id_produto"});
            ps.setString(1, produto.getNome());
            ps.setString(2, produto.getMarca());
            ps.setString(3, produto.getDescricao());
            ps.setObject(4, produto.getId_categoria());
            ps.setObject(5, produto.getId_fornecedor());
            ps.setBigDecimal(6, produto.getPreco_custo());
            ps.setBigDecimal(7, produto.getPreco_venda());
            ps.setInt(8, produto.getEstoque());
            ps.setInt(9, produto.getEstoque_minimo());
            ps.setInt(10, produto.getEstoque_maximo());
            ps.setString(11, produto.getLocalizacao_prateleira());
            ps.setDate(12, produto.getData_validade() != null ? Date.valueOf(produto.getData_validade()) : null);
            ps.setString(13, produto.getCodigo_barras());
            ps.setString(14, produto.getStatus().name());
            return ps;
        }, keyHolder);

        produto.setId_produto(keyHolder.getKey().longValue());
        return produto;
    }

    private Produto update(Produto produto) {
        jdbcTemplate.update(UPDATE_SQL,
            produto.getNome(),
            produto.getMarca(),
            produto.getDescricao(),
            produto.getId_categoria(),
            produto.getId_fornecedor(),
            produto.getPreco_custo(),
            produto.getPreco_venda(),
            produto.getEstoque(),
            produto.getEstoque_minimo(),
            produto.getEstoque_maximo(),
            produto.getLocalizacao_prateleira(),
            produto.getData_validade() != null ? Date.valueOf(produto.getData_validade()) : null,
            produto.getCodigo_barras(),
            produto.getStatus().name(),
            produto.getId_produto());
        return produto;
    }

    @Override
    public Optional<Produto> findById(Long id) {
        try {
            Produto produto = jdbcTemplate.queryForObject(SELECT_BY_ID_SQL, produtoRowMapper(), id);
            return Optional.ofNullable(produto);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    /**
     * Busca produtos com filtros dinâmicos de nome, status de estoque e categoria, com paginação.
     * Alimenta a aba "Produtos" da página de Inventário.
     */
    public PaginatedResponseDTO<Produto> findWithFiltersAndPagination(
            String nome, String status, Long categoriaId, int page, int size) {

        StringBuilder sql = new StringBuilder(
                "SELECT p.*, c.nome AS nome_categoria " +
                        "FROM Produto p " +
                        "LEFT JOIN Categoria c ON p.id_categoria = c.id_categoria "
        );
        StringBuilder countSql = new StringBuilder("SELECT COUNT(p.id_produto) FROM Produto p ");

        List<Object> params = new ArrayList<>();
        StringBuilder whereClause = new StringBuilder(" WHERE p.status = 'ATIVO' ");

        if (nome != null && !nome.isEmpty()) {
            whereClause.append(" AND p.nome LIKE ? ");
            params.add("%" + nome + "%");
        }
        if (categoriaId != null) {
            whereClause.append(" AND p.id_categoria = ? ");
            params.add(categoriaId);
        }
        if (status != null && !status.isEmpty() && !status.equals("all")) {
            // Traduz o "status" do frontend para a lógica do banco de dados
            if (status.equals("low")) {
                whereClause.append(" AND (p.estoque <= p.estoque_minimo AND p.estoque > 0) ");
            } else if (status.equals("out")) {
                whereClause.append(" AND p.estoque <= 0 ");
            } else if (status.equals("normal")) {
                whereClause.append(" AND p.estoque > p.estoque_minimo ");
            }
        }

        // 1. Obter contagem total
        countSql.append(whereClause);
        Long totalElements = jdbcTemplate.queryForObject(countSql.toString(), Long.class, params.toArray());

        // 2. Adicionar ordenação e paginação
        sql.append(whereClause);
        sql.append(" ORDER BY p.nome ASC ");
        sql.append(" LIMIT ? OFFSET ? ");
        params.add(size);
        params.add(page * size);

        // 3. Obter o conteúdo da página
        System.out.println("🔍 SQL Paginação: " + sql.toString());
        System.out.println("📊 Params: page=" + page + ", size=" + size + ", offset=" + (page * size));
        
        List<Produto> content = jdbcTemplate.query(
                sql.toString(),
                produtoRowMapper(),
                params.toArray()
        );

        // 4. Construir o DTO de resposta paginada
        int totalPages = (int) Math.ceil((double) totalElements / size);
        int numberOfElements = content.size();
        boolean isFirst = (page == 0);
        boolean isLast = (totalPages == 0) || (page == totalPages - 1);

        // --- INÍCIO DA CORREÇÃO ---
        // Ajustando a ordem dos argumentos para o @AllArgsConstructor
        return new PaginatedResponseDTO<Produto>(
                content,            // 1. content
                page,               // 2. page
                size,               // 3. size
                totalPages,         // 4. totalPages
                totalElements.longValue(), // 5. totalElements
                isFirst,            // 6. first
                isLast,             // 7. last
                numberOfElements    // 8. number
        );
    }

    public List<Produto> findLowStockProducts() {
        String sql = "SELECT * FROM Produto WHERE estoque <= estoque_minimo AND estoque > 0 AND status = 'ATIVO'";
        return jdbcTemplate.query(sql, produtoRowMapper());
    }

    public List<Produto> findOutOfStockProducts() {
        String sql = "SELECT * FROM Produto WHERE estoque <= 0 AND status = 'ATIVO'";
        return jdbcTemplate.query(sql, produtoRowMapper());
    }

    public Long countActiveProducts() {
        String sql = "SELECT COUNT(*) FROM Produto WHERE status = 'ATIVO'";
        return jdbcTemplate.queryForObject(sql, Long.class);
    }

    public BigDecimal findTotalStockValue() {
        String sql = "SELECT SUM(estoque * preco_custo) FROM Produto WHERE status = 'ATIVO'";
        return jdbcTemplate.queryForObject(sql, BigDecimal.class);
    }

    public Long countLowStockProducts() {
        String sql = "SELECT COUNT(*) FROM Produto WHERE estoque <= estoque_minimo AND estoque > 0 AND status = 'ATIVO'";
        return jdbcTemplate.queryForObject(sql, Long.class);
    }

    public Long countOutOfStockProducts() {
        String sql = "SELECT COUNT(*) FROM Produto WHERE estoque <= 0 AND status = 'ATIVO'";
        return jdbcTemplate.queryForObject(sql, Long.class);
    }

    @Override
    public List<Produto> findAll() {
        return jdbcTemplate.query(SELECT_ALL_SQL, produtoRowMapper());
    }

    public List<Produto> findAllWithCategory() {
        return jdbcTemplate.query(SELECT_ALL_WITH_CATEGORY_SQL, produtoWithCategoryRowMapper());
    }

    @Override
    public void deleteById(Long id) {
        jdbcTemplate.update(DELETE_SQL, id);
    }

    @Override
    public boolean existsById(Long id) {
        Integer count = jdbcTemplate.queryForObject(EXISTS_SQL, Integer.class, id);
        return count != null && count > 0;
    }

    public Optional<Produto> findByIdWithCategory(Long id) {
        try {
            Produto produto = jdbcTemplate.queryForObject(SELECT_BY_ID_WITH_CATEGORY_SQL, produtoWithCategoryRowMapper(), id);
            return Optional.ofNullable(produto);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public List<Produto> findByCategoria(Long idCategoria) {
        return jdbcTemplate.query(
            "SELECT * FROM Produto WHERE id_categoria = ? ORDER BY nome",
            produtoRowMapper(),
            idCategoria);
    }

    public List<Produto> findByStatus(Produto.StatusProduto status) {
        return jdbcTemplate.query(
            "SELECT * FROM Produto WHERE status = ? ORDER BY nome",
            produtoRowMapper(),
            status.name());
    }

    public List<Produto> findByEstoqueBaixo() {
        return jdbcTemplate.query(
            "SELECT * FROM Produto WHERE estoque <= estoque_minimo ORDER BY nome",
            produtoRowMapper());
    }

    public List<Produto> findByEstoqueBaixoWithCategory() {
        return jdbcTemplate.query(
            "SELECT p.*, c.nome as categoria_nome, c.descricao as categoria_descricao, c.status as categoria_status " +
            "FROM Produto p " +
            "LEFT JOIN Categoria c ON p.id_categoria = c.id_categoria " +
            "WHERE p.estoque <= p.estoque_minimo " +
            "ORDER BY p.nome",
            produtoWithCategoryRowMapper());
    }

    public void updateEstoque(Long idProduto, Integer novoEstoque) {
        jdbcTemplate.update(
            "UPDATE Produto SET estoque = ? WHERE id_produto = ?",
            novoEstoque, idProduto);
    }

    public Optional<Produto> findByCodigoBarras(String codigoBarras) {
        try {
            Produto produto = jdbcTemplate.queryForObject(
                "SELECT * FROM Produto WHERE codigo_barras = ?",
                produtoRowMapper(),
                codigoBarras);
            return Optional.ofNullable(produto);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    /**
     * Feature #4: Reajusta preços de categoria usando stored procedure
     */
    public void reajustarPrecosCategoria(Long idCategoria, BigDecimal percentual, Boolean reajustarCusto) {
        String sql = "{CALL sp_reajustar_precos_categoria(?, ?, ?)}";
        jdbcTemplate.update(sql, idCategoria, percentual, reajustarCusto);
    }

    private RowMapper<Produto> produtoRowMapper() {
        return (ResultSet rs, int rowNum) -> {
            Produto produto = new Produto();
            produto.setId_produto(rs.getLong("id_produto"));
            produto.setNome(rs.getString("nome"));
            produto.setMarca(rs.getString("marca"));
            produto.setDescricao(rs.getString("descricao"));
            produto.setId_categoria(rs.getObject("id_categoria", Long.class));
            produto.setId_fornecedor(rs.getObject("id_fornecedor", Long.class));
            produto.setPreco_custo(rs.getBigDecimal("preco_custo"));
            produto.setPreco_venda(rs.getBigDecimal("preco_venda"));
            produto.setEstoque(rs.getInt("estoque"));
            produto.setEstoque_minimo(rs.getInt("estoque_minimo"));
            produto.setEstoque_maximo(rs.getInt("estoque_maximo"));
            produto.setLocalizacao_prateleira(rs.getString("localizacao_prateleira"));

            Date dataValidade = rs.getDate("data_validade");
            if (dataValidade != null) {
                produto.setData_validade(dataValidade.toLocalDate());
            }

            produto.setCodigo_barras(rs.getString("codigo_barras"));
            produto.setStatus(Produto.StatusProduto.valueOf(rs.getString("status")));
            return produto;
        };
    }

    private RowMapper<Produto> produtoWithCategoryRowMapper() {
        return (ResultSet rs, int rowNum) -> {
            Produto produto = new Produto();
            produto.setId_produto(rs.getLong("id_produto"));
            produto.setNome(rs.getString("nome"));
            produto.setMarca(rs.getString("marca"));
            produto.setDescricao(rs.getString("descricao"));
            produto.setId_categoria(rs.getObject("id_categoria", Long.class));
            produto.setId_fornecedor(rs.getObject("id_fornecedor", Long.class));
            produto.setPreco_custo(rs.getBigDecimal("preco_custo"));
            produto.setPreco_venda(rs.getBigDecimal("preco_venda"));
            produto.setEstoque(rs.getInt("estoque"));
            produto.setEstoque_minimo(rs.getInt("estoque_minimo"));
            produto.setEstoque_maximo(rs.getInt("estoque_maximo"));
            produto.setLocalizacao_prateleira(rs.getString("localizacao_prateleira"));

            Date dataValidade = rs.getDate("data_validade");
            if (dataValidade != null) {
                produto.setData_validade(dataValidade.toLocalDate());
            }

            produto.setCodigo_barras(rs.getString("codigo_barras"));
            produto.setStatus(Produto.StatusProduto.valueOf(rs.getString("status")));

            // Populate categoria if exists
            String categoriaNome = rs.getString("categoria_nome");
            if (categoriaNome != null && produto.getId_categoria() != null) {
                Categoria categoria = new Categoria();
                categoria.setId_categoria(produto.getId_categoria());
                categoria.setNome(categoriaNome);
                categoria.setDescricao(rs.getString("categoria_descricao"));
                String categoriaStatus = rs.getString("categoria_status");
                if (categoriaStatus != null) {
                    categoria.setStatus(Categoria.StatusCategoria.valueOf(categoriaStatus));
                }
                produto.setCategoria(categoria);
            }

            return produto;
        };
    }
}