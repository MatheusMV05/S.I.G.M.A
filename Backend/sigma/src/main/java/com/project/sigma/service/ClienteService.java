package com.project.sigma.service;

import com.project.sigma.dto.ClienteDTO;
import com.project.sigma.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    @Autowired
    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    /**
     * Busca todos os clientes.
     * @return Uma lista de ClienteDTO.
     */
    public List<ClienteDTO> buscarTodosClientes() {
        return clienteRepository.findAll();
    }

    /**
     * Cria um novo cliente após validar as regras de negócio.
     * @param clienteDTO O DTO com os dados do cliente a ser criado.
     * @return O ClienteDTO salvo, com o ID da pessoa preenchido.
     * @throws IllegalArgumentException se os dados forem inválidos.
     */
    public ClienteDTO criarCliente(ClienteDTO clienteDTO) {
        // --- REGRAS DE NEGÓCIO ---

        // Regra 1: O objeto Pessoa não pode ser nulo e deve ter um nome.
        if (clienteDTO.getPessoa() == null || clienteDTO.getPessoa().getNome() == null || clienteDTO.getPessoa().getNome().trim().isEmpty()) {
            throw new IllegalArgumentException("O nome do cliente é obrigatório.");
        }

        // Regra 2: O tipo de cliente (PF ou PJ) deve ser especificado.
        if (clienteDTO.getTipoCliente() == null || (!"PF".equals(clienteDTO.getTipoCliente()) && !"PJ".equals(clienteDTO.getTipoCliente()))) {
            throw new IllegalArgumentException("O tipo de cliente (PF ou PJ) é obrigatório.");
        }

        // Regra 3: Se for PF, o CPF é obrigatório. Se for PJ, o CNPJ é obrigatório.
        if ("PF".equals(clienteDTO.getTipoCliente()) && (clienteDTO.getCpf() == null || clienteDTO.getCpf().trim().isEmpty())) {
            throw new IllegalArgumentException("O CPF é obrigatório para cliente pessoa física.");
        }
        if ("PJ".equals(clienteDTO.getTipoCliente()) && (clienteDTO.getCnpj() == null || clienteDTO.getCnpj().trim().isEmpty())) {
            throw new IllegalArgumentException("O CNPJ é obrigatório para cliente pessoa jurídica.");
        }

        // Se todas as validações passarem, chama o repositório para salvar.
        return clienteRepository.save(clienteDTO);
    }

    /**
     * Atualiza um cliente existente após validar as regras de negócio.
     * @param id O ID do cliente a ser atualizado.
     * @param clienteDTO O DTO com as informações atualizadas.
     * @return O ClienteDTO atualizado.
     * @throws IllegalArgumentException se os dados forem inválidos.
     */
    public ClienteDTO atualizarCliente(Long id, ClienteDTO clienteDTO) {
        // Garante que o ID no DTO é o mesmo que o da URL
        clienteDTO.getPessoa().setId_pessoa(id);

        // --- REGRAS DE NEGÓCIO (semelhantes às de criação) ---
        if (clienteDTO.getPessoa() == null || clienteDTO.getPessoa().getNome() == null || clienteDTO.getPessoa().getNome().trim().isEmpty()) {
            throw new IllegalArgumentException("O nome do cliente é obrigatório.");
        }
        if ("PF".equals(clienteDTO.getTipoCliente()) && (clienteDTO.getCpf() == null || clienteDTO.getCpf().trim().isEmpty())) {
            throw new IllegalArgumentException("O CPF é obrigatório para cliente pessoa física.");
        }
        if ("PJ".equals(clienteDTO.getTipoCliente()) && (clienteDTO.getCnpj() == null || clienteDTO.getCnpj().trim().isEmpty())) {
            throw new IllegalArgumentException("O CNPJ é obrigatório para cliente pessoa jurídica.");
        }

        // Chama o repositório para executar a atualização
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
