package com.project.sigma.service;

import com.project.sigma.dto.UsuarioDTO;
import com.project.sigma.model.Funcionario;
import com.project.sigma.model.Pessoa;
import com.project.sigma.model.Usuario;
import com.project.sigma.repository.FuncionarioRepository;
import com.project.sigma.repository.PessoaRepository;
import com.project.sigma.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    @Autowired
    private PessoaRepository pessoaRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Cria um novo usuário
     */
    @Transactional
    public UsuarioDTO criarUsuario(UsuarioDTO dto) {
        // Validar se já existe usuário com este username
        if (usuarioRepository.findByUsername(dto.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username já está em uso");
        }

        // Validar se existe funcionário
        Optional<Funcionario> funcionarioOpt = funcionarioRepository.findById(dto.getId());
        if (funcionarioOpt.isEmpty()) {
            throw new IllegalArgumentException("Funcionário não encontrado com ID: " + dto.getId());
        }

        // Criar usuário
        Usuario usuario = new Usuario();
        usuario.setId_pessoa(dto.getId());
        usuario.setUsername(dto.getUsername());
        usuario.setPassword(passwordEncoder.encode(dto.getPassword()));
        usuario.setRole(Usuario.Role.valueOf(dto.getRole()));
        usuario.setStatus(Usuario.StatusUsuario.valueOf(dto.getStatus()));
        usuario.setUltimo_acesso(null);

        usuarioRepository.save(usuario);

        return converterParaDTO(usuario);
    }

    /**
     * Busca todos os usuários com informações completas
     */
    public List<UsuarioDTO> buscarTodos() {
        List<Usuario> usuarios = usuarioRepository.findAllWithFuncionarioInfo();
        return usuarios.stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    /**
     * Busca usuário por ID
     */
    public Optional<UsuarioDTO> buscarPorId(Long id) {
        return usuarioRepository.findByIdWithFuncionarioInfo(id)
                .map(this::converterParaDTO);
    }

    /**
     * Busca usuário por username
     */
    public Optional<Usuario> buscarPorLogin(String login) {
        return usuarioRepository.findByUsername(login);
    }

    /**
     * Busca usuários por role
     */
    public List<UsuarioDTO> buscarPorRole(String role) {
        List<Usuario> usuarios = usuarioRepository.findByRole(role);
        return usuarios.stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    /**
     * Busca usuários por status
     */
    public List<UsuarioDTO> buscarPorStatus(String status) {
        List<Usuario> usuarios = usuarioRepository.findByStatus(status);
        return usuarios.stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    /**
     * Atualiza um usuário
     */
    @Transactional
    public UsuarioDTO atualizarUsuario(Long id, UsuarioDTO dto) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        if (usuarioOpt.isEmpty()) {
            throw new IllegalArgumentException("Usuário não encontrado");
        }

        Usuario usuario = usuarioOpt.get();

        // Atualizar campos do usuário
        if (dto.getUsername() != null && !dto.getUsername().equals(usuario.getUsername())) {
            // Verificar se o novo username já está em uso
            Optional<Usuario> existente = usuarioRepository.findByUsername(dto.getUsername());
            if (existente.isPresent() && !existente.get().getId_pessoa().equals(id)) {
                throw new IllegalArgumentException("Username já está em uso");
            }
            usuario.setUsername(dto.getUsername());
        }

        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            usuario.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        if (dto.getRole() != null) {
            usuario.setRole(Usuario.Role.valueOf(dto.getRole()));
        }

        if (dto.getStatus() != null) {
            usuario.setStatus(Usuario.StatusUsuario.valueOf(dto.getStatus()));
        }

        usuarioRepository.save(usuario);

        // Atualizar dados do funcionário se fornecidos
        if (dto.getNome() != null || dto.getEmail() != null || dto.getTelefone() != null ||
            dto.getCargo() != null || dto.getSetor() != null || dto.getSalario() != null) {
            
            Optional<Funcionario> funcionarioOpt = funcionarioRepository.findById(id);
            if (funcionarioOpt.isPresent()) {
                Funcionario funcionario = funcionarioOpt.get();
                
                // Atualizar dados da Pessoa
                Optional<Pessoa> pessoaOpt = pessoaRepository.findById(id);
                if (pessoaOpt.isPresent()) {
                    Pessoa pessoa = pessoaOpt.get();
                    if (dto.getNome() != null) pessoa.setNome(dto.getNome());
                    if (dto.getEmail() != null) pessoa.setEmail(dto.getEmail());
                    // Telefone é gerenciado pela tabela Telefone, não pela Pessoa
                    pessoaRepository.save(pessoa);
                }

                // Atualizar dados do Funcionário
                if (dto.getCargo() != null) funcionario.setCargo(dto.getCargo());
                if (dto.getSetor() != null) funcionario.setSetor(dto.getSetor());
                if (dto.getSalario() != null) funcionario.setSalario(dto.getSalario());
                if (dto.getDataAdmissao() != null) funcionario.setData_admissao(dto.getDataAdmissao());
                if (dto.getTurno() != null) {
                    funcionario.setTurno(Funcionario.TurnoTrabalho.valueOf(dto.getTurno()));
                }
                if (dto.getTipoContrato() != null) {
                    funcionario.setTipo_contrato(Funcionario.TipoContrato.valueOf(dto.getTipoContrato()));
                }
                if (dto.getCargaHorariaSemanal() != null) {
                    funcionario.setCarga_horaria_semanal(dto.getCargaHorariaSemanal());
                }
                if (dto.getComissaoPercentual() != null) {
                    funcionario.setComissao_percentual(dto.getComissaoPercentual());
                }
                if (dto.getMetaMensal() != null) {
                    funcionario.setMeta_mensal(dto.getMetaMensal());
                }
                if (dto.getIdSupervisor() != null) {
                    funcionario.setId_supervisor(dto.getIdSupervisor());
                }

                funcionarioRepository.save(funcionario);
            }
        }

        return buscarPorId(id).orElseThrow();
    }

    /**
     * Atualiza apenas o status do usuário
     */
    @Transactional
    public void atualizarStatus(Long id, String status) {
        if (!usuarioRepository.existsById(id)) {
            throw new IllegalArgumentException("Usuário não encontrado");
        }
        usuarioRepository.updateStatus(id, status);
    }

    /**
     * Deleta um usuário
     */
    @Transactional
    public void deletarUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new IllegalArgumentException("Usuário não encontrado");
        }
        usuarioRepository.deleteById(id);
    }

    /**
     * Atualiza último acesso do usuário
     */
    @Transactional
    public void atualizarUltimoAcesso(Long id) {
        usuarioRepository.updateLastAccess(id, LocalDateTime.now());
    }

    /**
     * Retorna estatísticas de usuários
     */
    public Map<String, Object> obterEstatisticas() {
        List<Usuario> todos = usuarioRepository.findAllWithFuncionarioInfo();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", todos.size());
        stats.put("ativos", usuarioRepository.countActive());
        stats.put("admins", usuarioRepository.countByRole("ADMIN"));
        stats.put("users", usuarioRepository.countByRole("USER"));
        
        return stats;
    }

    /**
     * Converte Usuario para UsuarioDTO
     */
    private UsuarioDTO converterParaDTO(Usuario usuario) {
        UsuarioDTO dto = new UsuarioDTO();
        
        dto.setId(usuario.getId_pessoa());
        dto.setUsername(usuario.getUsername());
        dto.setRole(usuario.getRole().name());
        dto.setStatus(usuario.getStatus().name());
        dto.setUltimoAcesso(usuario.getUltimo_acesso());
        
        // Dados do funcionário
        if (usuario.getFuncionario() != null) {
            Funcionario func = usuario.getFuncionario();
            
            dto.setCpf(func.getCpf());
            dto.setMatricula(func.getMatricula());
            dto.setSalario(func.getSalario());
            dto.setCargo(func.getCargo());
            dto.setSetor(func.getSetor());
            dto.setDepartamento(func.getSetor());
            dto.setDataAdmissao(func.getData_admissao());
            dto.setDataContratacao(func.getData_admissao());
            
            if (func.getTurno() != null) {
                dto.setTurno(func.getTurno().name());
            }
            if (func.getTipo_contrato() != null) {
                dto.setTipoContrato(func.getTipo_contrato().name());
            }
            
            dto.setCargaHorariaSemanal(func.getCarga_horaria_semanal());
            dto.setComissaoPercentual(func.getComissao_percentual());
            dto.setMetaMensal(func.getMeta_mensal());
            dto.setIdSupervisor(func.getId_supervisor());
            
            // Dados da pessoa
            if (func.getPessoa() != null) {
                Pessoa pessoa = func.getPessoa();
                dto.setNome(pessoa.getNome());
                dto.setEmail(pessoa.getEmail());
                // Telefone virá do relacionamento com tabela Telefone
                if (pessoa.getTelefones() != null && !pessoa.getTelefones().isEmpty()) {
                    dto.setTelefone(pessoa.getTelefones().get(0).getNumero());
                }
            }
            
            // Nome do supervisor
            if (func.getSupervisor() != null && func.getSupervisor().getPessoa() != null) {
                dto.setNomeSupervisor(func.getSupervisor().getPessoa().getNome());
            }
        }
        
        return dto;
    }
}