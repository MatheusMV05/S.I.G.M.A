package com.project.sigma.service;

import com.project.sigma.dto.ClienteDTO;
import com.project.sigma.model.Cliente;
import com.project.sigma.model.ClienteFisico;
import com.project.sigma.model.ClienteJuridico;
import com.project.sigma.model.Pessoa;
import com.project.sigma.model.Telefone;
import com.project.sigma.repository.ClienteRepository;
import com.project.sigma.repository.ClienteFisicoRepository;
import com.project.sigma.repository.ClienteJuridicaRepository;
import com.project.sigma.repository.PessoaRepository;
import com.project.sigma.repository.TelefoneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private PessoaRepository pessoaRepository;

    @Autowired
    private ClienteFisicoRepository clienteFisicoRepository;

    @Autowired
    private ClienteJuridicaRepository clienteJuridicaRepository;

    @Autowired
    private TelefoneRepository telefoneRepository;

    public Optional<Cliente> buscarPorId(Long id) {
        return clienteRepository.findById(id);
    }

    /**
     * Busca clientes com base em filtros opcionais. Se nenhum filtro for fornecido, retorna todos os clientes.
     * @param searchTerm Termo para buscar em nome, email, documento ou telefone.
     * @param tipoCliente "PF" ou "PJ".
     * @param status "ativo" ou "inativo".
     * @return Uma lista de ClienteDTO.
     */
    public List<ClienteDTO> buscarClientes(String searchTerm, String tipoCliente, String status) {
        // For now, return all clients and implement search logic later
        List<Cliente> clientes = clienteRepository.findAll();
        return clientes.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<Cliente> buscarPorTipo(Cliente.TipoPessoa tipo) {
        return clienteRepository.findByTipo(tipo);
    }

    public List<Cliente> buscarPorNome(String nome) {
        // Implement search by name - for now return all
        return clienteRepository.findAll();
    }

    public Optional<Cliente> buscarPorEmail(String email) {
        // This would require a join query with Pessoa table
        // For now, return empty optional
        return Optional.empty();
    }

    public List<Cliente> buscarPorRanking(Integer ranking) {
        // Implement search by ranking - for now return all
        return clienteRepository.findAll();
    }

    /**
     * Cria um novo cliente após validar as regras de negócio.
     * @param clienteDTO O DTO com os dados do cliente a ser criado.
     * @return O ClienteDTO salvo.
     * @throws IllegalArgumentException se os dados forem inválidos.
     */
    @Transactional
    public ClienteDTO criarCliente(ClienteDTO clienteDTO) {
        // --- REGRAS DE NEGÓCIO ---
        if (clienteDTO.getNome() == null || !StringUtils.hasText(clienteDTO.getNome())) {
            throw new IllegalArgumentException("O nome do cliente é obrigatório.");
        }

        // NOVA REGRA: O email é obrigatório
        if (!StringUtils.hasText(clienteDTO.getEmail())) {
            throw new IllegalArgumentException("O email do cliente é obrigatório.");
        }

        // NOVA REGRA: O telefone é obrigatório
        if (!StringUtils.hasText(clienteDTO.getTelefone())) {
            throw new IllegalArgumentException("O telefone do cliente é obrigatório.");
        }

        if (clienteDTO.getTipoCliente() == null || (!"PF".equals(clienteDTO.getTipoCliente()) && !"PJ".equals(clienteDTO.getTipoCliente()))) {
            throw new IllegalArgumentException("O tipo de cliente (PF ou PJ) é obrigatório.");
        }

        if ("PF".equals(clienteDTO.getTipoCliente()) && !StringUtils.hasText(clienteDTO.getCpf())) {
            throw new IllegalArgumentException("O CPF é obrigatório para cliente pessoa física.");
        }

        if ("PJ".equals(clienteDTO.getTipoCliente()) && !StringUtils.hasText(clienteDTO.getCnpj())) {
            throw new IllegalArgumentException("O CNPJ é obrigatório para cliente pessoa jurídica.");
        }

        // Create Pessoa first
        Pessoa pessoa = new Pessoa();
        pessoa.setNome(clienteDTO.getNome());
        pessoa.setEmail(clienteDTO.getEmail());
        pessoa.setRua(clienteDTO.getRua());
        pessoa.setNumero(clienteDTO.getNumero());
        pessoa.setBairro(clienteDTO.getBairro());
        pessoa.setCidade(clienteDTO.getCidade());
        pessoa.setCep(clienteDTO.getCep());
        pessoa = pessoaRepository.save(pessoa);

        // Create Telefone
        if (StringUtils.hasText(clienteDTO.getTelefone())) {
            Telefone telefone = new Telefone();
            telefone.setId_pessoa(pessoa.getId_pessoa());
            telefone.setNumero(clienteDTO.getTelefone());
            telefone.setTipo(Telefone.TipoTelefone.CELULAR);
            telefoneRepository.save(telefone);
        }

        // Create Cliente
        Cliente cliente = new Cliente();
        cliente.setId_pessoa(pessoa.getId_pessoa());
        cliente.setTipo_pessoa("PF".equals(clienteDTO.getTipoCliente()) ?
            Cliente.TipoPessoa.FISICA : Cliente.TipoPessoa.JURIDICA);
        cliente.setAtivo(true);
        cliente.setRanking(1);
        cliente.setTotal_gasto(BigDecimal.ZERO);
        cliente = clienteRepository.save(cliente);

        // Create specific client type
        if ("PF".equals(clienteDTO.getTipoCliente())) {
            ClienteFisico clienteFisico = new ClienteFisico();
            clienteFisico.setId_pessoa(pessoa.getId_pessoa());
            clienteFisico.setCpf(clienteDTO.getCpf());
            if (clienteDTO.getDataNascimento() != null) {
                clienteFisico.setData_nascimento(clienteDTO.getDataNascimento());
            }
            clienteFisicoRepository.save(clienteFisico);
        } else {
            ClienteJuridico clienteJuridico = new ClienteJuridico();
            clienteJuridico.setId_pessoa(pessoa.getId_pessoa());
            clienteJuridico.setCnpj(clienteDTO.getCnpj());
            clienteJuridico.setRazao_social(clienteDTO.getRazaoSocial());
            clienteJuridico.setInscricao_estadual(clienteDTO.getInscricaoEstadual());
            clienteJuridicaRepository.save(clienteJuridico);
        }

        return convertToDTO(cliente);
    }

    /**
     * Atualiza um cliente existente.
     * @param id O ID do cliente a ser atualizado.
     * @param clienteDTO O DTO com as informações atualizadas.
     * @return O ClienteDTO atualizado.
     */
    @Transactional
    public ClienteDTO atualizarCliente(Long id, ClienteDTO clienteDTO) {
        Optional<Cliente> clienteOpt = clienteRepository.findById(id);
        if (clienteOpt.isEmpty()) {
            throw new IllegalArgumentException("Cliente não encontrado com ID: " + id);
        }

        if (clienteDTO.getNome() == null || !StringUtils.hasText(clienteDTO.getNome())) {
            throw new IllegalArgumentException("O nome do cliente é obrigatório.");
        }

        // Adicionamos também as validações de email e telefone na atualização
        if (!StringUtils.hasText(clienteDTO.getEmail())) {
            throw new IllegalArgumentException("O email do cliente é obrigatório.");
        }

        if (!StringUtils.hasText(clienteDTO.getTelefone())) {
            throw new IllegalArgumentException("O telefone do cliente é obrigatório.");
        }

        Cliente cliente = clienteOpt.get();

        // Update Pessoa
        Optional<Pessoa> pessoaOpt = pessoaRepository.findById(id);
        if (pessoaOpt.isPresent()) {
            Pessoa pessoa = pessoaOpt.get();
            pessoa.setNome(clienteDTO.getNome());
            pessoa.setEmail(clienteDTO.getEmail());
            pessoa.setRua(clienteDTO.getRua());
            pessoa.setNumero(clienteDTO.getNumero());
            pessoa.setBairro(clienteDTO.getBairro());
            pessoa.setCidade(clienteDTO.getCidade());
            pessoa.setCep(clienteDTO.getCep());
            pessoaRepository.save(pessoa);
        }

        return convertToDTO(cliente);
    }

    /**
     * Deleta um cliente pelo seu ID.
     * @param id O ID da pessoa/cliente a ser deletada.
     */
    @Transactional
    public void deletarCliente(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("O ID do cliente não pode ser nulo para a exclusão.");
        }
        clienteRepository.deleteById(id);
    }

    public void desativarCliente(Long id) {
        Optional<Cliente> clienteOpt = clienteRepository.findById(id);
        if (clienteOpt.isPresent()) {
            Cliente cliente = clienteOpt.get();
            cliente.setAtivo(false);
            clienteRepository.save(cliente);
        }
    }

    public Optional<ClienteFisico> buscarClienteFisicoPorCpf(String cpf) {
        return clienteFisicoRepository.findByCpf(cpf);
    }

    private ClienteDTO convertToDTO(Cliente cliente) {
        ClienteDTO dto = new ClienteDTO();

        // Get Pessoa data
        Optional<Pessoa> pessoaOpt = pessoaRepository.findById(cliente.getId_pessoa());
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
        List<Telefone> telefones = telefoneRepository.findByPessoa(cliente.getId_pessoa());
        if (!telefones.isEmpty()) {
            dto.setTelefone(telefones.get(0).getNumero());
        }

        // Set cliente data
        dto.setTipoCliente(cliente.getTipo_pessoa() == Cliente.TipoPessoa.FISICA ? "PF" : "PJ");
        dto.setAtivo(cliente.getAtivo());
        dto.setRanking(cliente.getRanking());
        dto.setTotalGasto(cliente.getTotal_gasto());

        // Get specific client type data
        if (cliente.getTipo_pessoa() == Cliente.TipoPessoa.FISICA) {
            Optional<ClienteFisico> clienteFisicoOpt = clienteFisicoRepository.findById(cliente.getId_pessoa());
            if (clienteFisicoOpt.isPresent()) {
                ClienteFisico cf = clienteFisicoOpt.get();
                dto.setCpf(cf.getCpf());
                dto.setDataNascimento(cf.getData_nascimento());
            }
        } else {
            Optional<ClienteJuridico> clienteJuridicoOpt = clienteJuridicaRepository.findById(cliente.getId_pessoa());
            if (clienteJuridicoOpt.isPresent()) {
                ClienteJuridico cj = clienteJuridicoOpt.get();
                dto.setCnpj(cj.getCnpj());
                dto.setRazaoSocial(cj.getRazao_social());
                dto.setInscricaoEstadual(cj.getInscricao_estadual());
            }
        }

        return dto;
    }
}
