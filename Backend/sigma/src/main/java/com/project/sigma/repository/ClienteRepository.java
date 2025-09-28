package com.project.sigma.repository;

import com.project.sigma.dto.ClienteDTO;
import com.project.sigma.model.Pessoa;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Objects;

@Repository
public class ClienteRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public ClienteRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    //Leitura de dados:

    /**
     * Busca todos os clientes (PF e PJ) e retorna uma lista de DTOs.
     */
    public List<ClienteDTO> findAll() {
        String sql = "SELECT " +
                "p.id_pessoa, p.nome, p.rua, p.numero, p.bairro, p.cidade, " +
                "c.ranke, " +
                "cf.cpf, " +
                "cj.cnpj " +
                "FROM Pessoa p " +
                "JOIN Cliente c ON p.id_pessoa = c.id_pessoa " +
                "LEFT JOIN cliente_fisica cf ON c.id_pessoa = cf.id_pessoa " +
                "LEFT JOIN cliente_juridico cj ON c.id_pessoa = cj.id_pessoa " +
                "ORDER BY p.nome;";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Pessoa pessoa = new Pessoa();
            pessoa.setId_pessoa(rs.getLong("id_pessoa"));
            pessoa.setNome(rs.getString("nome"));
            pessoa.setRua(rs.getString("rua"));
            pessoa.setNumero(rs.getString("numero"));
            pessoa.setBairro(rs.getString("bairro"));
            pessoa.setCidade(rs.getString("cidade"));

            ClienteDTO dto = new ClienteDTO();
            dto.setPessoa(pessoa);
            dto.setRanke(rs.getInt("ranke"));
            dto.setCpf(rs.getString("cpf"));
            dto.setCnpj(rs.getString("cnpj"));

            if (dto.getCpf() != null) {
                dto.setTipoCliente("PF");
            } else if (dto.getCnpj() != null) {
                dto.setTipoCliente("PJ");
            }

            return dto;
        });
    }

    //Salvar clientes (inserção):

    /**
     * Salva um novo cliente (PF ou PJ) no banco de dados.
     */
    @Transactional
    public ClienteDTO save(ClienteDTO clienteDTO) {
        // 1. Salvar na tabela Pessoa e obter o ID gerado
        String pessoaSql = "INSERT INTO Pessoa (nome, rua, numero, bairro, cidade) VALUES (?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(pessoaSql, Statement.RETURN_GENERATED_KEYS);
            Pessoa pessoa = clienteDTO.getPessoa();
            ps.setString(1, pessoa.getNome());
            ps.setString(2, pessoa.getRua());
            ps.setString(3, pessoa.getNumero());
            ps.setString(4, pessoa.getBairro());
            ps.setString(5, pessoa.getCidade());
            return ps;
        }, keyHolder);

        long generatedPessoaId = Objects.requireNonNull(keyHolder.getKey()).longValue();
        clienteDTO.getPessoa().setId_pessoa(generatedPessoaId);

        // 2. Salvar na tabela Cliente
        String clienteSql = "INSERT INTO Cliente (id_pessoa, ranke) VALUES (?, ?)";
        jdbcTemplate.update(clienteSql, generatedPessoaId, clienteDTO.getRanke() != null ? clienteDTO.getRanke() : 1);

        // 3. Salvar na tabela específica (PF ou PJ)
        if ("PF".equals(clienteDTO.getTipoCliente())) {
            String pfSql = "INSERT INTO cliente_fisica (id_pessoa, cpf) VALUES (?, ?)";
            jdbcTemplate.update(pfSql, generatedPessoaId, clienteDTO.getCpf());
        } else if ("PJ".equals(clienteDTO.getTipoCliente())) {
            String pjSql = "INSERT INTO cliente_juridico (id_pessoa, cnpj) VALUES (?, ?)";
            jdbcTemplate.update(pjSql, generatedPessoaId, clienteDTO.getCnpj());
        } else {
            throw new IllegalArgumentException("Tipo de cliente inválido: " + clienteDTO.getTipoCliente());
        }
        //Todo cliente criado vai ter cmo rank inicial "1" = bronze!!!!
        clienteDTO.setRanke(1);

        return clienteDTO;
    }

    //update de ou um cliente pj ou um cliente fisico:

    /**
     * Atualiza um cliente existente (PF ou PJ) no banco de dados.
     */
    @Transactional
    public ClienteDTO update(ClienteDTO clienteDTO) {
        Pessoa pessoa = clienteDTO.getPessoa();
        Long id = pessoa.getId_pessoa();

        if (id == null) {
            throw new IllegalArgumentException("ID da pessoa não pode ser nulo para atualização.");
        }

        // 1. Atualizar a tabela Pessoa
        String pessoaSql = "UPDATE Pessoa SET nome = ?, rua = ?, numero = ?, bairro = ?, cidade = ? WHERE id_pessoa = ?";
        jdbcTemplate.update(pessoaSql, pessoa.getNome(), pessoa.getRua(), pessoa.getNumero(), pessoa.getBairro(), pessoa.getCidade(), id);

        // 2. Atualizar a tabela específica (PF ou PJ)
        if ("PF".equals(clienteDTO.getTipoCliente())) {
            String pfSql = "UPDATE cliente_fisica SET cpf = ? WHERE id_pessoa = ?";
            jdbcTemplate.update(pfSql, clienteDTO.getCpf(), id);
        } else if ("PJ".equals(clienteDTO.getTipoCliente())) {
            String pjSql = "UPDATE cliente_juridico SET cnpj = ? WHERE id_pessoa = ?";
            jdbcTemplate.update(pjSql, clienteDTO.getCnpj(), id);
        }

        return clienteDTO;
    }

    //Deletar um cliente (remoção):

    /**
     * Deleta um cliente pelo ID.
     */
    public void deleteById(Long id) {
        String sql = "DELETE FROM Pessoa WHERE id_pessoa = ?";
        jdbcTemplate.update(sql, id);
    }
}


