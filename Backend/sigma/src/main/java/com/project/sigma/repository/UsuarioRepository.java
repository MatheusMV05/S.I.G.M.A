package com.project.sigma.repository;

import com.project.sigma.model.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class UsuarioRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<Usuario> rowMapper = (rs, rowNum) -> {
        Usuario usuario = new Usuario();
        usuario.setId(rs.getLong("id_pessoa"));
        usuario.setNome(rs.getString("nome"));
        usuario.setLogin(rs.getString("login"));
        usuario.setSenha(rs.getString("senha"));
        usuario.setRole(rs.getString("role"));
        return usuario;
    };

    public Optional<Usuario> findByLogin(String login) {
        // ----- A CORREÇÃO ESTÁ AQUI -----
        String sql = "SELECT u.id_pessoa, p.nome, u.login, u.senha, u.role " +
                "FROM usuario u " +
                "JOIN funcionario f ON u.id_pessoa = f.id_pessoa " +
                "JOIN pessoa p ON f.id_pessoa = p.id_pessoa " + // Trocamos p.id por p.id_pessoa
                "WHERE u.login = ?";
        // ----- FIM DA CORREÇÃO -----
        try {
            Usuario usuario = jdbcTemplate.queryForObject(sql, new Object[]{login}, rowMapper);
            return Optional.of(usuario);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public Usuario save(Usuario usuario) {
        String sql = "INSERT INTO usuario (id_pessoa, login, senha, role) VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                usuario.getId(),
                usuario.getLogin(),
                usuario.getSenha(),
                usuario.getRole()
        );
        // Retornamos o usuário salvo. Em um sistema real, poderíamos buscar o ID gerado.
        return usuario;
    }
}