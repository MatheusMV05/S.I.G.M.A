package com.project.sigma.repository;

import com.project.sigma.dto.*;
import com.project.sigma.model.MovimentacaoEstoque;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.jdbc.core.BeanPropertyRowMapper;

import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Repository
public class MovimentacaoEstoqueRepository implements BaseRepository<MovimentacaoEstoque, Long> {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final String INSERT_SQL =
        "INSERT INTO MovimentacaoEstoque (id_produto, id_usuario, data_movimentacao, tipo, quantidade, estoque_anterior, estoque_atual, observacao) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    private static final String SELECT_BY_ID_SQL =
        "SELECT * FROM MovimentacaoEstoque WHERE id_movimentacao = ?";

    private static final String SELECT_ALL_SQL =
        "SELECT * FROM MovimentacaoEstoque ORDER BY data_movimentacao DESC";

    private static final String UPDATE_SQL =
        "UPDATE MovimentacaoEstoque SET id_produto = ?, id_usuario = ?, data_movimentacao = ?, tipo = ?, quantidade = ?, estoque_anterior = ?, estoque_atual = ?, observacao = ? " +
        "WHERE id_movimentacao = ?";

    private static final String DELETE_SQL =
        "DELETE FROM MovimentacaoEstoque WHERE id_movimentacao = ?";

    private static final String EXISTS_SQL =
        "SELECT COUNT(*) FROM MovimentacaoEstoque WHERE id_movimentacao = ?";

    @Override
    public MovimentacaoEstoque save(MovimentacaoEstoque movimentacao) {
        if (movimentacao.getId_movimentacao() == null) {
            return insert(movimentacao);
        } else {
            return update(movimentacao);
        }
    }

    private MovimentacaoEstoque insert(MovimentacaoEstoque movimentacao) {
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(INSERT_SQL, new String[]{"id_movimentacao"});
            ps.setLong(1, movimentacao.getId_produto());
            ps.setObject(2, movimentacao.getId_usuario());
            ps.setTimestamp(3, Timestamp.valueOf(movimentacao.getData_movimentacao() != null ?
                movimentacao.getData_movimentacao() : LocalDateTime.now()));
            ps.setString(4, movimentacao.getTipo().name());
            ps.setInt(5, movimentacao.getQuantidade());
            ps.setInt(6, movimentacao.getEstoque_anterior());
            ps.setInt(7, movimentacao.getEstoque_atual());
            ps.setString(8, movimentacao.getObservacao());
            return ps;
        }, keyHolder);

        movimentacao.setId_movimentacao(keyHolder.getKey().longValue());
        return movimentacao;
    }

    private MovimentacaoEstoque update(MovimentacaoEstoque movimentacao) {
        jdbcTemplate.update(UPDATE_SQL,
            movimentacao.getId_produto(),
            movimentacao.getId_usuario(),
            Timestamp.valueOf(movimentacao.getData_movimentacao()),
            movimentacao.getTipo().name(),
            movimentacao.getQuantidade(),
            movimentacao.getEstoque_anterior(),
            movimentacao.getEstoque_atual(),
            movimentacao.getObservacao(),
            movimentacao.getId_movimentacao());
        return movimentacao;
    }

    /**
     * Busca movimentações com filtros dinâmicos e paginação.
     * Esta é a consulta principal que alimenta getStockMovements e getProductStockHistory.
     */
    public PaginatedResponseDTO<StockMovementDTO> findWithFiltersAndPagination(
            Long productId, String type, Long userId, String startDate, String endDate,
            int page, int size) {

        StringBuilder sql = new StringBuilder(
                "SELECT m.id_movimentacao, m.id_produto, m.id_usuario, m.data_movimentacao, m.tipo, " +
                        "m.quantidade, m.estoque_anterior, m.estoque_atual, m.observacao, " +
                        "p.nome AS productName, u.login AS userName " + // Assumindo que 'login' é o nome de usuário
                        "FROM MovimentacaoEstoque m " +
                        "LEFT JOIN Produto p ON m.id_produto = p.id_produto " +
                        "LEFT JOIN Usuario u ON m.id_usuario = u.id_usuario "
        );
        StringBuilder countSql = new StringBuilder("SELECT COUNT(*) FROM MovimentacaoEstoque m ");

        List<Object> params = new ArrayList<>();
        StringBuilder whereClause = new StringBuilder(" WHERE 1=1 ");

        if (productId != null) {
            whereClause.append(" AND m.id_produto = ? ");
            params.add(productId);
        }
        if (type != null && !type.isEmpty()) {
            whereClause.append(" AND m.tipo = ? ");
            params.add(type);
        }
        if (userId != null) {
            whereClause.append(" AND m.id_usuario = ? ");
            params.add(userId);
        }
        if (startDate != null && !startDate.isEmpty()) {
            whereClause.append(" AND m.data_movimentacao >= ? ");
            params.add(startDate + " 00:00:00");
        }
        if (endDate != null && !endDate.isEmpty()) {
            whereClause.append(" AND m.data_movimentacao <= ? ");
            params.add(endDate + " 23:59:59");
        }

        // 1. Obter contagem total
        countSql.append(whereClause);
        Long totalElements = jdbcTemplate.queryForObject(countSql.toString(), Long.class, params.toArray());

        // 2. Adicionar ordenação e paginação
        sql.append(whereClause);
        sql.append(" ORDER BY m.data_movimentacao DESC ");
        sql.append(" LIMIT ? OFFSET ? ");

        int offset = page * size;
        params.add(size);
        params.add(offset);

        // 3. Obter o conteúdo da página
        List<StockMovementDTO> content = jdbcTemplate.query(
                sql.toString(),
                (rs, rowNum) -> {
                    StockMovementDTO dto = new StockMovementDTO();
                    dto.setId(rs.getLong("id_movimentacao"));
                    dto.setProductId(rs.getLong("id_produto"));
                    dto.setUserId(rs.getLong("id_usuario"));
                    dto.setDate(rs.getTimestamp("data_movimentacao").toLocalDateTime());
                    dto.setType(rs.getString("tipo"));
                    dto.setQuantity(rs.getInt("quantidade"));
                    dto.setStockBefore(rs.getInt("estoque_anterior"));
                    dto.setStockAfter(rs.getInt("estoque_atual"));
                    dto.setReason(rs.getString("observacao"));
                    dto.setProductName(rs.getString("productName"));
                    dto.setUserName(rs.getString("userName"));
                    return dto;
                },
                params.toArray()
        );

        int totalPages = (int) Math.ceil((double) totalElements / size);

        // Vamos calcular os argumentos que faltam
        int numberOfElements = content.size();
        boolean isFirst = (page == 0);
        boolean isLast = (totalPages == 0) || (page == totalPages - 1);

        return new PaginatedResponseDTO<StockMovementDTO>(
                content,                // 1. content
                page,                   // 2. page
                size,                   // 3. size
                totalPages,             // 4. totalPages
                totalElements.longValue(), // 5. totalElements
                isFirst,                // 6. first
                isLast,                 // 7. last
                numberOfElements        // 8. number
        );
    }

    /**
     * Métodos para o Relatório de Movimentação
     */

    public Map<MovimentacaoEstoque.TipoMovimentacao, MovementSummaryDTO> getMovementSummaryByDateRange(LocalDateTime start, LocalDateTime end) {
        String sql = "SELECT tipo, COUNT(*) AS count, SUM(ABS(quantidade)) AS totalQuantity " +
                "FROM MovimentacaoEstoque " +
                "WHERE data_movimentacao BETWEEN ? AND ? " +
                "GROUP BY tipo";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            MovimentacaoEstoque.TipoMovimentacao tipo = mapTipoMovimentacao(rs.getString("tipo"));
            long count = rs.getLong("count");
            long totalQuantity = rs.getLong("totalQuantity");
            return Map.entry(tipo, new MovementSummaryDTO(count, totalQuantity));
        }, start, end).stream().collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    public List<TopProductMovementDTO> getTopMovingProductsByDateRange(LocalDateTime start, LocalDateTime end) {
        String sql = "SELECT m.id_produto, p.nome AS productName, " +
                "COUNT(*) AS totalMovements, " +
                "SUM(CASE WHEN m.quantidade > 0 THEN m.quantidade ELSE 0 END) AS inQuantity, " +
                "SUM(CASE WHEN m.quantidade < 0 THEN ABS(m.quantidade) ELSE 0 END) AS outQuantity " +
                "FROM MovimentacaoEstoque m " +
                "JOIN Produto p ON m.id_produto = p.id_produto " +
                "WHERE m.data_movimentacao BETWEEN ? AND ? " +
                "GROUP BY m.id_produto, p.nome " +
                "ORDER BY totalMovements DESC " +
                "LIMIT 5";

        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(TopProductMovementDTO.class), start, end);
    }

    public List<MovementByDayDTO> getMovementsByDayByDateRange(LocalDateTime start, LocalDateTime end) {
        String sql = "SELECT DATE(data_movimentacao) AS date, " +
                "COUNT(*) AS movements, " +
                "SUM(CASE WHEN m.quantidade > 0 THEN m.quantidade ELSE 0 END) AS inQuantity, " +
                "SUM(CASE WHEN m.quantidade < 0 THEN ABS(m.quantidade) ELSE 0 END) AS outQuantity " +
                "FROM MovimentacaoEstoque m " +
                "WHERE m.data_movimentacao BETWEEN ? AND ? " +
                "GROUP BY DATE(data_movimentacao) " +
                "ORDER BY date ASC";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            MovementByDayDTO dto = new MovementByDayDTO();
            dto.setDate(rs.getDate("date").toLocalDate());
            dto.setMovements(rs.getLong("movements"));
            dto.setInQuantity(rs.getLong("inQuantity"));
            dto.setOutQuantity(rs.getLong("outQuantity"));
            return dto;
        }, start, end);
    }

    public Long countMovementsSince(LocalDateTime dateTime) {
        String sql = "SELECT COUNT(*) FROM MovimentacaoEstoque WHERE data_movimentacao >= ?";
        return jdbcTemplate.queryForObject(sql, Long.class, Timestamp.valueOf(dateTime));
    }

    // TODO: Adicionar métodos complexos de busca com paginação e filtros
    // (getStockMovements e getProductStockHistory)

    @Override
    public Optional<MovimentacaoEstoque> findById(Long id) {
        try {
            MovimentacaoEstoque movimentacao = jdbcTemplate.queryForObject(SELECT_BY_ID_SQL, movimentacaoRowMapper(), id);
            return Optional.ofNullable(movimentacao);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public List<MovimentacaoEstoque> findAll() {
        return jdbcTemplate.query(SELECT_ALL_SQL, movimentacaoRowMapper());
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

    public List<MovimentacaoEstoque> findByProduto(Long idProduto) {
        return jdbcTemplate.query(
            "SELECT * FROM MovimentacaoEstoque WHERE id_produto = ? ORDER BY data_movimentacao DESC",
            movimentacaoRowMapper(),
            idProduto);
    }

    public List<MovimentacaoEstoque> findByTipo(MovimentacaoEstoque.TipoMovimentacao tipo) {
        return jdbcTemplate.query(
            "SELECT * FROM MovimentacaoEstoque WHERE tipo = ? ORDER BY data_movimentacao DESC",
            movimentacaoRowMapper(),
            tipo.name());
    }

    public List<MovimentacaoEstoque> findByPeriod(LocalDateTime inicio, LocalDateTime fim) {
        return jdbcTemplate.query(
            "SELECT * FROM MovimentacaoEstoque WHERE data_movimentacao BETWEEN ? AND ? ORDER BY data_movimentacao DESC",
            movimentacaoRowMapper(),
            Timestamp.valueOf(inicio),
            Timestamp.valueOf(fim));
    }

    private RowMapper<MovimentacaoEstoque> movimentacaoRowMapper() {
        return (ResultSet rs, int rowNum) -> {
            MovimentacaoEstoque movimentacao = new MovimentacaoEstoque();
            movimentacao.setId_movimentacao(rs.getLong("id_movimentacao"));
            movimentacao.setId_produto(rs.getLong("id_produto"));
            movimentacao.setId_usuario(rs.getObject("id_usuario", Long.class));

            Timestamp timestamp = rs.getTimestamp("data_movimentacao");
            if (timestamp != null) {
                movimentacao.setData_movimentacao(timestamp.toLocalDateTime());
            }

            movimentacao.setTipo(mapTipoMovimentacao(rs.getString("tipo")));
            movimentacao.setQuantidade(rs.getInt("quantidade"));
            movimentacao.setEstoque_anterior(rs.getInt("estoque_anterior"));
            movimentacao.setEstoque_atual(rs.getInt("estoque_atual"));
            movimentacao.setObservacao(rs.getString("observacao"));

            return movimentacao;
        };
    }

    /**
     * Mapeia valores antigos do enum para os novos valores
     * Mantém compatibilidade com dados existentes no banco
     */
    private MovimentacaoEstoque.TipoMovimentacao mapTipoMovimentacao(String tipo) {
        if (tipo == null) {
            return null;
        }
        
        // Mapeamento de valores antigos para novos
        switch (tipo.toUpperCase()) {
            case "ENTRADA":
                return MovimentacaoEstoque.TipoMovimentacao.IN;
            case "SAIDA_VENDA":
                return MovimentacaoEstoque.TipoMovimentacao.SALE;
            case "AJUSTE_POSITIVO":
                return MovimentacaoEstoque.TipoMovimentacao.ADJUSTMENT;
            case "AJUSTE_NEGATIVO":
                return MovimentacaoEstoque.TipoMovimentacao.ADJUSTMENT;
            case "DEVOLUCAO":
                return MovimentacaoEstoque.TipoMovimentacao.RETURN;
            // Valores novos (padrão)
            case "IN":
            case "OUT":
            case "ADJUSTMENT":
            case "LOSS":
            case "RETURN":
            case "SALE":
                return MovimentacaoEstoque.TipoMovimentacao.valueOf(tipo.toUpperCase());
            default:
                // Fallback para valores desconhecidos
                return MovimentacaoEstoque.TipoMovimentacao.ADJUSTMENT;
        }
    }
}
