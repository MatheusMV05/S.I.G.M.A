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

    /**
     * Busca todos os usuários com informações do funcionário associado
     */
    public List<Usuario> findAllWithFuncionarioInfo() {
        String sql = "SELECT u.*, " +
                    "p.nome, p.email, " +
                    "t.numero as telefone, " +
                    "f.cpf, f.matricula, f.salario, f.cargo, f.setor, f.data_admissao, " +
                    "f.turno, f.tipo_contrato, f.carga_horaria_semanal, " +
                    "f.comissao_percentual, f.meta_mensal, f.id_supervisor " +
                    "FROM Usuario u " +
                    "INNER JOIN Funcionario f ON u.id_pessoa = f.id_pessoa " +
                    "INNER JOIN Pessoa p ON f.id_pessoa = p.id_pessoa " +
                    "LEFT JOIN Telefone t ON p.id_pessoa = t.id_pessoa";
        
        return jdbcTemplate.query(sql, usuarioComFuncionarioRowMapper());
    }

    /**
     * Busca usuário por ID com informações do funcionário
     */
    public Optional<Usuario> findByIdWithFuncionarioInfo(Long id) {
        String sql = "SELECT u.*, " +
                    "p.nome, p.email, " +
                    "t.numero as telefone, " +
                    "f.cpf, f.matricula, f.salario, f.cargo, f.setor, f.data_admissao, " +
                    "f.turno, f.tipo_contrato, f.carga_horaria_semanal, " +
                    "f.comissao_percentual, f.meta_mensal, f.id_supervisor, " +
                    "s.nome as supervisor_nome " +
                    "FROM Usuario u " +
                    "INNER JOIN Funcionario f ON u.id_pessoa = f.id_pessoa " +
                    "INNER JOIN Pessoa p ON f.id_pessoa = p.id_pessoa " +
                    "LEFT JOIN Telefone t ON p.id_pessoa = t.id_pessoa " +
                    "LEFT JOIN Funcionario sf ON f.id_supervisor = sf.id_pessoa " +
                    "LEFT JOIN Pessoa s ON sf.id_pessoa = s.id_pessoa " +
                    "WHERE u.id_pessoa = ?";
        
        try {
            Usuario usuario = jdbcTemplate.queryForObject(sql, usuarioComFuncionarioCompletoRowMapper(), id);
            return Optional.ofNullable(usuario);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    /**
     * Busca usuários filtrados por role
     */
    public List<Usuario> findByRole(String role) {
        String sql = "SELECT u.*, " +
                    "p.nome, p.email, " +
                    "t.numero as telefone, " +
                    "f.cpf, f.matricula, f.salario, f.cargo, f.setor, f.data_admissao, " +
                    "f.turno, f.tipo_contrato, f.carga_horaria_semanal, " +
                    "f.comissao_percentual, f.meta_mensal, f.id_supervisor " +
                    "FROM Usuario u " +
                    "INNER JOIN Funcionario f ON u.id_pessoa = f.id_pessoa " +
                    "INNER JOIN Pessoa p ON f.id_pessoa = p.id_pessoa " +
                    "LEFT JOIN Telefone t ON p.id_pessoa = t.id_pessoa " +
                    "WHERE u.role = ?";
        
        return jdbcTemplate.query(sql, usuarioComFuncionarioRowMapper(), role);
    }

    /**
     * Busca usuários filtrados por status
     */
    public List<Usuario> findByStatus(String status) {
        String sql = "SELECT u.*, " +
                    "p.nome, p.email, " +
                    "t.numero as telefone, " +
                    "f.cpf, f.matricula, f.salario, f.cargo, f.setor, f.data_admissao, " +
                    "f.turno, f.tipo_contrato, f.carga_horaria_semanal, " +
                    "f.comissao_percentual, f.meta_mensal, f.id_supervisor " +
                    "FROM Usuario u " +
                    "INNER JOIN Funcionario f ON u.id_pessoa = f.id_pessoa " +
                    "INNER JOIN Pessoa p ON f.id_pessoa = p.id_pessoa " +
                    "LEFT JOIN Telefone t ON p.id_pessoa = t.id_pessoa " +
                    "WHERE u.status = ?";
        
        return jdbcTemplate.query(sql, usuarioComFuncionarioRowMapper(), status);
    }

    /**
     * Atualiza apenas o status do usuário
     */
    public void updateStatus(Long id, String status) {
        jdbcTemplate.update("UPDATE Usuario SET status = ? WHERE id_pessoa = ?", status, id);
    }

    /**
     * Conta usuários por role
     */
    public int countByRole(String role) {
        String sql = "SELECT COUNT(*) FROM Usuario WHERE role = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, role);
        return count != null ? count : 0;
    }

    /**
     * Conta usuários ativos
     */
    public int countActive() {
        String sql = "SELECT COUNT(*) FROM Usuario WHERE status = 'ATIVO'";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class);
        return count != null ? count : 0;
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

    private RowMapper<Usuario> usuarioComFuncionarioRowMapper() {
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

            // Criar objeto Funcionario com dados da Pessoa
            com.project.sigma.model.Funcionario funcionario = new com.project.sigma.model.Funcionario();
            funcionario.setId_pessoa(rs.getLong("id_pessoa"));
            funcionario.setCpf(rs.getString("cpf"));
            funcionario.setMatricula(rs.getString("matricula"));
            funcionario.setSalario(rs.getBigDecimal("salario"));
            funcionario.setCargo(rs.getString("cargo"));
            funcionario.setSetor(rs.getString("setor"));
            
            java.sql.Date dataAdmissao = rs.getDate("data_admissao");
            if (dataAdmissao != null) {
                funcionario.setData_admissao(dataAdmissao.toLocalDate());
            }

            String turno = rs.getString("turno");
            if (turno != null) {
                funcionario.setTurno(com.project.sigma.model.Funcionario.TurnoTrabalho.valueOf(turno));
            }

            String tipoContrato = rs.getString("tipo_contrato");
            if (tipoContrato != null) {
                funcionario.setTipo_contrato(com.project.sigma.model.Funcionario.TipoContrato.valueOf(tipoContrato));
            }

            funcionario.setCarga_horaria_semanal(rs.getInt("carga_horaria_semanal"));
            funcionario.setComissao_percentual(rs.getBigDecimal("comissao_percentual"));
            funcionario.setMeta_mensal(rs.getBigDecimal("meta_mensal"));
            
            Long idSupervisor = rs.getLong("id_supervisor");
            if (!rs.wasNull()) {
                funcionario.setId_supervisor(idSupervisor);
            }

            // Criar objeto Pessoa
            com.project.sigma.model.Pessoa pessoa = new com.project.sigma.model.Pessoa();
            pessoa.setId_pessoa(rs.getLong("id_pessoa"));
            pessoa.setNome(rs.getString("nome"));
            pessoa.setEmail(rs.getString("email"));
            
            // Criar lista de telefones se existir
            String telefone = rs.getString("telefone");
            if (telefone != null) {
                com.project.sigma.model.Telefone tel = new com.project.sigma.model.Telefone();
                tel.setNumero(telefone);
                pessoa.setTelefones(java.util.List.of(tel));
            }

            funcionario.setPessoa(pessoa);
            usuario.setFuncionario(funcionario);

            return usuario;
        };
    }

    private RowMapper<Usuario> usuarioComFuncionarioCompletoRowMapper() {
        return (ResultSet rs, int rowNum) -> {
            Usuario usuario = usuarioComFuncionarioRowMapper().mapRow(rs, rowNum);
            
            // Adicionar nome do supervisor se existir
            String supervisorNome = rs.getString("supervisor_nome");
            if (supervisorNome != null && usuario.getFuncionario() != null) {
                com.project.sigma.model.Funcionario supervisor = new com.project.sigma.model.Funcionario();
                supervisor.setId_pessoa(usuario.getFuncionario().getId_supervisor());
                
                com.project.sigma.model.Pessoa pessoaSupervisor = new com.project.sigma.model.Pessoa();
                pessoaSupervisor.setNome(supervisorNome);
                supervisor.setPessoa(pessoaSupervisor);
                
                usuario.getFuncionario().setSupervisor(supervisor);
            }

            return usuario;
        };
    }
}