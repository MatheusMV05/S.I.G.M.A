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
import java.util.ArrayList;


@Repository
public class ClienteRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public ClienteRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    //Salvar clientes (inserção):

    /**
     * Salva um novo cliente (PF ou PJ) no banco de dados.
     */
    @Transactional
    public ClienteDTO save(ClienteDTO clienteDTO) {
        // 1. Salvar na tabela Pessoa (nenhuma alteração aqui)
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
        String clienteSql = "INSERT INTO Cliente (id_pessoa, email) VALUES (?, ?)";
        jdbcTemplate.update(clienteSql, generatedPessoaId, clienteDTO.getEmail());

        // 3. Salvar o Telefone
        // Verifica se um telefone foi enviado no DTO antes de tentar inseri-lo.
        if (clienteDTO.getTelefone() != null && !clienteDTO.getTelefone().isEmpty()) {
            String telefoneSql = "INSERT INTO Telefone (id_pessoa, numero) VALUES (?, ?)";
            jdbcTemplate.update(telefoneSql, generatedPessoaId, clienteDTO.getTelefone());
        }

        // 4. Salvar na tabela específica (PF ou PJ)
        if ("PF".equals(clienteDTO.getTipoCliente())) {
            String pfSql = "INSERT INTO cliente_fisica (id_pessoa, cpf) VALUES (?, ?)";
            jdbcTemplate.update(pfSql, generatedPessoaId, clienteDTO.getCpf());
        } else if ("PJ".equals(clienteDTO.getTipoCliente())) {
            String pjSql = "INSERT INTO cliente_juridico (id_pessoa, cnpj) VALUES (?, ?)";
            jdbcTemplate.update(pjSql, generatedPessoaId, clienteDTO.getCnpj());
        } else {
            throw new IllegalArgumentException("Tipo de cliente inválido: " + clienteDTO.getTipoCliente());
        }

        // 5. Atualizar o DTO com os valores padrão para retornar ao frontend
        // Isso garante que a resposta da API reflita o estado real do objeto no banco de dados.
        clienteDTO.setRanke(1); // Rank inicial Bronze
        clienteDTO.setAtivo(true); // Status inicial Ativo

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

        // 2. Atualizar a tabela Cliente
        // Atualizamos o email e o status 'ativo' com base no que vem do DTO.
        String clienteSql = "UPDATE Cliente SET email = ?, ativo = ? WHERE id_pessoa = ?";
        jdbcTemplate.update(clienteSql, clienteDTO.getEmail(), clienteDTO.getAtivo(), id);

        // 3. Atualizar o Telefone
        // Esta é uma lógica de "upsert": se o telefone existe, atualiza; se não, cria.
        if (clienteDTO.getTelefone() != null && !clienteDTO.getTelefone().isEmpty()) {
            String telefoneUpdateSql = "UPDATE Telefone SET numero = ? WHERE id_pessoa = ?";
            int rowsAffected = jdbcTemplate.update(telefoneUpdateSql, clienteDTO.getTelefone(), id);

            // Se nenhuma linha foi afetada, significa que não havia telefone para este cliente, então inserimos um novo.
            if (rowsAffected == 0) {
                String telefoneInsertSql = "INSERT INTO Telefone (id_pessoa, numero) VALUES (?, ?)";
                jdbcTemplate.update(telefoneInsertSql, id, clienteDTO.getTelefone());
            }
        }

        // 4. Atualizar a tabela específica (PF ou PJ) (sem alterações)
        if ("PF".equals(clienteDTO.getTipoCliente())) {
            String pfSql = "UPDATE cliente_fisica SET cpf = ? WHERE id_pessoa = ?";
            jdbcTemplate.update(pfSql, clienteDTO.getCpf(), id);
        } else if ("PJ".equals(clienteDTO.getTipoCliente())) {
            String pjSql = "UPDATE cliente_juridico SET cnpj = ? WHERE id_pessoa = ?";
            jdbcTemplate.update(pjSql, clienteDTO.getCnpj(), id);
        }

        return clienteDTO;
    }

    /**
     * Busca clientes com base em múltiplos critérios de filtro.
     * @param searchTerm Termo de busca para nome, email, documento ou telefone.
     * @param tipoCliente "PF" para Pessoa Física, "PJ" para Pessoa Jurídica.
     * @param status "ativo" ou "inativo" para o status do cliente.
     * @return Uma lista de ClienteDTOs que correspondem aos critérios.
     */
    public List<ClienteDTO> search(String searchTerm, String tipoCliente, String status) {
        // 1. Iniciar a construção da Query SQL
        StringBuilder sql = new StringBuilder(
                "SELECT " +
                        "p.id_pessoa, p.nome, p.rua, p.numero, p.bairro, p.cidade, " +
                        "c.email, c.ativo, c.ranke, c.total_gasto, c.data_ultima_compra, " +
                        "t.numero as telefone, " +
                        "cf.cpf, " +
                        "cj.cnpj " +
                        "FROM Pessoa p " +
                        "JOIN Cliente c ON p.id_pessoa = c.id_pessoa " +
                        "LEFT JOIN Telefone t ON p.id_pessoa = t.id_pessoa " + // JOIN com Telefone
                        "LEFT JOIN cliente_fisica cf ON c.id_pessoa = cf.id_pessoa " +
                        "LEFT JOIN cliente_juridico cj ON c.id_pessoa = cj.id_pessoa "
        );

        StringBuilder whereClause = new StringBuilder();
        List<Object> params = new ArrayList<>();

        // 2. Adicionar filtro de busca por texto (searchTerm)
        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            String likeTerm = "%" + searchTerm.trim().toLowerCase() + "%";
            whereClause.append("(LOWER(p.nome) LIKE ? OR LOWER(c.email) LIKE ? OR LOWER(t.numero) LIKE ? OR cf.cpf LIKE ? OR cj.cnpj LIKE ?)");
            params.add(likeTerm);
            params.add(likeTerm);
            params.add(likeTerm);
            params.add(likeTerm);
            params.add(likeTerm);
        }

        // 3. Adicionar filtro por Tipo de Cliente (PF/PJ)
        if (tipoCliente != null && !tipoCliente.trim().isEmpty()) {
            if (whereClause.length() > 0) whereClause.append(" AND ");

            if ("PF".equalsIgnoreCase(tipoCliente)) {
                whereClause.append("cf.id_pessoa IS NOT NULL");
            } else if ("PJ".equalsIgnoreCase(tipoCliente)) {
                whereClause.append("cj.id_pessoa IS NOT NULL");
            }
        }

        // 4. Adicionar filtro por Status (ativo/inativo)
        if (status != null && !status.trim().isEmpty()) {
            if (whereClause.length() > 0) whereClause.append(" AND ");
            whereClause.append("c.ativo = ?");
            params.add("ativo".equalsIgnoreCase(status)); // Converte "ativo" para true, qualquer outra coisa para false
        }

        // 5. Montar a query final
        if (whereClause.length() > 0) {
            sql.append(" WHERE ").append(whereClause);
        }
        sql.append(" ORDER BY p.nome;");

        // 6. Executar a query e mapear os resultados
        return jdbcTemplate.query(sql.toString(), params.toArray(), (rs, rowNum) -> {
            Pessoa pessoa = new Pessoa();
            pessoa.setId_pessoa(rs.getLong("id_pessoa"));
            pessoa.setNome(rs.getString("nome"));
            pessoa.setRua(rs.getString("rua"));
            pessoa.setNumero(rs.getString("numero"));
            pessoa.setBairro(rs.getString("bairro"));
            pessoa.setCidade(rs.getString("cidade"));

            ClienteDTO dto = new ClienteDTO();
            dto.setPessoa(pessoa);
            dto.setEmail(rs.getString("email"));
            dto.setTelefone(rs.getString("telefone"));
            dto.setAtivo(rs.getBoolean("ativo"));
            dto.setRanke(rs.getInt("ranke"));
            dto.setCpf(rs.getString("cpf"));
            dto.setCnpj(rs.getString("cnpj"));
            // Os campos total_gasto e data_ultima_compra estão disponíveis no 'rs' se você precisar deles no DTO

            if (dto.getCpf() != null) {
                dto.setTipoCliente("PF");
            } else if (dto.getCnpj() != null) {
                dto.setTipoCliente("PJ");
            }

            return dto;
        });
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


