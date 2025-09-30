package com.project.sigma.repository;

import com.project.sigma.model.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class UsuarioRepository implements BaseRepository<Usuario, Long> {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final String INSERT_SQL =
        "INSERT INTO Usuario (id_pessoa, username, password, role, status, ultimo_acesso) " +
        "VALUES (?, ?, ?, ?, ?, ?)";

    private static final String SELECT_BY_ID_SQL =
        "SELECT * FROM Usuario WHERE id_pessoa = ?";

    private static final String SELECT_ALL_SQL =
        "SELECT * FROM Usuario";

    private static final String UPDATE_SQL =
        "UPDATE Usuario SET username = ?, password = ?, role = ?, status = ?, ultimo_acesso = ? " +
        "WHERE id_pessoa = ?";

    private static final String DELETE_SQL =
        "DELETE FROM Usuario WHERE id_pessoa = ?";

    private static final String EXISTS_SQL =
        "SELECT COUNT(*) FROM Usuario WHERE id_pessoa = ?";

    private static final String SELECT_BY_USERNAME_SQL =
        "SELECT * FROM Usuario WHERE username = ?";

    @Override
    public Usuario save(Usuario usuario) {
        if (existsById(usuario.getId_pessoa())) {
            return update(usuario);
        } else {
            return insert(usuario);
        }
    }

    private Usuario insert(Usuario usuario) {
        jdbcTemplate.update(INSERT_SQL,
            usuario.getId_pessoa(),
            usuario.getUsername(),
            usuario.getPassword(),
            usuario.getRole().name(),
            usuario.getStatus().name(),
            usuario.getUltimo_acesso() != null ? Timestamp.valueOf(usuario.getUltimo_acesso()) : null);
        return usuario;
    }

    private Usuario update(Usuario usuario) {
        jdbcTemplate.update(UPDATE_SQL,
            usuario.getUsername(),
            usuario.getPassword(),
            usuario.getRole().name(),
            usuario.getStatus().name(),
            usuario.getUltimo_acesso() != null ? Timestamp.valueOf(usuario.getUltimo_acesso()) : null,
            usuario.getId_pessoa());
        return usuario;
    }

    @Override
    public Optional<Usuario> findById(Long id) {
        try {
            Usuario usuario = jdbcTemplate.queryForObject(SELECT_BY_ID_SQL, usuarioRowMapper(), id);
            return Optional.ofNullable(usuario);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public List<Usuario> findAll() {
        return jdbcTemplate.query(SELECT_ALL_SQL, usuarioRowMapper());
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

    public Optional<Usuario> findByUsername(String username) {
        try {
            Usuario usuario = jdbcTemplate.queryForObject(SELECT_BY_USERNAME_SQL, usuarioRowMapper(), username);
            return Optional.ofNullable(usuario);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public void updateLastAccess(Long id, LocalDateTime lastAccess) {
        jdbcTemplate.update(
            "UPDATE Usuario SET ultimo_acesso = ? WHERE id_pessoa = ?",
            Timestamp.valueOf(lastAccess), id);
    }


    private RowMapper<Usuario> usuarioRowMapper() {
        return (ResultSet rs, int rowNum) -> {
            Usuario usuario = new Usuario();
            usuario.setId_pessoa(rs.getLong("id_pessoa"));
            usuario.setUsername(rs.getString("username"));
            usuario.setPassword(rs.getString("password"));
            usuario.setRole(Usuario.Role.valueOf(rs.getString("role")));
            usuario.setStatus(Usuario.StatusUsuario.valueOf(rs.getString("status")));

            Timestamp timestamp = rs.getTimestamp("ultimo_acesso");
            if (timestamp != null) {
                usuario.setUltimo_acesso(timestamp.toLocalDateTime());
            }

            return usuario;
        };
    }
}