package com.project.sigma.repository;

import com.project.sigma.model.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class UsuarioRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Busca um usuário pelo seu username (login).
     * A query agora é muito mais simples, consultando apenas a tabela Usuario.
     */
    public Optional<Usuario> findByLogin(String login) {
        String sql = "SELECT id_usuario, nome, username, password, role, status FROM Usuario WHERE username = ?";
        try {
            // BeanPropertyRowMapper mapeia automaticamente as colunas do SQL para os campos da classe Usuario
            Usuario usuario = jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(Usuario.class), login);
            return Optional.ofNullable(usuario);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty(); // Retorna um Optional vazio se nenhum usuário for encontrado
        }
    }

    /**
     * Verifica se um usuário com o username fornecido já existe.
     * Útil para a criação do admin padrão.
     */
    public boolean existsByUsername(String username) {
        String sql = "SELECT COUNT(*) FROM Usuario WHERE username = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, username);
        return count != null && count > 0;
    }

    /**
     * Salva um novo usuário no banco de dados.
     */
    public void save(Usuario usuario) {
        String sql = "INSERT INTO Usuario (nome, username, password, role, status) VALUES (?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, usuario.getNome(), usuario.getUsername(), usuario.getPassword(), usuario.getRole(), usuario.getStatus());
    }
}