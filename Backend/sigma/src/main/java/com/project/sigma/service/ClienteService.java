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
import com.project.sigma.dto.PaginatedResponseDTO;

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
     * MUDANÇA AQUI: Altera a assinatura para 5 argumentos e o tipo de retorno
     *
     * Busca clientes com base em filtros e paginação.
     * @param searchTerm Termo para buscar em nome, email, documento ou telefone.
     * @param tipoCliente "INDIVIDUAL" ou "COMPANY" (vem do frontend).
     * @param status true (ativo) ou false (inativo).
     * @param page Número da página.
     * @param size Tamanho da página.
     * @return Um PaginatedResponseDTO com os ClienteDTOs.
     */
    public PaginatedResponseDTO<ClienteDTO> buscarClientes(
            String searchTerm, String tipoCliente, Boolean status, int page, int size) {

        // 1. Buscar a lista de clientes da página atual
        List<Cliente> clientes = clienteRepository.findWithFiltersAndPagination(searchTerm, tipoCliente, status, page, size);

        // 2. Converter para DTOs
        List<ClienteDTO> clienteDTOs = clientes.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        // 3. Obter a contagem total de elementos
        int totalClientes = clienteRepository.countWithFilters(searchTerm, tipoCliente, status);

        // 4. Calcular o total de páginas
        int totalPages = (totalClientes + size - 1) / size;
        if (totalClientes == 0) {
            totalPages = 0;
        }

        // 5. Construir e retornar o DTO de resposta paginada
        PaginatedResponseDTO<ClienteDTO> response = new PaginatedResponseDTO<>();
        response.setContent(clienteDTOs);
        response.setTotalElements(totalClientes);
        response.setTotalPages(totalPages);

        // --- CORREÇÃO AQUI ---
        // O DTO usa 'number' para o número da página e 'size' para o tamanho.
        response.setNumber(page); // Em vez de setPageNumber
        response.setSize(size);   // Em vez de setPageSize

        // Também vamos preencher os outros campos do DTO para o frontend
        response.setPage(page); // O DTO também tem 'page'
        response.setFirst(page == 0);
        response.setLast(page == (totalPages - 1) || totalPages == 0);
        // Assumindo que PaginatedResponseDTO tem os setters apropriados

        return response;
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

            // ATUALIZAR TELEFONE
            List<Telefone> telefones = telefoneRepository.findByPessoa(id);
            if (!telefones.isEmpty()) {
                Telefone telefone = telefones.get(0);
                telefone.setNumero(clienteDTO.getTelefone());
                telefoneRepository.save(telefone);
            } // Adicionar lógica 'else' se necessário

            // ATUALIZAR DADOS PF/PJ
            if ("PF".equals(clienteDTO.getTipoCliente())) {
                Optional<ClienteFisico> cfOpt = clienteFisicoRepository.findById(id);
                if (cfOpt.isPresent()) {
                    ClienteFisico cf = cfOpt.get();
                    cf.setCpf(clienteDTO.getCpf());
                    cf.setData_nascimento(clienteDTO.getDataNascimento());
                    clienteFisicoRepository.save(cf);
                }
            } else {
                Optional<ClienteJuridico> cjOpt = clienteJuridicaRepository.findById(id);
                if (cjOpt.isPresent()) {
                    ClienteJuridico cj = cjOpt.get();
                    cj.setCnpj(clienteDTO.getCnpj());
                    cj.setRazao_social(clienteDTO.getRazaoSocial());
                    cj.setInscricao_estadual(clienteDTO.getInscricaoEstadual());
                    clienteJuridicaRepository.save(cj);
                }
            }

            // ATUALIZAR STATUS DO CLIENTE (Exemplo)
            cliente.setAtivo(clienteDTO.getAtivo());
            clienteRepository.save(cliente);
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

        dto.setId(cliente.getId_pessoa());

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
        
        // 👑 Calcular classificação VIP usando fn_classificar_cliente (Repository layer)
        dto.setClassificacao(classificarCliente(cliente.getId_pessoa()));

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

    // ================================================================
    // FUNÇÕES SQL (Etapa 05) - Classificação de Clientes
    // ================================================================

    /**
     * 🎯 Feature #3: Classificação VIP usando Função SQL
     * Classifica cliente baseado no total gasto usando fn_classificar_cliente
     * 
     * Classificações possíveis: DIAMANTE, PLATINA, OURO, PRATA, BRONZE
     * 
     * A lógica SQL está centralizada em ClienteRepository.classificarCliente()
     */
    public String classificarCliente(Long idCliente) {
        System.out.println("👑 Service: Classificando cliente ID " + idCliente);
        String classificacao = clienteRepository.classificarCliente(idCliente);
        System.out.println("✅ Classificação retornada: " + classificacao);
        return classificacao;
    }

    /**
     * 📊 Obter estatísticas gerais dos clientes
     * 
     * Retorna:
     * - total: Total de clientes cadastrados
     * - active: Total de clientes ativos
     * - inactive: Total de clientes inativos
     * - individuals: Total de clientes pessoa física (PF)
     * - businesses: Total de clientes pessoa jurídica (PJ)
     * - totalRevenue: Receita total gerada por todos os clientes
     * - averageTicket: Ticket médio por compra (receita total / total de compras)
     */
    public java.util.Map<String, Object> obterEstatisticas() {
        System.out.println("📊 Service: Calculando estatísticas de clientes");
        
        // Buscar todos os clientes (sem paginação)
        List<Cliente> todosClientes = clienteRepository.findAll();
        
        // Calcular estatísticas
        long total = todosClientes.size();
        long ativos = todosClientes.stream().filter(Cliente::getAtivo).count();
        long inativos = total - ativos;
        long pessoasFisicas = todosClientes.stream()
            .filter(c -> c.getTipo_pessoa() == Cliente.TipoPessoa.FISICA)
            .count();
        long pessoasJuridicas = todosClientes.stream()
            .filter(c -> c.getTipo_pessoa() == Cliente.TipoPessoa.JURIDICA)
            .count();
        
        // Receita total (soma de total_gasto de todos os clientes)
        BigDecimal receitaTotal = todosClientes.stream()
            .map(c -> c.getTotal_gasto() != null ? c.getTotal_gasto() : BigDecimal.ZERO)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Ticket médio: receita total / número total de vendas
        // Para calcular o total de compras, precisamos buscar do banco
        Integer totalCompras = clienteRepository.contarTotalCompras();
        double ticketMedio = totalCompras > 0 
            ? receitaTotal.doubleValue() / totalCompras 
            : 0.0;
        
        // Montar resposta
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("total", total);
        stats.put("active", ativos);
        stats.put("inactive", inativos);
        stats.put("individuals", pessoasFisicas);
        stats.put("businesses", pessoasJuridicas);
        stats.put("totalRevenue", receitaTotal.doubleValue());
        stats.put("averageTicket", ticketMedio);
        
        System.out.println("✅ Estatísticas: Total=" + total + ", Ativos=" + ativos + 
                         ", PF=" + pessoasFisicas + ", PJ=" + pessoasJuridicas + 
                         ", Receita=" + receitaTotal + ", Ticket Médio=" + ticketMedio);
        
        return stats;
    }
}

