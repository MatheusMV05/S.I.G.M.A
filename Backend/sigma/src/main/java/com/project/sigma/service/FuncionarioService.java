package com.project.sigma.service;

import com.project.sigma.dto.FuncionarioDTO;
import com.project.sigma.model.Funcionario;
import com.project.sigma.model.Pessoa;
import com.project.sigma.repository.FuncionarioRepository;
import com.project.sigma.repository.PessoaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FuncionarioService {

    @Autowired
    private PessoaRepository pessoaRepository;

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    // CREATE
    @Transactional
    public FuncionarioDTO criarFuncionario(FuncionarioDTO funcionarioDTO) {
        // 1. Salva a parte "Pessoa" e recupera o objeto com o ID gerado
        Pessoa pessoaSalva = pessoaRepository.salvar(funcionarioDTO.getPessoa());

        // 2. Associa o ID da pessoa salva ao funcionário
        Funcionario funcionario = funcionarioDTO.getFuncionario();
        funcionario.setId_pessoa(pessoaSalva.getId_pessoa());

        // 3. Salva a parte "Funcionário"
        Funcionario funcionarioSalvo = funcionarioRepository.salvar(funcionario);

        // 4. Retorna o DTO completo com os dados salvos
        return new FuncionarioDTO(pessoaSalva, funcionarioSalvo);
    }

    // READ (all)
    public List<FuncionarioDTO> listarTodos() {
        List<Funcionario> funcionarios = funcionarioRepository.buscarTodos();
        return funcionarios.stream().map(func -> {
            Pessoa pessoa = pessoaRepository.buscarPorId(func.getId_pessoa())
                    .orElse(new Pessoa()); // ou lançar exceção se preferir
            return new FuncionarioDTO(pessoa, func);
        }).collect(Collectors.toList());
    }

    // READ (by ID)
    public Optional<FuncionarioDTO> buscarPorId(Long id) {
        Optional<Funcionario> funcionarioOpt = funcionarioRepository.buscarPorId(id);
        if (funcionarioOpt.isPresent()) {
            Optional<Pessoa> pessoaOpt = pessoaRepository.buscarPorId(id);
            if (pessoaOpt.isPresent()) {
                return Optional.of(new FuncionarioDTO(pessoaOpt.get(), funcionarioOpt.get()));
            }
        }
        return Optional.empty();
    }

    // UPDATE
    @Transactional
    public FuncionarioDTO atualizarFuncionario(Long id, FuncionarioDTO funcionarioDTO) {
        // Garante que os IDs estão corretos
        funcionarioDTO.getPessoa().setId_pessoa(id);
        funcionarioDTO.getFuncionario().setId_pessoa(id);

        pessoaRepository.atualizar(funcionarioDTO.getPessoa());
        funcionarioRepository.atualizar(funcionarioDTO.getFuncionario());

        return funcionarioDTO;
    }


    // DELETE
    @Transactional
    public void deletarFuncionario(Long id) {
        // 1. Deleta da tabela 'funcionario' (que tem a foreign key)
        funcionarioRepository.deletarPorId(id);
        // 2. Deleta da tabela 'Pessoa'
        pessoaRepository.deletarPorId(id);
    }
}
