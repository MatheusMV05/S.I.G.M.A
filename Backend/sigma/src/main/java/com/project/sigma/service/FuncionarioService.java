package com.project.sigma.service;

import com.project.sigma.dto.FuncionarioDTO;
import com.project.sigma.model.Funcionario;
import com.project.sigma.model.Pessoa;
import com.project.sigma.repository.FuncionarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.project.sigma.dto.FuncionarioDTO;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FuncionarioService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    /**
     * Cria um novo funcionário completo (Pessoa, Funcionario, Telefone) em uma única transação.
     * @param funcionarioDTO O DTO com os dados do funcionário.
     * @return O DTO com os IDs preenchidos.
     */
    @Transactional
    public FuncionarioDTO criarFuncionario(FuncionarioDTO funcionarioDTO) {
        // --- REGRAS DE NEGÓCIO ---
        if (funcionarioDTO.getPessoa() == null || !StringUtils.hasText(funcionarioDTO.getPessoa().getNome())) {
            throw new IllegalArgumentException("O nome do funcionário é obrigatório.");
        }
        if (funcionarioDTO.getFuncionario() == null || !StringUtils.hasText(funcionarioDTO.getFuncionario().getMatricula())) {
            throw new IllegalArgumentException("A matrícula do funcionário é obrigatória.");
        }
        // NOVA REGRA: Validação do telefone
        if (!StringUtils.hasText(funcionarioDTO.getTelefone())) {
            throw new IllegalArgumentException("O telefone do funcionário é obrigatório.");
        }

        // A lógica complexa foi movida para o repositório. O service apenas chama o método.
        return funcionarioRepository.save(funcionarioDTO);
    }

    /**
     * Busca funcionários, opcionalmente filtrando por cargo.
     */
    public List<FuncionarioDTO> buscarFuncionarios(String cargo) {
        // Chama o search do repository, sem ID, para buscar uma lista
        return funcionarioRepository.search(null, cargo);
    }

    /**
     * Busca um único funcionário pelo seu ID.
     */
    public Optional<FuncionarioDTO> buscarUmFuncionarioPorId(Long id) {
        // Chama o search do repository passando o ID
        List<FuncionarioDTO> funcionarios = funcionarioRepository.search(id, null);

        // Se a lista não estiver vazia, retorna o primeiro (e único) elemento.
        return funcionarios.stream().findFirst();
    }

    /**
     * Atualiza um funcionário existente em uma única transação.
     * @param id O ID do funcionário a ser atualizado.
     * @param funcionarioDTO O DTO com as informações atualizadas.
     * @return O DTO atualizado.
     */
    @Transactional
    public FuncionarioDTO atualizarFuncionario(Long id, FuncionarioDTO funcionarioDTO) {
        // Garante que os IDs estão corretos
        funcionarioDTO.getPessoa().setId_pessoa(id);

        // Adiciona validações também na atualização
        if (funcionarioDTO.getPessoa() == null || !StringUtils.hasText(funcionarioDTO.getPessoa().getNome())) {
            throw new IllegalArgumentException("O nome do funcionário é obrigatório.");
        }
        if (!StringUtils.hasText(funcionarioDTO.getTelefone())) {
            throw new IllegalArgumentException("O telefone do funcionário é obrigatório.");
        }

        return funcionarioRepository.update(funcionarioDTO);
    }


    /**
     * Deleta um funcionário pelo seu ID.
     * @param id O ID da pessoa/funcionário a ser deletada.
     */
    @Transactional
    public void deletarFuncionario(Long id) {
        // A chamada agora é única e o ON DELETE CASCADE faz o resto.
        funcionarioRepository.deleteById(id);
    }
}
