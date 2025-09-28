package com.project.sigma.service;

import com.project.sigma.dto.ClienteDTO;
import com.project.sigma.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    @Autowired
    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    /**
     * Busca clientes com base em filtros opcionais. Se nenhum filtro for fornecido, retorna todos os clientes.
     * @param searchTerm Termo para buscar em nome, email, documento ou telefone.
     * @param tipoCliente "PF" ou "PJ".
     * @param status "ativo" ou "inativo".
     * @return Uma lista de ClienteDTO.
     */
    public List<ClienteDTO> buscarClientes(String searchTerm, String tipoCliente, String status) {
        // Agora chamamos SEMPRE o método search.
        // Se os parâmetros que chegam do Controller forem nulos,
        // o repositório já sabe que deve buscar todos os clientes, sem filtros.
        return clienteRepository.search(searchTerm, tipoCliente, status);
    }

    /**
     * Cria um novo cliente após validar as regras de negócio.
     * @param clienteDTO O DTO com os dados do cliente a ser criado.
     * @return O ClienteDTO salvo.
     * @throws IllegalArgumentException se os dados forem inválidos.
     */
    public ClienteDTO criarCliente(ClienteDTO clienteDTO) {
        // --- REGRAS DE NEGÓCIO ---

        if (clienteDTO.getPessoa() == null || !StringUtils.hasText(clienteDTO.getPessoa().getNome())) {
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

        return clienteRepository.save(clienteDTO);
    }

    /**
     * Atualiza um cliente existente.
     * @param id O ID do cliente a ser atualizado.
     * @param clienteDTO O DTO com as informações atualizadas.
     * @return O ClienteDTO atualizado.
     */
    public ClienteDTO atualizarCliente(Long id, ClienteDTO clienteDTO) {
        clienteDTO.getPessoa().setId_pessoa(id);

        if (clienteDTO.getPessoa() == null || !StringUtils.hasText(clienteDTO.getPessoa().getNome())) {
            throw new IllegalArgumentException("O nome do cliente é obrigatório.");
        }
        // Adicionamos também as validações de email e telefone na atualização
        if (!StringUtils.hasText(clienteDTO.getEmail())) {
            throw new IllegalArgumentException("O email do cliente é obrigatório.");
        }
        if (!StringUtils.hasText(clienteDTO.getTelefone())) {
            throw new IllegalArgumentException("O telefone do cliente é obrigatório.");
        }

        return clienteRepository.update(clienteDTO);
    }

    /**
     * Deleta um cliente pelo seu ID.
     * @param id O ID da pessoa/cliente a ser deletada.
     */
    public void deletarCliente(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("O ID do cliente não pode ser nulo para a exclusão.");
        }
        clienteRepository.deleteById(id);
    }
}
