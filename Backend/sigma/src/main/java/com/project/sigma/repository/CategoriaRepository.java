package com.project.sigma.repository;

import com.project.sigma.model.Categoria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.List;
import java.util.Optional;

@Repository
public class CategoriaRepository implements BaseRepository<Categoria, Long> {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final String INSERT_SQL =
        "INSERT INTO Categoria (nome, descricao, status) VALUES (?, ?, ?)";

    private static final String SELECT_BY_ID_SQL =
        "SELECT * FROM Categoria WHERE id_categoria = ?";

    private static final String SELECT_ALL_SQL =
        "SELECT * FROM Categoria ORDER BY nome";

    private static final String UPDATE_SQL =
        "UPDATE Categoria SET nome = ?, descricao = ?, status = ? WHERE id_categoria = ?";

    private static final String DELETE_SQL =
        "DELETE FROM Categoria WHERE id_categoria = ?";

    private static final String EXISTS_SQL =
        "SELECT COUNT(*) FROM Categoria WHERE id_categoria = ?";

    @Override
    public Categoria save(Categoria categoria) {
        if (categoria.getId_categoria() == null) {
            return insert(categoria);
        } else {
            return update(categoria);
        }
    }

    private Categoria insert(Categoria categoria) {
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(INSERT_SQL, new String[]{"id_categoria"});
            ps.setString(1, categoria.getNome());
            ps.setString(2, categoria.getDescricao());
            ps.setString(3, categoria.getStatus().name());
            return ps;
        }, keyHolder);

        categoria.setId_categoria(keyHolder.getKey().longValue());
        return categoria;
    }

    private Categoria update(Categoria categoria) {
        jdbcTemplate.update(UPDATE_SQL,
            categoria.getNome(),
            categoria.getDescricao(),
            categoria.getStatus().name(),
            categoria.getId_categoria());
        return categoria;
    }

    @Override
    public Optional<Categoria> findById(Long id) {
        try {
            Categoria categoria = jdbcTemplate.queryForObject(SELECT_BY_ID_SQL, categoriaRowMapper(), id);
            return Optional.ofNullable(categoria);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public List<Categoria> findAll() {
        return jdbcTemplate.query(SELECT_ALL_SQL, categoriaRowMapper());
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

    public List<Categoria> findByStatus(Categoria.StatusCategoria status) {
        return jdbcTemplate.query(
            "SELECT * FROM Categoria WHERE status = ? ORDER BY nome",
            categoriaRowMapper(),
            status.name());
    }

    public Optional<Categoria> findByNome(String nome) {
        try {
            Categoria categoria = jdbcTemplate.queryForObject(
                "SELECT * FROM Categoria WHERE nome = ?",
                categoriaRowMapper(),
                nome);
            return Optional.ofNullable(categoria);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public Optional<Categoria> findByNomeIgnoreCase(String nome) {
        try {
            Categoria categoria = jdbcTemplate.queryForObject(
                "SELECT * FROM Categoria WHERE LOWER(nome) = LOWER(?)",
                categoriaRowMapper(),
                nome);
            return Optional.ofNullable(categoria);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public List<Categoria> findByAtivo(Boolean ativo) {
        Categoria.StatusCategoria status = ativo ? Categoria.StatusCategoria.ATIVA : Categoria.StatusCategoria.INATIVA;
        return findByStatus(status);
    }

    public List<Categoria> findByNomeContainingIgnoreCaseAndAtivo(String nome, Boolean ativo) {
        Categoria.StatusCategoria status = ativo ? Categoria.StatusCategoria.ATIVA : Categoria.StatusCategoria.INATIVA;
        return jdbcTemplate.query(
            "SELECT * FROM Categoria WHERE LOWER(nome) LIKE LOWER(?) AND status = ? ORDER BY nome",
            categoriaRowMapper(),
            "%" + nome + "%",
            status.name());
    }

    public boolean temProdutosVinculados(Long id) {
        Integer count = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM Produto WHERE id_categoria = ?",
            Integer.class,
            id);
        return count != null && count > 0;
    }

    public void removerCategoriaDosProdutos(Long id) {
        jdbcTemplate.update(
            "UPDATE Produto SET id_categoria = NULL WHERE id_categoria = ?",
            id);
    }

    public void delete(Categoria categoria) {
        deleteById(categoria.getId_categoria());
    }

    private RowMapper<Categoria> categoriaRowMapper() {
        return (ResultSet rs, int rowNum) -> {
            Categoria categoria = new Categoria();
            categoria.setId_categoria(rs.getLong("id_categoria"));
            categoria.setNome(rs.getString("nome"));
            categoria.setDescricao(rs.getString("descricao"));
            categoria.setStatus(Categoria.StatusCategoria.valueOf(rs.getString("status")));
            return categoria;
        };
    }
}
