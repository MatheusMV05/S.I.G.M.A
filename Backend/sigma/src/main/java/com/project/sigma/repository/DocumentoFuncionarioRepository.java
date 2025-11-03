package com.project.sigma.repository;

import com.project.sigma.model.DocumentoFuncionario;
import com.project.sigma.model.DocumentoFuncionario.TipoDocumento;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Repository
public class DocumentoFuncionarioRepository implements BaseRepository<DocumentoFuncionario, Long> {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final String INSERT_SQL =
            "INSERT INTO DocumentoFuncionario (id_funcionario, tipo_documento, numero_documento, arquivo_url, " +
            "data_emissao, data_validade, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?)";

    private static final String SELECT_BY_ID_SQL =
            "SELECT d.*, p.nome as nome_funcionario, f.matricula as matricula_funcionario " +
            "FROM DocumentoFuncionario d " +
            "LEFT JOIN Funcionario f ON d.id_funcionario = f.id_pessoa " +
            "LEFT JOIN Pessoa p ON f.id_pessoa = p.id_pessoa " +
            "WHERE d.id_documento = ?";

    private static final String SELECT_ALL_SQL =
            "SELECT d.*, p.nome as nome_funcionario, f.matricula as matricula_funcionario " +
            "FROM DocumentoFuncionario d " +
            "LEFT JOIN Funcionario f ON d.id_funcionario = f.id_pessoa " +
            "LEFT JOIN Pessoa p ON f.id_pessoa = p.id_pessoa " +
            "ORDER BY d.data_cadastro DESC";

    private static final String UPDATE_SQL =
            "UPDATE DocumentoFuncionario SET tipo_documento = ?, numero_documento = ?, arquivo_url = ?, " +
            "data_emissao = ?, data_validade = ?, observacoes = ? WHERE id_documento = ?";

    private static final String DELETE_SQL =
            "DELETE FROM DocumentoFuncionario WHERE id_documento = ?";

    private static final String EXISTS_SQL =
            "SELECT COUNT(*) FROM DocumentoFuncionario WHERE id_documento = ?";

    @Override
    public DocumentoFuncionario save(DocumentoFuncionario documento) {
        if (documento.getIdDocumento() != null && existsById(documento.getIdDocumento())) {
            return update(documento);
        } else {
            return insert(documento);
        }
    }

    private DocumentoFuncionario insert(DocumentoFuncionario documento) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(INSERT_SQL, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, documento.getIdFuncionario());
            ps.setString(2, documento.getTipoDocumento().name());
            ps.setString(3, documento.getNumeroDocumento());
            ps.setString(4, documento.getArquivoUrl());
            ps.setDate(5, documento.getDataEmissao() != null ? Date.valueOf(documento.getDataEmissao()) : null);
            ps.setDate(6, documento.getDataValidade() != null ? Date.valueOf(documento.getDataValidade()) : null);
            ps.setString(7, documento.getObservacoes());
            return ps;
        }, keyHolder);

        documento.setIdDocumento(keyHolder.getKey().longValue());
        return documento;
    }

    private DocumentoFuncionario update(DocumentoFuncionario documento) {
        jdbcTemplate.update(UPDATE_SQL,
                documento.getTipoDocumento().name(),
                documento.getNumeroDocumento(),
                documento.getArquivoUrl(),
                documento.getDataEmissao() != null ? Date.valueOf(documento.getDataEmissao()) : null,
                documento.getDataValidade() != null ? Date.valueOf(documento.getDataValidade()) : null,
                documento.getObservacoes(),
                documento.getIdDocumento());
        return documento;
    }

    @Override
    public Optional<DocumentoFuncionario> findById(Long id) {
        try {
            DocumentoFuncionario documento = jdbcTemplate.queryForObject(SELECT_BY_ID_SQL, documentoRowMapper(), id);
            return Optional.ofNullable(documento);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public List<DocumentoFuncionario> findAll() {
        return jdbcTemplate.query(SELECT_ALL_SQL, documentoRowMapper());
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

    /**
     * Busca documentos por funcionário
     */
    public List<DocumentoFuncionario> findByFuncionario(Long idFuncionario) {
        String sql = "SELECT d.*, p.nome as nome_funcionario, f.matricula as matricula_funcionario " +
                "FROM DocumentoFuncionario d " +
                "LEFT JOIN Funcionario f ON d.id_funcionario = f.id_pessoa " +
                "LEFT JOIN Pessoa p ON f.id_pessoa = p.id_pessoa " +
                "WHERE d.id_funcionario = ? " +
                "ORDER BY d.tipo_documento, d.data_cadastro DESC";
        
        return jdbcTemplate.query(sql, documentoRowMapper(), idFuncionario);
    }

    /**
     * Busca documentos por tipo
     */
    public List<DocumentoFuncionario> findByTipo(TipoDocumento tipoDocumento) {
        String sql = "SELECT d.*, p.nome as nome_funcionario, f.matricula as matricula_funcionario " +
                "FROM DocumentoFuncionario d " +
                "LEFT JOIN Funcionario f ON d.id_funcionario = f.id_pessoa " +
                "LEFT JOIN Pessoa p ON f.id_pessoa = p.id_pessoa " +
                "WHERE d.tipo_documento = ? " +
                "ORDER BY p.nome";
        
        return jdbcTemplate.query(sql, documentoRowMapper(), tipoDocumento.name());
    }

    /**
     * Busca documentos vencidos
     */
    public List<DocumentoFuncionario> findDocumentosVencidos() {
        String sql = "SELECT d.*, p.nome as nome_funcionario, f.matricula as matricula_funcionario " +
                "FROM DocumentoFuncionario d " +
                "LEFT JOIN Funcionario f ON d.id_funcionario = f.id_pessoa " +
                "LEFT JOIN Pessoa p ON f.id_pessoa = p.id_pessoa " +
                "WHERE d.data_validade IS NOT NULL AND d.data_validade < CURDATE() " +
                "ORDER BY d.data_validade";
        
        return jdbcTemplate.query(sql, documentoRowMapper());
    }

    /**
     * Busca documentos a vencer nos próximos dias
     */
    public List<DocumentoFuncionario> findDocumentosAVencer(int dias) {
        String sql = "SELECT d.*, p.nome as nome_funcionario, f.matricula as matricula_funcionario " +
                "FROM DocumentoFuncionario d " +
                "LEFT JOIN Funcionario f ON d.id_funcionario = f.id_pessoa " +
                "LEFT JOIN Pessoa p ON f.id_pessoa = p.id_pessoa " +
                "WHERE d.data_validade IS NOT NULL " +
                "AND d.data_validade BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY) " +
                "ORDER BY d.data_validade";
        
        return jdbcTemplate.query(sql, documentoRowMapper(), dias);
    }

    /**
     * Busca documento específico por funcionário e tipo
     */
    public Optional<DocumentoFuncionario> findByFuncionarioAndTipo(Long idFuncionario, TipoDocumento tipoDocumento) {
        String sql = "SELECT d.*, p.nome as nome_funcionario, f.matricula as matricula_funcionario " +
                "FROM DocumentoFuncionario d " +
                "LEFT JOIN Funcionario f ON d.id_funcionario = f.id_pessoa " +
                "LEFT JOIN Pessoa p ON f.id_pessoa = p.id_pessoa " +
                "WHERE d.id_funcionario = ? AND d.tipo_documento = ? " +
                "ORDER BY d.data_cadastro DESC LIMIT 1";
        
        try {
            DocumentoFuncionario documento = jdbcTemplate.queryForObject(sql, documentoRowMapper(), 
                    idFuncionario, tipoDocumento.name());
            return Optional.ofNullable(documento);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    private RowMapper<DocumentoFuncionario> documentoRowMapper() {
        return (ResultSet rs, int rowNum) -> {
            DocumentoFuncionario documento = new DocumentoFuncionario();
            documento.setIdDocumento(rs.getLong("id_documento"));
            documento.setIdFuncionario(rs.getLong("id_funcionario"));
            documento.setTipoDocumento(TipoDocumento.valueOf(rs.getString("tipo_documento")));
            documento.setNumeroDocumento(rs.getString("numero_documento"));
            documento.setArquivoUrl(rs.getString("arquivo_url"));
            
            Date dataEmissao = rs.getDate("data_emissao");
            if (dataEmissao != null) {
                documento.setDataEmissao(dataEmissao.toLocalDate());
            }
            
            Date dataValidade = rs.getDate("data_validade");
            if (dataValidade != null) {
                documento.setDataValidade(dataValidade.toLocalDate());
            }
            
            documento.setObservacoes(rs.getString("observacoes"));
            
            Timestamp dataCadastro = rs.getTimestamp("data_cadastro");
            if (dataCadastro != null) {
                documento.setDataCadastro(dataCadastro.toLocalDateTime());
            }
            
            // Informações adicionais
            documento.setNomeFuncionario(rs.getString("nome_funcionario"));
            documento.setMatriculaFuncionario(rs.getString("matricula_funcionario"));
            
            return documento;
        };
    }
}
