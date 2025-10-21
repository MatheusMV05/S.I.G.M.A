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

    public List<Promocao> findAll() {
        String sql = "SELECT * FROM PROMOCAO";
        return jdbcTemplate.query(sql, rowMapper);
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