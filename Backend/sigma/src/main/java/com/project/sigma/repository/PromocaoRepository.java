package com.project.sigma.repository;

import com.project.sigma.model.Promocao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Types;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

@Repository
public class PromocaoRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<Promocao> rowMapper = (rs, rowNum) -> {
        Promocao promocao = new Promocao();
        promocao.setId_promocao(rs.getLong("id_promocao"));
        promocao.setNome(rs.getString("nome"));
        promocao.setDescricao(rs.getString("descricao"));
        promocao.setTipo_desconto(Promocao.TipoDesconto.valueOf(rs.getString("tipo_desconto")));
        promocao.setValor_desconto(rs.getBigDecimal("valor_desconto"));
        promocao.setData_inicio(rs.getDate("data_inicio").toLocalDate());
        promocao.setData_fim(rs.getDate("data_fim").toLocalDate());
        promocao.setStatus(Promocao.StatusPromocao.valueOf(rs.getString("status")));
        return promocao;
    };

    public Optional<Promocao> findById(Long id) {
        String sql = "SELECT * FROM PROMOCAO WHERE id_promocao = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(sql, new Object[]{id}, rowMapper));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    // Método 'findAll' antigo (sem paginação/filtro) - mantido para referência se necessário
    // public List<Promocao> findAll() {
    //     String sql = "SELECT * FROM PROMOCAO";
    //     return jdbcTemplate.query(sql, rowMapper);
    // }

    //findAll com filtros e paginação (é oque o front usa)
    public List<Promocao> findAll(String search, Promocao.StatusPromocao status, int page, int size) {
        StringBuilder sql = new StringBuilder("SELECT * FROM PROMOCAO");
        List<Object> params = new ArrayList<>();
        List<Integer> types = new ArrayList<>();

        StringBuilder whereClause = new StringBuilder();

        if (search != null && !search.isEmpty()) {
            whereClause.append(" (LOWER(nome) LIKE ? OR LOWER(descricao) LIKE ?) ");
            String likeParam = "%" + search.toLowerCase() + "%";
            params.add(likeParam);
            params.add(likeParam);
            types.add(Types.VARCHAR);
            types.add(Types.VARCHAR);
        }

        if (status != null) {
            if (whereClause.length() > 0) {
                whereClause.append(" AND ");
            }
            whereClause.append(" status = ? ");
            params.add(status.name());
            types.add(Types.VARCHAR);
        }

        if (whereClause.length() > 0) {
            sql.append(" WHERE ").append(whereClause);
        }

        // Adiciona ordenação e paginação (sintaxe H2/PostgreSQL)
        sql.append(" ORDER BY data_inicio DESC, id_promocao DESC"); // Ordenação estável
        sql.append(" LIMIT ? OFFSET ? ");
        params.add(size);
        params.add(page * size);
        types.add(Types.INTEGER);
        types.add(Types.INTEGER);

        int[] paramTypes = types.stream().mapToInt(i -> i).toArray();

        return jdbcTemplate.query(sql.toString(), params.toArray(), paramTypes, rowMapper);
    }

    public int countAll(String search, Promocao.StatusPromocao status) {
        StringBuilder sql = new StringBuilder("SELECT count(*) FROM PROMOCAO");
        List<Object> params = new ArrayList<>();
        List<Integer> types = new ArrayList<>();

        StringBuilder whereClause = new StringBuilder();

        if (search != null && !search.isEmpty()) {
            whereClause.append(" (LOWER(nome) LIKE ? OR LOWER(descricao) LIKE ?) ");
            String likeParam = "%" + search.toLowerCase() + "%";
            params.add(likeParam);
            params.add(likeParam);
            types.add(Types.VARCHAR);
            types.add(Types.VARCHAR);
        }

        if (status != null) {
            if (whereClause.length() > 0) {
                whereClause.append(" AND ");
            }
            whereClause.append(" status = ? ");
            params.add(status.name());
            types.add(Types.VARCHAR);
        }

        if (whereClause.length() > 0) {
            sql.append(" WHERE ").append(whereClause);
        }

        int[] paramTypes = types.stream().mapToInt(i -> i).toArray();

        Integer count = jdbcTemplate.queryForObject(sql.toString(), params.toArray(), paramTypes, Integer.class);
        return (count != null) ? count : 0;
    }

    public Promocao save(Promocao promocao) {
        String sql = "INSERT INTO PROMOCAO (nome, descricao, tipo_desconto, valor_desconto, data_inicio, data_fim, status) VALUES (?, ?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, promocao.getNome());
            ps.setString(2, promocao.getDescricao());
            ps.setString(3, promocao.getTipo_desconto().name());
            ps.setBigDecimal(4, promocao.getValor_desconto());
            ps.setObject(5, promocao.getData_inicio());
            ps.setObject(6, promocao.getData_fim());
            ps.setString(7, promocao.getStatus().name());
            return ps;
        }, keyHolder);

        if (keyHolder.getKey() != null) {
            promocao.setId_promocao(keyHolder.getKey().longValue());
        }
        return promocao;
    }

    public void update(Promocao promocao) {
        String sql = "UPDATE PROMOCAO SET nome = ?, descricao = ?, tipo_desconto = ?, valor_desconto = ?, data_inicio = ?, data_fim = ?, status = ? WHERE id_promocao = ?";
        jdbcTemplate.update(sql,
                promocao.getNome(),
                promocao.getDescricao(),
                promocao.getTipo_desconto().name(),
                promocao.getValor_desconto(),
                promocao.getData_inicio(),
                promocao.getData_fim(),
                promocao.getStatus().name(),
                promocao.getId_promocao()
        );
    }

    public void updateStatus(Long id, Promocao.StatusPromocao status) {
        String sql = "UPDATE PROMOCAO SET status = ? WHERE id_promocao = ?";
        jdbcTemplate.update(sql, status.name(), id);
    }

    public void deleteById(Long id) {
        // A tabela PROMOCAO_PRODUTO usará ON DELETE CASCADE
        String sql = "DELETE FROM PROMOCAO WHERE id_promocao = ?";
        jdbcTemplate.update(sql, id);
    }

    // Método para a tarefa agendada
    public List<Promocao> findAllByStatus(Promocao.StatusPromocao status) {
        String sql = "SELECT * FROM PROMOCAO WHERE status = ?";
        return jdbcTemplate.query(sql, new Object[]{status.name()}, rowMapper);
    }
}