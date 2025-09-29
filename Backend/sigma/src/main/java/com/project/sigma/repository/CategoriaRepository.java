package com.project.sigma.repository;

import com.project.sigma.model.Categoria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Repository
public class CategoriaRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public CategoriaRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private static final class CategoriaRowMapper implements RowMapper<Categoria> {
        @Override
        public Categoria mapRow(ResultSet rs, int rowNum) throws SQLException {
            Categoria categoria = new Categoria();
            categoria.setId_categoria(rs.getLong("id_categoria"));
            categoria.setNome(rs.getString("nome"));
            categoria.setDescricao(rs.getString("descricao"));
            categoria.setAtivo(rs.getBoolean("ativo"));
            categoria.setData_criacao(rs.getTimestamp("data_criacao").toLocalDateTime());
            categoria.setData_atualizacao(rs.getTimestamp("data_atualizacao").toLocalDateTime());
            return categoria;
        }
    }

    // BUSCAR TODAS as categorias
    public List<Categoria> findAll() {
        String sql = "SELECT * FROM Categoria WHERE ativo = TRUE ORDER BY nome ASC";
        return jdbcTemplate.query(sql, new CategoriaRowMapper());
    }

    // BUSCAR UMA categoria por ID
    public Optional<Categoria> findById(Long id) {
        String sql = "SELECT * FROM Categoria WHERE id_categoria = ?";
        try {
            Categoria categoria = jdbcTemplate.queryForObject(sql, new Object[]{id}, new CategoriaRowMapper());
            return Optional.ofNullable(categoria);
        } catch (Exception e) {
            return Optional.empty(); // Retorna vazio se não encontrar, o que é o esperado
        }
    }
}
