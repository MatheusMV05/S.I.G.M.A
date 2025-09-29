package com.project.sigma.service;

import com.project.sigma.dto.FuncionarioDTO;
import com.project.sigma.model.Funcionario;
import com.project.sigma.model.Pessoa;
import com.project.sigma.model.Telefone;
import com.project.sigma.repository.FuncionarioRepository;
import com.project.sigma.repository.PessoaRepository;
import com.project.sigma.repository.TelefoneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FuncionarioService {

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    @Autowired
    private PessoaRepository pessoaRepository;

    @Autowired
    private TelefoneRepository telefoneRepository;

    /**
     * Cria um novo funcionário completo (Pessoa, Funcionario, Telefone) em uma única transação.
     * @param funcionarioDTO O DTO com os dados do funcionário.
     * @return O DTO com os IDs preenchidos.
     */
    @Transactional
    public FuncionarioDTO criarFuncionario(FuncionarioDTO funcionarioDTO) {
        // --- REGRAS DE NEGÓCIO ---
        if (!StringUtils.hasText(funcionarioDTO.getNome())) {
            throw new IllegalArgumentException("O nome do funcionário é obrigatório.");
        }
        if (!StringUtils.hasText(funcionarioDTO.getMatricula())) {
            throw new IllegalArgumentException("A matrícula do funcionário é obrigatória.");
        }
        if (!StringUtils.hasText(funcionarioDTO.getTelefone())) {
            throw new IllegalArgumentException("O telefone do funcionário é obrigatório.");
        }
        if (funcionarioDTO.getSalario() == null || funcionarioDTO.getSalario().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("O salário deve ser maior que zero.");
        }

        // Create Pessoa first
        Pessoa pessoa = new Pessoa();
        pessoa.setNome(funcionarioDTO.getNome());
        pessoa.setEmail(funcionarioDTO.getEmail());
        pessoa.setRua(funcionarioDTO.getRua());
        pessoa.setNumero(funcionarioDTO.getNumero());
        pessoa.setBairro(funcionarioDTO.getBairro());
        pessoa.setCidade(funcionarioDTO.getCidade());
        pessoa.setCep(funcionarioDTO.getCep());
        pessoa = pessoaRepository.save(pessoa);

        // Create Telefone
        if (StringUtils.hasText(funcionarioDTO.getTelefone())) {
            Telefone telefone = new Telefone();
            telefone.setId_pessoa(pessoa.getId_pessoa());
            telefone.setNumero(funcionarioDTO.getTelefone());
            telefone.setTipo(Telefone.TipoTelefone.COMERCIAL);
            telefoneRepository.save(telefone);
        }

        // Create Funcionario
        Funcionario funcionario = new Funcionario();
        funcionario.setId_pessoa(pessoa.getId_pessoa());
        funcionario.setMatricula(funcionarioDTO.getMatricula());
        funcionario.setSalario(funcionarioDTO.getSalario());
        funcionario.setCargo(funcionarioDTO.getCargo());
        funcionario.setSetor(funcionarioDTO.getSetor());
        funcionario.setId_supervisor(funcionarioDTO.getId_supervisor());
        funcionario.setStatus(Funcionario.StatusFuncionario.ATIVO);
        funcionario.setData_admissao(funcionarioDTO.getData_admissao() != null ?
            funcionarioDTO.getData_admissao() : LocalDate.now());
        funcionario = funcionarioRepository.save(funcionario);

        return convertToDTO(funcionario);
    }

    /**
     * Busca funcionários com filtros opcionais.
     * @param cargo Cargo para filtrar (opcional)
     * @return Lista de funcionários
     */
    public List<FuncionarioDTO> buscarFuncionarios(String cargo) {
        List<Funcionario> funcionarios;

        if (StringUtils.hasText(cargo)) {
            funcionarios = funcionarioRepository.findBySetor(cargo); // Using setor as proxy for cargo
        } else {
            funcionarios = funcionarioRepository.findAll();
        }

        return funcionarios.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Busca um funcionário específico por ID.
     * @param id ID do funcionário
     * @return Optional contendo o funcionário se encontrado
     */
    public Optional<FuncionarioDTO> buscarUmFuncionarioPorId(Long id) {
        return funcionarioRepository.findById(id)
                .map(this::convertToDTO);
    }

    /**
     * Atualiza um funcionário existente.
     * @param id ID do funcionário
     * @param funcionarioDTO Dados atualizados
     * @return DTO atualizado
     */
    @Transactional
    public FuncionarioDTO atualizarFuncionario(Long id, FuncionarioDTO funcionarioDTO) {
        Optional<Funcionario> funcionarioOpt = funcionarioRepository.findById(id);
        if (funcionarioOpt.isEmpty()) {
            throw new IllegalArgumentException("Funcionário não encontrado com ID: " + id);
        }

        if (!StringUtils.hasText(funcionarioDTO.getNome())) {
            throw new IllegalArgumentException("O nome do funcionário é obrigatório.");
        }

        Funcionario funcionario = funcionarioOpt.get();

        // Update Pessoa
        Optional<Pessoa> pessoaOpt = pessoaRepository.findById(id);
        if (pessoaOpt.isPresent()) {
            Pessoa pessoa = pessoaOpt.get();
            pessoa.setNome(funcionarioDTO.getNome());
            pessoa.setEmail(funcionarioDTO.getEmail());
            pessoa.setRua(funcionarioDTO.getRua());
            pessoa.setNumero(funcionarioDTO.getNumero());
            pessoa.setBairro(funcionarioDTO.getBairro());
            pessoa.setCidade(funcionarioDTO.getCidade());
            pessoa.setCep(funcionarioDTO.getCep());
            pessoaRepository.save(pessoa);
        }

        // Update Funcionario
        funcionario.setMatricula(funcionarioDTO.getMatricula());
        funcionario.setSalario(funcionarioDTO.getSalario());
        funcionario.setCargo(funcionarioDTO.getCargo());
        funcionario.setSetor(funcionarioDTO.getSetor());
        funcionario.setId_supervisor(funcionarioDTO.getId_supervisor());
        if (StringUtils.hasText(funcionarioDTO.getStatus())) {
            funcionario.setStatus(Funcionario.StatusFuncionario.valueOf(funcionarioDTO.getStatus()));
        }
        funcionario = funcionarioRepository.save(funcionario);

        return convertToDTO(funcionario);
    }

    /**
     * Deleta um funcionário pelo seu ID.
     * @param id ID do funcionário
     */
    @Transactional
    public void deletarFuncionario(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("O ID do funcionário não pode ser nulo para a exclusão.");
        }
        funcionarioRepository.deleteById(id);
    }

    /**
     * Busca funcionário por matrícula.
     * @param matricula Matrícula do funcionário
     * @return Optional contendo o funcionário se encontrado
     */
    public Optional<FuncionarioDTO> buscarPorMatricula(String matricula) {
        return funcionarioRepository.findByMatricula(matricula)
                .map(this::convertToDTO);
    }

    /**
     * Busca funcionários por setor.
     * @param setor Setor dos funcionários
     * @return Lista de funcionários do setor
     */
    public List<FuncionarioDTO> buscarPorSetor(String setor) {
        return funcionarioRepository.findBySetor(setor).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Converte Funcionario entity para DTO.
     * @param funcionario Entity
     * @return DTO
     */
    private FuncionarioDTO convertToDTO(Funcionario funcionario) {
        FuncionarioDTO dto = new FuncionarioDTO();

        // Set funcionario data
        dto.setId_pessoa(funcionario.getId_pessoa());
        dto.setMatricula(funcionario.getMatricula());
        dto.setSalario(funcionario.getSalario());
        dto.setCargo(funcionario.getCargo());
        dto.setSetor(funcionario.getSetor());
        dto.setId_supervisor(funcionario.getId_supervisor());
        dto.setStatus(funcionario.getStatus().name());
        dto.setData_admissao(funcionario.getData_admissao());
        dto.setAtivo(funcionario.getStatus() == Funcionario.StatusFuncionario.ATIVO);

        // Get Pessoa data
        Optional<Pessoa> pessoaOpt = pessoaRepository.findById(funcionario.getId_pessoa());
        if (pessoaOpt.isPresent()) {
            Pessoa pessoa = pessoaOpt.get();
            dto.setNome(pessoa.getNome());
            dto.setEmail(pessoa.getEmail());
            dto.setRua(pessoa.getRua());
            dto.setNumero(pessoa.getNumero());
            dto.setBairro(pessoa.getBairro());
            dto.setCidade(pessoa.getCidade());
            dto.setCep(pessoa.getCep());
        }

        // Get Telefone data
        List<Telefone> telefones = telefoneRepository.findByPessoa(funcionario.getId_pessoa());
        if (!telefones.isEmpty()) {
            dto.setTelefone(telefones.get(0).getNumero());
        }

        // Get supervisor name if exists
        if (funcionario.getId_supervisor() != null) {
            Optional<Pessoa> supervisorPessoaOpt = pessoaRepository.findById(funcionario.getId_supervisor());
            if (supervisorPessoaOpt.isPresent()) {
                dto.setNomeSupervisor(supervisorPessoaOpt.get().getNome());
            }
        }

        return dto;
    }
}
