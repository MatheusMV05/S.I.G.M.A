package com.project.sigma.repository;

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

            movimentacao.setTipo(MovimentacaoEstoque.TipoMovimentacao.valueOf(rs.getString("tipo")));
            movimentacao.setQuantidade(rs.getInt("quantidade"));
            movimentacao.setEstoque_anterior(rs.getInt("estoque_anterior"));
            movimentacao.setEstoque_atual(rs.getInt("estoque_atual"));
            movimentacao.setObservacao(rs.getString("observacao"));

            return movimentacao;
        };
    }
}
